import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  recipes: Recipe[] = [];
  newRecipe: Recipe = {} as Recipe;
  editedRecipe: Recipe = {} as Recipe;

  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    this.http.get<Recipe[]>('https://localhost:7143/api/Recipes').subscribe(
      (data) => {
        this.recipes = data;
      },
      (error) => {
        console.error('Error loading recipes', error);
      }
    );
  }

  navigateToAdd() {
    this.router.navigate(['/admin/addrecipe']);
  }

  navigateToEdit(recipe: Recipe){
    this.router.navigate(['/admin/editrecipe', recipe.recipeId], { state: { recipe } });
  }

  
  
  deleteRecipe(recipe: Recipe) {
    const confirmed = window.confirm(`Are you sure you want to delete the recipe "${recipe.name}"?`);
    if (confirmed) {
      this.http.delete<void>(`https://localhost:7143/api/Recipes/${recipe.recipeId}`).subscribe(
        () => {
          this.recipes = this.recipes.filter((r) => r.recipeId !== recipe.recipeId);
        },
        (error) => {
          console.error('Error deleting recipe', error);
        }
      );
    }
  }  
  
}