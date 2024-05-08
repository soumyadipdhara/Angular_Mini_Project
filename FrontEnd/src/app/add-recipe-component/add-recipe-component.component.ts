import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe-component',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './add-recipe-component.component.html',
  styleUrl: './add-recipe-component.component.css'
})
export class AddRecipeComponentComponent {
  recipes: Recipe[] = [];
  newRecipe: Recipe = {} as Recipe;
  editedRecipe: Recipe = {} as Recipe;

  constructor(private http: HttpClient,private router:Router) { }

  addRecipe() {
    this.http.post<Recipe>('https://localhost:7143/api/Recipes', this.newRecipe).subscribe(
      (data) => {
        this.recipes.push(data);
        alert('Added successfully');
        this.router.navigate(['/admin']);
        this.newRecipe = {} as Recipe;
      },
      (error) => {
        console.error('Error adding recipe', error);
      }
    );
  }
}
