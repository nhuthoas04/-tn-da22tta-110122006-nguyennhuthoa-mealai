import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_likes')
@Unique(['recipeId', 'userId'])
export class RecipeLike {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    recipeId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    // --- Relations ---
    @ManyToOne(() => Recipe, (recipe) => recipe.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
