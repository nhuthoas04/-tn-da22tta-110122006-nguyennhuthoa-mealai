import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingListItem } from './entities/shopping-list-item.entity';
import { MealPlanItem } from '../meal-plan/entities/meal-plan-item.entity';
import { RecipeIngredient } from '../recipes/entities/recipe-ingredient.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../auth/entities/user.entity';
import { PdfModule } from '../pdf/pdf.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ShoppingList, ShoppingListItem,
            MealPlanItem, RecipeIngredient, Inventory, User,
        ]),
        PdfModule,
    ],
    controllers: [ShoppingListController],
    providers: [ShoppingListService],
    exports: [ShoppingListService],
})
export class ShoppingListModule { }
