import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { MealPlanModule } from './modules/meal-plan/meal-plan.module';
import { ShoppingListModule } from './modules/shopping-list/shopping-list.module';
import { SeedModule } from './modules/seed/seed.module';
import { UploadModule } from './modules/upload/upload.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    // Load .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL connection via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'recipe_ai'),
        autoLoadEntities: true,   // Auto-detect entities from modules
        synchronize: true,        // Auto-sync schema (disable in production!)
        logging: false,
      }),
    }),

    // Feature modules
    AuthModule,
    RecipesModule,
    InventoryModule,
    RecommendationModule,
    MealPlanModule,
    ShoppingListModule,
    SeedModule,
    UploadModule,
    ChatbotModule,
    NotificationModule,
  ],
})
export class AppModule { }
