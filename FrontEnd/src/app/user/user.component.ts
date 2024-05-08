import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  recipes: any[]=[];

  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.http.get<any[]>('https://localhost:7143/api/Recipes').subscribe(
      recipes => {
        this.recipes = recipes;
        console.log('Fetched recipes:', this.recipes);
      },
      error => {
        console.error('Error fetching recipes:', error);
      }
    );
  }


  onRecipeClicked(recipe: Recipe){
    this.router.navigate(['/recipedetails', recipe.recipeId], { state: { recipe } });
  }

}