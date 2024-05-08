// frontend/recipe.model.ts

export interface Recipe {
    isDisliked: any;
    isLiked: any;
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
  