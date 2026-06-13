import {
  selectRecipesAvoidingRepeats,
  RepeatAwareRecipe,
} from './meal-repeat.util';

const buildRecipes = (count: number): RepeatAwareRecipe[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `recipe-${index + 1}`,
    name: `Món ${index + 1}`,
    tags: index % 3 === 0 ? ['rau'] : index % 3 === 1 ? ['canh'] : ['main'],
  }));

describe('selectRecipesAvoidingRepeats', () => {
  it('does not repeat any recipe when generating a 7-day plan from 50 recipes with noRepeatIn7Days enabled', () => {
    const recommendations = buildRecipes(50).map((recipe) => ({ recipe }));
    const weeklyUsedRecipeIds = new Set<string>();
    const selectedIds: string[] = [];

    for (let day = 0; day < 7; day++) {
      const currentDayRecipeIds = new Set<string>();
      const currentDayRecipeNames = new Set<string>();

      for (let meal = 0; meal < 3; meal++) {
        const result = selectRecipesAvoidingRepeats(recommendations, 1, {
          currentDayRecipeIds,
          currentDayRecipeNames,
          weeklyUsedRecipeIds,
          recentSuggestedRecipes: [],
          noRepeatIn7Days: true,
        });

        expect(result.usedFallback).toBe(false);
        expect(result.selected).toHaveLength(1);

        const recipe = result.selected[0];
        selectedIds.push(recipe.id);
        weeklyUsedRecipeIds.add(recipe.id);
        currentDayRecipeIds.add(recipe.id);
        currentDayRecipeNames.add(recipe.name);
      }
    }

    expect(selectedIds).toHaveLength(21);
    expect(new Set(selectedIds).size).toBe(selectedIds.length);
  });

  it('uses fallback only when there are not enough recipes to avoid repeats completely', () => {
    const recommendations = buildRecipes(2).map((recipe) => ({ recipe }));
    const weeklyUsedRecipeIds = new Set(['recipe-1', 'recipe-2']);

    const result = selectRecipesAvoidingRepeats(recommendations, 1, {
      currentDayRecipeIds: new Set(),
      currentDayRecipeNames: new Set(),
      weeklyUsedRecipeIds,
      recentSuggestedRecipes: [],
      noRepeatIn7Days: true,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.selected).toHaveLength(1);
  });

  it('does not reuse weekly recipes just because all new recipes are in recent suggestion history', () => {
    const recipes = buildRecipes(5);
    const recommendations = recipes.map((recipe) => ({ recipe }));

    const result = selectRecipesAvoidingRepeats(recommendations, 1, {
      currentDayRecipeIds: new Set(),
      currentDayRecipeNames: new Set(),
      weeklyUsedRecipeIds: new Set(['recipe-1', 'recipe-2']),
      recentSuggestedRecipes: recipes.map((recipe) => recipe.name),
      noRepeatIn7Days: true,
    });

    expect(result.usedFallback).toBe(false);
    expect(['recipe-3', 'recipe-4', 'recipe-5']).toContain(
      result.selected[0].id,
    );
  });
});
