import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('recipe_edit_history')
export class RecipeEditHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  recipeId: string;

  @Column({ type: 'uuid' })
  editedBy: string;

  @Column({ type: 'jsonb' })
  changes: { field: string; oldValue: string; newValue: string }[];

  @CreateDateColumn()
  createdAt: Date;

  // --- Relations ---
  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'editedBy' })
  editor: User;
}
