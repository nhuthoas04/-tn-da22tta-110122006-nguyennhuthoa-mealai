import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('recipe_moderation_audits')
export class RecipeModerationAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  recipeId: string;

  @Column({ type: 'boolean', default: false })
  isApprovedByAI: boolean;

  @Column({ type: 'int' })
  qualityScore: number; // 0 - 100

  @Column({ type: 'simple-array', nullable: true })
  missingIngredients: string[];

  @Column({ type: 'simple-array', nullable: true })
  missingSteps: string[];

  @Column({ type: 'text', nullable: true })
  nutritionValidityNotes: string;

  @Column({ type: 'boolean', default: false })
  isDuplicateDetected: boolean;

  @Column({ type: 'uuid', nullable: true })
  duplicateOfRecipeId: string;

  @Column({ type: 'text', nullable: true })
  rawAIFeedback: string;

  @CreateDateColumn()
  createdAt: Date;
}
