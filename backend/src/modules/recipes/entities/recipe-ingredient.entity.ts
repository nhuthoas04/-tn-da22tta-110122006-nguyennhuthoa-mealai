import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

/** Junction table: links recipes to ingredients with quantities */
@Entity('recipe_ingredients')
export class RecipeIngredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    recipeId: string;

    @Column({ type: 'uuid' })
    ingredientId: string;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    quantity: number;

    @Column({ type: 'varchar', length: 20 })
    unit: string; // g | ml | thìa | muỗng | quả

    @Column({ type: 'boolean', default: false })
    isOptional: boolean;

    // --- Relations ---
    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ing) => ing.recipeIngredients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingredientId' })
    ingredient: Ingredient;
}
