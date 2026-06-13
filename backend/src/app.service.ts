import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'MealAI API',
      status: 'ok',
      version: '1.0.0',
      docs: {
        recipes: '/api/v1/recipes',
        auth: '/api/v1/auth',
        mealPlans: '/api/v1/meal-plans',
        recommendations: '/api/v1/recommendations',
      },
    };
  }
}
