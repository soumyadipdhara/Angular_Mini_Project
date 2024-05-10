import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

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

  constructor(private http: HttpClient,private router:Router, private userService:UserService) { }

  addRecipe() {
    let uid=localStorage.getItem('userId');
    this.newRecipe.viewsCount=0;
    this.newRecipe.likeCount=0;
    this.newRecipe.dislikeCount=0;
    this.newRecipe.userId= Number(uid);
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
