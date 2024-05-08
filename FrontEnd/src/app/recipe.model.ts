// frontend/recipe.model.ts

export interface Recipe {
    recipeId: number;
    name: string;
    image: string;
    description: string;
    likeCount: number;
    dislikeCount: number;
    viewsCount: number;
    cookingtime: number;
    nutrition: number;
    userId: number;
  }
  