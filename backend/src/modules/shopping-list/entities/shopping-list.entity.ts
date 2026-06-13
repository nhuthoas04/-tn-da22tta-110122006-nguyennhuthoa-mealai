import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { MealPlan } from '../../meal-plan/entities/meal-plan.entity';
import { ShoppingListItem } from './shopping-list-item.entity';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  mealPlanId: string;

  @Column({ type: 'varchar', length: 100, default: 'Shopping List' })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending | in_progress | completed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Relations ---
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => MealPlan, { nullable: true })
  @JoinColumn({ name: 'mealPlanId' })
  mealPlan: MealPlan;

  @OneToMany(() => ShoppingListItem, (item) => item.shoppingList, {
    cascade: true,
  })
  items: ShoppingListItem[];
}
