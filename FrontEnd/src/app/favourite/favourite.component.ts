import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Collection } from '../collection';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';
import { error } from 'console';
import { UserService } from '../user.service';

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css'
})
export class FavouriteComponent implements OnInit {
  collections: Collection[] = [];

  constructor(private http: HttpClient,private router:Router, private userService:UserService) { }

  ngOnInit(): void {
    this.fetchCollectionsForCurrentUser();
  }

  fetchCollectionsForCurrentUser(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    this.http.get<Collection[]>(`https://localhost:7143/api/Collections/ByUser/${userId}`).subscribe(
      collections => {
        // For each collection, fetch the recipe details
        for (const collection of collections) {
          this.fetchRecipeDetails(collection);
        }
      },
      error => {
        console.error('Error fetching collections:', error);
      }
    );
  }

  fetchRecipeDetails(collection: Collection): void {
    this.http.get<Recipe>(`https://localhost:7143/api/Recipes/${collection.recipeId}`).subscribe(
      recipe => {
        // Add recipe details to the collection item
        collection.name = recipe.name;
        collection.image = recipe.image;
        // Push the updated collection to the array
        this.collections.push(collection);
      },
      error => {
        console.error('Error fetching recipe details:', error);
      }
    );
  }

  onCollectionClicked(collection: Collection): void {
    this.http.put(`https://localhost:7143/api/Recipes/recipes/${collection.recipeId}/increment-views`, {}).subscribe(
      () => {
        console.log('View count incremented successfully');
        // Optionally, you can navigate to the recipe details page after the view count is updated
        this.router.navigate(['/recipedetails', collection.recipeId], { state: { collection } });
      },
      error => {
        console.error('Error incrementing view count:', error);
        // Handle error
      }
    );
  }

  removeItem(collection: Collection):void{
    this.http.delete(`https://localhost:7143/api/Collections/${collection.collectionId}`,{}).subscribe(
      ()=>{
        alert("Deleted Succesfully");
        this.collections=[];
        this.fetchCollectionsForCurrentUser();
      },
      error=>{
        console.error("Error While removing",error);
      }
    )
  }
  viewFavourite(){
    this.router.navigate(['user/favorites']);
  }

  goHome(){
    let uid=localStorage.getItem('userId');
    if(uid=='1')
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