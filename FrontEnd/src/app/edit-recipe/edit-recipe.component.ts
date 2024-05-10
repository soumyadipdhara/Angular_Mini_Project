import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

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

  constructor(private http: HttpClient, private route: ActivatedRoute,private router:Router,private userService:UserService) { }

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
    let uid=localStorage.getItem('userId');
    this.editedRecipe.likeCount=recipe.likeCount;
    this.editedRecipe.dislikeCount=recipe.dislikeCount;
    this.editedRecipe.viewsCount=recipe.viewsCount;
    this.editedRecipe.userId=Number(uid);
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