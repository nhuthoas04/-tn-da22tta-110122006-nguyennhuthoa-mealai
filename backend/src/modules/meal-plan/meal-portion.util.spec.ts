import { calculateMealPortionWarning } from './meal-portion.util';

describe('calculateMealPortionWarning', () => {
  it('warns for 1 person when the menu has more than 5 dishes per day', () => {
    const result = calculateMealPortionWarning({
      servings: 1,
      totalDishes: 6,
      dailyCalories: 2000,
    });

    expect(result.shouldWarn).toBe(true);
    expect(result.maxRecommendedDishes).toBe(5);
    expect(result.totalCaloriesNeeded).toBe(2000);
    expect(result.totalPortions).toBe(6);
  });

  it('warns for 2 people when the menu has more than 8 dishes per day', () => {
    const result = calculateMealPortionWarning({
      servings: 2,
      totalDishes: 9,
      dailyCalories: 2200,
    });

    expect(result.shouldWarn).toBe(true);
    expect(result.maxRecommendedDishes).toBe(8);
    expect(result.totalCaloriesNeeded).toBe(4400);
    expect(result.totalPortions).toBe(18);
  });

  it('warns for 4 people when the menu has more than 12 dishes per day', () => {
    const result = calculateMealPortionWarning({
      servings: 4,
      totalDishes: 13,
      dailyCalories: 2100,
    });

    expect(result.shouldWarn).toBe(true);
    expect(result.maxRecommendedDishes).toBe(12);
    expect(result.totalCaloriesNeeded).toBe(8400);
    expect(result.totalPortions).toBe(52);
  });

  it('warns for 6 people when the menu has more than 15 dishes per day', () => {
    const result = calculateMealPortionWarning({
      servings: 6,
      totalDishes: 16,
      dailyCalories: 2300,
    });

    expect(result.shouldWarn).toBe(true);
    expect(result.maxRecommendedDishes).toBe(15);
    expect(result.totalCaloriesNeeded).toBe(13800);
    expect(result.totalPortions).toBe(96);
  });
});
