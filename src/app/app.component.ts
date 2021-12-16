import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { RecipeService } from './recipe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public recipes: Recipe[];
  public editRecipe: Recipe;
  public deleteRecipe: Recipe;
  public recipe: Recipe;
  public steps: String[];

  constructor(private recipeService: RecipeService){}

  ngOnInit() {
    this.getRecipes();
  }

  public getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (response: Recipe[]) => {
        this.recipes = response;
        console.log(this.recipes);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddRecipe(addForm: NgForm): void {
    let recipe = addForm.value 
    console.log(recipe);
    this.recipeService.addRecipe(recipe).subscribe(
      (response: Recipe) => {
        console.log(response);
        this.getRecipes();
        addForm.reset();
        document.getElementById("addRecipeModal").click();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateRecipe(editForm: NgForm): void {
    let recipe = editForm.value 
    console.log(recipe);
    this.recipeService.updateRecipe(recipe).subscribe(
      (response: Recipe) => {
        console.log(response);
        this.getRecipes();
        document.getElementById("updateRecipeModal").click();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteRecipe(recipeId: number): void {
    this.recipeService.deleteRecipe(recipeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getRecipes();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchRecipes(key: string): void {
    console.log(key);
    const results: Recipe[] = [];
    for (const recipe of this.recipes) {
      console.log("Steps"+recipe.steps.toString().toLowerCase())
      if (recipe.ingredients.toString().toLowerCase().indexOf(key.toString().toLowerCase()) !== -1
      || recipe.name.toString().toLowerCase().indexOf(key.toString().toLowerCase()) !== -1){
        results.push(recipe);
      }
    }
    this.recipes = results;
    if (results.length === 0 || !key) {
      this.getRecipes();
    }
  }

  public onOpenModal(recipe: Recipe, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addRecipeModal');
    }
    if (mode === 'edit') {
      this.editRecipe = recipe;
      button.setAttribute('data-target', '#updateRecipeModal');
      event.stopPropagation();
    }
    if (mode === 'delete') {
      this.deleteRecipe = recipe;
      button.setAttribute('data-target', '#deleteRecipeModal');
      event.stopPropagation();
    }
    if (mode === 'view'){
      this.recipe = recipe;
      this.steps = recipe.steps.toString().split(",");
      button.setAttribute('data-target', '#viewRecipeModal');
    }
    container.appendChild(button);
    button.click();
  }
}