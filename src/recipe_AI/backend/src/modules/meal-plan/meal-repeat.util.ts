export type RepeatAwareRecipe = {
  id: string;
  name: string;
  tags?: string[];
};

export type RepeatSelectionContext = {
  currentDayRecipeIds: Set<string>;
  currentDayRecipeNames: Set<string>;
  weeklyUsedRecipeIds: Set<string>;
  recentSuggestedRecipes: string[];
  noRepeatIn7Days?: boolean;
};

export type RepeatSelectionResult<TRecipe extends RepeatAwareRecipe> = {
  selected: TRecipe[];
  usedFallback: boolean;
};

const getRecipe = <TRecipe extends RepeatAwareRecipe>(
  candidate: TRecipe | { recipe: TRecipe },
) => ('recipe' in candidate ? candidate.recipe : candidate);

const uniqueRecipes = <TRecipe extends RepeatAwareRecipe>(
  candidates: Array<TRecipe | { recipe: TRecipe }>,
) => {
  const seen = new Set<string>();
  const recipes: TRecipe[] = [];

  for (const candidate of candidates) {
    const recipe = getRecipe(candidate);
    if (!recipe?.id || seen.has(recipe.id)) continue;
    seen.add(recipe.id);
    recipes.push(recipe);
  }

  return recipes;
};

export function selectRecipesAvoidingRepeats<TRecipe extends RepeatAwareRecipe>(
  recommendations: Array<TRecipe | { recipe: TRecipe }>,
  targetCount: number,
  context: RepeatSelectionContext,
): RepeatSelectionResult<TRecipe> {
  if (!recommendations?.length || targetCount <= 0) {
    return { selected: [], usedFallback: false };
  }

  const recipes = uniqueRecipes(recommendations);
  const selected: TRecipe[] = [];
  const localSelectedIds = new Set<string>();
  let usedFallback = false;

  const isCurrentDayRecipe = (recipe: TRecipe) =>
    context.currentDayRecipeIds.has(recipe.id) ||
    context.currentDayRecipeNames.has(recipe.name);

  const isRecentRecipe = (recipe: TRecipe) =>
    context.recentSuggestedRecipes.includes(recipe.name);

  const isWeeklyUsedRecipe = (recipe: TRecipe) =>
    context.weeklyUsedRecipeIds.has(recipe.id);

  const isStrictlyAvailable = (recipe: TRecipe) =>
    !isCurrentDayRecipe(recipe) &&
    !isRecentRecipe(recipe) &&
    (!context.noRepeatIn7Days || !isWeeklyUsedRecipe(recipe));

  const pickFrom = (
    candidates: TRecipe[],
    predicate: (recipe: TRecipe) => boolean,
    fallback: boolean,
  ) => {
    const recipe = candidates.find(
      (candidate) =>
        !localSelectedIds.has(candidate.id) && predicate(candidate),
    );
    if (!recipe) return false;

    selected.push(recipe);
    localSelectedIds.add(recipe.id);
    if (
      fallback &&
      (isCurrentDayRecipe(recipe) ||
        (context.noRepeatIn7Days && isWeeklyUsedRecipe(recipe)))
    ) {
      usedFallback = true;
    }
    return true;
  };

  const pickStrict = (candidates: TRecipe[]) =>
    pickFrom(candidates, isStrictlyAvailable, false);

  const mains = recipes.filter((recipe) => {
    const tags = recipe.tags || [];
    return !tags.includes('canh') && !tags.includes('rau');
  });
  const vegetables = recipes.filter((recipe) =>
    (recipe.tags || []).includes('rau'),
  );
  const soups = recipes.filter((recipe) =>
    (recipe.tags || []).includes('canh'),
  );

  if (targetCount === 1) {
    pickStrict(recipes);
  } else {
    pickStrict(mains);

    if (targetCount === 2) {
      pickStrict([...vegetables, ...soups]);
    } else {
      pickStrict(vegetables);
      pickStrict(soups);
    }
  }

  while (selected.length < targetCount && pickStrict(recipes)) {
    // Fill remaining slots with any strict, unused recipe before allowing repeats.
  }

  const fallbackStages: Array<{
    predicate: (recipe: TRecipe) => boolean;
    marksFallback: boolean;
  }> = [
    {
      predicate: (recipe) =>
        !isCurrentDayRecipe(recipe) &&
        (!context.noRepeatIn7Days || !isWeeklyUsedRecipe(recipe)),
      marksFallback: false,
    },
    {
      predicate: (recipe) =>
        !isCurrentDayRecipe(recipe) && !isRecentRecipe(recipe),
      marksFallback: true,
    },
    {
      predicate: (recipe) => !isCurrentDayRecipe(recipe),
      marksFallback: true,
    },
    {
      predicate: () => true,
      marksFallback: true,
    },
  ];

  for (const stage of fallbackStages) {
    while (selected.length < targetCount) {
      const added = pickFrom(recipes, stage.predicate, stage.marksFallback);
      if (!added) break;
    }
    if (selected.length >= targetCount) break;
  }

  return { selected, usedFallback };
}
