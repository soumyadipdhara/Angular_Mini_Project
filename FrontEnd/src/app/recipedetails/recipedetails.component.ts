import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router,RouterStateSnapshot  } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipedetails',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './recipedetails.component.html',
  styleUrl: './recipedetails.component.css'
})
export class RecipedetailsComponent implements OnInit {
  recipe: Recipe | undefined;
  

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = +params['id']; // Assuming the route parameter is named 'id'
      this.fetchRecipeDetails(recipeId);
    });
  }

  fetchRecipeDetails(recipeId: number): void {
    const url = `https://localhost:7143/api/Recipes/${recipeId}`;
    this.http.get<Recipe>(url).subscribe(
      (data) => {
        this.recipe = data;
      },
      (error) => {
        console.error('Error fetching recipe details:', error);
      }
    );
  }

  addToFavourite(recipe: Recipe): void {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
  
    const favoriteRecipe = {
      recipeId: recipe.recipeId,
      UserId: userId,
      // Add other properties if needed
    };
  
    // Check if the recipe already exists in the user's collection
    this.http.get<boolean>(`https://localhost:7143/api/Collections/Exists?userId=${userId}&recipeId=${recipe.recipeId}`).subscribe(
      (recipeExists) => {
        if (recipeExists) {
          console.log('Recipe is already in favorites.');
          // Optionally, you can update the UI or display a message to the user
          return;
        }
  
        // If recipe not found in user's collection, add it
        this.http.post('https://localhost:7143/api/Collections', favoriteRecipe).subscribe(
          () => {
            console.log('Recipe added to favorites successfully');
            // Optionally, you can update the UI or display a message to the user
          },
          error => {
            console.error('Error adding recipe to favorites:', error);
            // Handle error
          }
        );
      },
      error => {
        console.error('Error checking if recipe exists in favorites:', error);
        // Handle error
      }
    );
  }
  
  activeButton: string | null = null;

likeRecipe(recipe: Recipe): void {
  if (!recipe.isLiked) {
    recipe.likeCount++;
    recipe.isLiked = true;
    if (recipe.isDisliked) {
      recipe.dislikeCount--;
      recipe.isDisliked = false;
    }
    // Call API to update like count
    this.updateLikeCount(recipe.recipeId, recipe.likeCount).subscribe(
      () => {
        console.log('Like count updated successfully.');
      },
      error => {
        console.error('Error updating like count:', error);
        // Handle error
      }
    );
    this.activeButton = 'like'; // Set the active button to 'like'
  }
}

dislikeRecipe(recipe: Recipe): void {
  if (!recipe.isDisliked) {
    recipe.dislikeCount++;
    recipe.isDisliked = true;
    if (recipe.isLiked) {
      recipe.likeCount--;
      recipe.isLiked = false;
    }
    // Call API to update dislike count
    this.updateDislikeCount(recipe.recipeId, recipe.dislikeCount).subscribe(
      () => {
        console.log('Dislike count updated successfully.');
      },
      error => {
        console.error('Error updating dislike count:', error);
        // Handle error
      }
    );
    this.activeButton = 'dislike'; // Set the active button to 'dislike'
  }
}
  

  private updateLikeCount(recipeId: number, likeCount: number): Observable<any> {
    const url = `https://localhost:7143/api/Recipes/recipes/${recipeId}/increment-likes
    `;
    return this.http.put(url, null);
  }

  private updateDislikeCount(recipeId: number, dislikeCount: number): Observable<any> {
    const url = `https://localhost:7143/api/Recipes/recipes/${recipeId}/increment-dislikes`;
    return this.http.put(url, null);
  }
  
}