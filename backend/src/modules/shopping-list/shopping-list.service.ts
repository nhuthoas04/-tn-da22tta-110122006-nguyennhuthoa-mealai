import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingListItem } from './entities/shopping-list-item.entity';
import { MealPlan } from '../meal-plan/entities/meal-plan.entity';
import { MealPlanItem } from '../meal-plan/entities/meal-plan-item.entity';
import { RecipeIngredient } from '../recipes/entities/recipe-ingredient.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ShoppingListService {
    constructor(
        @InjectRepository(ShoppingList) private listRepo: Repository<ShoppingList>,
        @InjectRepository(ShoppingListItem) private itemRepo: Repository<ShoppingListItem>,
        @InjectRepository(MealPlanItem) private mealItemRepo: Repository<MealPlanItem>,
        @InjectRepository(RecipeIngredient) private riRepo: Repository<RecipeIngredient>,
        @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    /**
     * Get user's shopping lists
     */
    async findAll(userId: string) {
        const lists = await this.listRepo.find({
            where: { userId },
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });

        return {
            data: lists.map((list) => ({
                id: list.id,
                name: list.name,
                mealPlanId: list.mealPlanId,
                status: list.status,
                totalItems: list.items.length,
                purchasedItems: list.items.filter((i) => i.isPurchased).length,
                estimatedTotal: list.items.reduce(
                    (sum, i) => sum + (Number(i.estimatedPrice) || 0), 0,
                ),
                createdAt: list.createdAt,
            })),
        };
    }

    /**
     * Get shopping list details grouped by category
     */
    async findOne(userId: string, listId: string) {
        const list = await this.listRepo.findOne({
            where: { id: listId, userId },
            relations: ['items', 'items.ingredient'],
        });
        if (!list) throw new NotFoundException('Shopping list not found');

        // Group items by category
        const groups = new Map<string, any[]>();
        for (const item of list.items) {
            const category = item.category || 'Khác';
            if (!groups.has(category)) groups.set(category, []);
            groups.get(category)!.push({
                id: item.id,
                ingredient: {
                    id: item.ingredient.id,
                    name: item.ingredient.name,
                },
                quantity: item.quantity,
                unit: item.unit,
                estimatedPrice: item.estimatedPrice,
                isPurchased: item.isPurchased,
            });
        }

        return {
            id: list.id,
            name: list.name,
            status: list.status,
            estimatedTotal: list.items.reduce(
                (sum, i) => sum + (Number(i.estimatedPrice) || 0), 0,
            ),
            groups: Array.from(groups.entries()).map(([category, items]) => ({
                category,
                items,
            })),
        };
    }

    /**
     * Auto-generate shopping list from a meal plan
     * 
     * Algorithm:
     * 1. Collect ALL ingredients from ALL meals in the plan
     * 2. Merge duplicates and SUM quantities
     * 3. Subtract what user already has in inventory
     * 4. Group remaining by category
     */
    private readonly DAY_LABELS = {
        1: 'Thứ Hai',
        2: 'Thứ Ba',
        3: 'Thứ Tư',
        4: 'Thứ Năm',
        5: 'Thứ Sáu',
        6: 'Thứ Bảy',
        7: 'Chủ Nhật',
    };

    async generateFromPlan(userId: string, mealPlanId: string, days?: number[], mealDates?: string[]) {
        // Get user preferences (to find custom servings)
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['preferences'],
        });
        const userServings = user?.preferences?.servings || 4; // default to 4 if unset

        // Get all meal plan items with their recipes
        const planItems = await this.mealItemRepo.find({
            where: { mealPlanId },
            relations: ['recipe', 'recipe.recipeIngredients', 'recipe.recipeIngredients.ingredient'],
        });

        const getDayOfWeekIndex = (date: Date | string): number => {
            const d = new Date(date);
            const day = d.getDay();
            return day === 0 ? 7 : day;
        };

        const formatDateInput = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Filter plan items by specific days or dates if provided
        let filteredItems = planItems;
        if (mealDates && mealDates.length > 0) {
            filteredItems = planItems.filter((item) => {
                const dateStr = formatDateInput(new Date(item.mealDate));
                return mealDates.includes(dateStr);
            });
        } else if (days && days.length > 0) {
            filteredItems = planItems.filter((item) => days.includes(getDayOfWeekIndex(item.mealDate)));
        }

        // Step 1 & 2: Collect and merge all ingredients
        const needed = new Map<string, {
            ingredientId: string;
            name: string;
            quantity: number;
            unit: string;
            category: string;
            pricePerUnit: number;
        }>();

        for (const planItem of filteredItems) {
            if (!planItem.recipe?.recipeIngredients) continue;

            const recipeServings = planItem.recipe.servings || 4;
            const scale = userServings / recipeServings;

            for (const ri of planItem.recipe.recipeIngredients) {
                if (ri.isOptional) continue; // Skip optional ingredients

                const key = ri.ingredientId;
                const scaledQty = Number(ri.quantity) * scale;
                if (needed.has(key)) {
                    // Merge: add quantities
                    needed.get(key)!.quantity += scaledQty;
                } else {
                    needed.set(key, {
                        ingredientId: ri.ingredientId,
                        name: ri.ingredient.name,
                        quantity: scaledQty,
                        unit: ri.unit,
                        category: this.getCategoryLabel(ri.ingredient.category),
                        pricePerUnit: Number(ri.ingredient.averagePrice) || 0,
                    });
                }
            }
        }

        // Step 3: Subtract inventory
        const inventory = await this.inventoryRepo.find({
            where: { userId },
            relations: ['ingredient'],
        });

        const alreadyHave: { name: string; needed: number; have: number; unit: string }[] = [];
        const toBuy: { ingredientId: string; name: string; quantity: number; unit: string; category: string; pricePerUnit: number; estimatedPrice: number }[] = [];

        for (const [key, item] of needed) {
            const inv = inventory.find((i) => i.ingredientId === key);
            const haveQty = inv ? Number(inv.quantity) : 0;
            const needQty = item.quantity - haveQty;

            if (needQty <= 0) {
                alreadyHave.push({
                    name: item.name,
                    needed: item.quantity,
                    have: haveQty,
                    unit: item.unit,
                });
            } else {
                toBuy.push({
                    ...item,
                    quantity: needQty,
                    estimatedPrice: Math.round(needQty * item.pricePerUnit / 100),
                });
            }
        }

        // Create shopping list
        const weekLabel = new Date().toLocaleDateString('vi-VN');
        let listName = `Danh sách mua sắm - ${weekLabel}`;
        if (days && days.length > 0) {
            const dayNames = days.map((d) => this.DAY_LABELS[d] || `Thứ ${d}`).join(', ');
            listName = `Đi chợ (${dayNames}) - ${weekLabel}`;
        }

        const list = this.listRepo.create({
            userId,
            mealPlanId,
            name: listName,
            status: 'pending',
        });
        await this.listRepo.save(list);

        // Create items (only what needs to be purchased)
        const listItems = toBuy.map((item) =>
            this.itemRepo.create({
                shoppingListId: list.id,
                ingredientId: item.ingredientId,
                quantity: item.quantity,
                unit: item.unit,
                category: item.category,
                estimatedPrice: item.estimatedPrice,
                isPurchased: false,
            }),
        );
        await this.itemRepo.save(listItems);

        return {
            id: list.id,
            name: list.name,
            mealPlanId,
            totalItems: listItems.length,
            estimatedTotal: listItems.reduce((sum, i) => sum + (Number(i.estimatedPrice) || 0), 0),
            alreadyHave,
            toBuy: toBuy.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                unit: i.unit,
                estimatedPrice: i.estimatedPrice,
            })),
        };
    }

    /**
     * Mark item as purchased
     */
    async markPurchased(userId: string, listId: string, itemId: string, isPurchased: boolean) {
        const list = await this.listRepo.findOne({
            where: { id: listId, userId },
            relations: ['items'],
        });
        if (!list) throw new NotFoundException('Shopping list not found');

        const item = list.items.find((i) => i.id === itemId);
        if (!item) throw new NotFoundException('Item not found');

        item.isPurchased = isPurchased;
        await this.itemRepo.save(item);

        // Calculate progress
        const total = list.items.length;
        const purchased = list.items.filter((i) => i.id === itemId ? isPurchased : i.isPurchased).length;

        // Auto-update list status
        if (purchased === total) {
            list.status = 'completed';
        } else if (purchased > 0) {
            list.status = 'in_progress';
        }
        await this.listRepo.save(list);

        return {
            id: item.id,
            isPurchased,
            listProgress: {
                total,
                purchased,
                percent: Math.round((purchased / total) * 100 * 10) / 10,
            },
        };
    }

    /**
     * Delete a shopping list
     */
    async remove(userId: string, listId: string) {
        const list = await this.listRepo.findOne({ where: { id: listId, userId } });
        if (!list) throw new NotFoundException('Shopping list not found');
        await this.listRepo.remove(list);
        return { message: 'Shopping list deleted' };
    }

    /**
     * Create a new shopping list from a recipe's ingredients, subtracting inventory and scaling to user preferences
     */
    async addRecipeToList(userId: string, recipeId: string) {
        // 1. Get user servings preferences
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['preferences'],
        });
        const userServings = user?.preferences?.servings || 4;

        // 2. Get recipe details with ingredients
        const recipe = await this.listRepo.manager.getRepository(Recipe).findOne({
            where: { id: recipeId },
            relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
        });
        if (!recipe) throw new NotFoundException('Không tìm thấy món ăn này');

        // 3. Create a shopping list
        const listName = `Mua sắm: ${recipe.name}`;
        const list = this.listRepo.create({
            userId,
            name: listName,
            status: 'pending',
        });
        await this.listRepo.save(list);

        // 4. Scale ingredients and create items
        const recipeServings = recipe.servings || 4;
        const scale = userServings / recipeServings;

        // Get user's inventory to subtract already owned ingredients
        const inventory = await this.inventoryRepo.find({
            where: { userId },
            relations: ['ingredient'],
        });

        const listItems = [];
        for (const ri of recipe.recipeIngredients) {
            if (ri.isOptional) continue;

            // Subtract inventory
            const inv = inventory.find((i) => i.ingredientId === ri.ingredientId);
            const haveQty = inv ? Number(inv.quantity) : 0;
            const scaledQty = Number(ri.quantity) * scale;
            const needQty = scaledQty - haveQty;

            if (needQty <= 0) continue; // User has enough in inventory

            const estimatedPrice = Math.round(needQty * (Number(ri.ingredient.averagePrice) || 0) / 100);

            listItems.push(
                this.itemRepo.create({
                    shoppingListId: list.id,
                    ingredientId: ri.ingredientId,
                    quantity: parseFloat(needQty.toFixed(1)),
                    unit: ri.unit,
                    category: this.getCategoryLabel(ri.ingredient.category),
                    estimatedPrice,
                    isPurchased: false,
                })
            );
        }

        if (listItems.length > 0) {
            await this.itemRepo.save(listItems);
        }

        return {
            id: list.id,
            name: list.name,
            totalItems: listItems.length,
            estimatedTotal: listItems.reduce((sum, i) => sum + (Number(i.estimatedPrice) || 0), 0),
        };
    }

    // Vietnamese category labels
    private getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            rau_cu: 'Rau củ',
            thit: 'Thịt / Cá',
            hai_san: 'Hải sản',
            gia_vi: 'Gia vị',
            khac: 'Khác',
        };
        return labels[category] || 'Khác';
    }
}
