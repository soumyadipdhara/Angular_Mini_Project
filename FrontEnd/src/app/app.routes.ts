import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AddRecipeComponentComponent } from './add-recipe-component/add-recipe-component.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { RecipedetailsComponent } from './recipedetails/recipedetails.component';
import { FavouriteComponent } from './favourite/favourite.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'register',component:RegisterComponent},
    {path:'user',component:UserComponent},
    {path:'admin',component:AdminComponent},
    {path:'admin/addrecipe',component:AddRecipeComponentComponent},
    {path:'admin/editrecipe/:id',component:EditRecipeComponent},
    {path:'recipedetails/:id', component:RecipedetailsComponent},
    {path:'user/favorites',component:FavouriteComponent}
];
