import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css'
})
export class EditRecipeComponent implements OnInit {
  editedRecipe!: Recipe;
  recipes: Recipe[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = +params['id'];
      this.http.get<Recipe>(`https://localhost:7143/api/Recipes/${recipeId}`).subscribe(
        (data) => {
          this.editedRecipe = data;
        },
        (error) => {
          console.error('Error fetching recipe data', error);
        }
      );
    });
  }

  updateRecipe(recipe: Recipe) {
    this.http.put<Recipe>(`https://localhost:7143/api/Recipes/${recipe.recipeId}`, this.editedRecipe).subscribe(
      (data) => {
        const index = this.recipes.findIndex((r) => r.recipeId === data.recipeId);
        alert('Update successful');
        this.router.navigate(['/admin']);
        if (index !== -1) {
          this.recipes[index] = data;
        }
        this.editedRecipe = {} as Recipe;
      },
      (error) => {
        console.error('Error updating recipe', error);
      }
    );
  }
}