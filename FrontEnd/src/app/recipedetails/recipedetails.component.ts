export interface Comment {
  commentId: number;
  commentDesc: string;
  userId: number;
  recipeId: number;
  userName?: string;
}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router,RouterStateSnapshot  } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-recipedetails',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './recipedetails.component.html',
  styleUrl: './recipedetails.component.css'
})
export class RecipedetailsComponent implements OnInit {
  recipe: Recipe | undefined;
  comments: Comment[] = [];
  newComment: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router,private userService:UserService) { 
    this.comments = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = +params['id'];
      this.fetchRecipeDetails(recipeId);
      this.fetchComments(recipeId);
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
    };
    this.http.get<boolean>(`https://localhost:7143/api/Collections/Exists?userId=${userId}&recipeId=${recipe.recipeId}`).subscribe(
      (recipeExists) => {
        if (recipeExists) {
          alert('Recipe is already in favorites.');
          return;
        }
        this.http.post('https://localhost:7143/api/Collections', favoriteRecipe).subscribe(
          () => {
            alert('Recipe added to favorites successfully');
          },
          error => {
            console.error('Error adding recipe to favorites:', error);
          }
        );
      },
      error => {
        console.error('Error checking if recipe exists in favorites:', error);
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
    this.updateLikeCount(recipe.recipeId, recipe.likeCount).subscribe(
      () => {
        console.log('Like count updated successfully.');
      },
      error => {
        console.error('Error updating like count:', error);
      }
    );
    this.activeButton = 'like';
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
    this.updateDislikeCount(recipe.recipeId, recipe.dislikeCount).subscribe(
      () => {
        console.log('Dislike count updated successfully.');
      },
      error => {
        console.error('Error updating dislike count:', error);
      }
    );
    this.activeButton = 'dislike';
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


  fetchComments(recipeId: number): void {
    const url = `https://localhost:7143/api/Comments/ByRecipeId/${recipeId}`;
    this.http.get<Comment[]>(url).subscribe(
      (data) => {
        // Fetch user details for each comment
        this.comments = data;
        this.comments.forEach((comment, index) => {
          this.fetchUserDetails(comment.userId).subscribe(
            (userData) => {
              this.comments[index].userName = userData.name; // Assuming user name is stored in 'name' property
            },
            (error) => {
              console.error('Error fetching user details:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }
  
  fetchUserDetails(userId: number): Observable<any> {
    const url = `https://localhost:7143/api/Users/${userId}`;
    return this.http.get<any>(url);
  }
  

  isCommentEmpty(): boolean {
    return !this.newComment.trim();
  }

  addComment(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
    const newComment: Comment = {
      commentId: 0,
      commentDesc: this.newComment,
      userId: +userId,
      recipeId: this.recipe?.recipeId || 0
    };
    this.http.post<Comment>('https://localhost:7143/api/Comments', newComment).subscribe(
      (data) => {
        console.log('Comment added successfully');
        // Call fetchComments here to update comments after adding a new one
        this.fetchComments(this.recipe!.recipeId); // or this.recipe?.recipeId if you prefer
        this.newComment = '';
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }
  
  viewFavourite(){
    this.router.navigate(['user/favorites']);
  }

  goHome(){
    let utype=localStorage.getItem('userType')?.toLowerCase();
    if(utype=='admin')
      {
        this.router.navigate(['admin']);
      }
      else{
        this.router.navigate(['/user'])
      }
    
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login'])
  }
}
