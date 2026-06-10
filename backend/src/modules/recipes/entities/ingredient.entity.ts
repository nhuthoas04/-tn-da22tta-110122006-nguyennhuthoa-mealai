import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity('ingredients')
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    category: string; // rau_cu | thit | hai_san | gia_vi | khac

    @Column({ type: 'varchar', length: 20 })
    defaultUnit: string; // g | ml | quả | tép | muỗng

    @Column({ type: 'int', default: 0 })
    caloriesPer100g: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    proteinPer100g: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    carbsPer100g: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    fatPer100g: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    averagePrice: number; // VND

    @Column({ type: 'varchar', length: 500, nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    // --- Relations ---
    @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
    recipeIngredients: RecipeIngredient[];

    @OneToMany(() => Inventory, (inv) => inv.ingredient)
    inventoryItems: Inventory[];
}
