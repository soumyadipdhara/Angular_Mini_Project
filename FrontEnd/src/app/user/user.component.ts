import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  recipes: any[]=[];

  constructor(private http: HttpClient,private router:Router,private userService:UserService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
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


  onRecipeClicked(recipe: Recipe): void {
    this.http.put(`https://localhost:7143/api/Recipes/recipes/${recipe.recipeId}/increment-views`, {}).subscribe(
      () => {
        console.log('View count incremented successfully');
        // Optionally, you can navigate to the recipe details page after the view count is updated
        this.router.navigate(['/recipedetails', recipe.recipeId], { state: { recipe } });
      },
      error => {
        console.error('Error incrementing view count:', error);
        // Handle error
      }
    );
  }


  viewFavourite(){
    this.router.navigate(['user/favorites']);
  }

  goHome(){
    this.router.navigate(['/user'])
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login'])
  }
}