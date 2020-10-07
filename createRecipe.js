window.onload = function () {

    recipeDB.open(refreshRecipes);
    var newRecipeForm = document.getElementById("new-recipe-form");
    var newInputName = document.getElementById("new-recipe");
    var newInputDes = document.getElementById("new-recipe-description");
    var newInputIng = document.getElementById("new-recipe-ingredients");
  
    // Handle new item form submissions.
    newRecipeForm.onsubmit = function (e) {
      e.preventDefault();
  
      // Get the text.
      var name = newInputName.value;
      var des = newInputDes.value;
      var ing = newInputIng.value;
  
      // Reset the input field.
      newInputName.value = "";
      newInputDes.value = "";
      newInputIng.value = "";
  
      console.log("Name: " + name + " des: " + des)

      recipeDB.createRecipe(name, des, ing, refreshRecipes);
      // Don't send the form.
      return false;
    };
  
};

  function refreshRecipes() {
    recipeDB.fetchRecipes(function (recipes) {
  
      var recipeList = document.getElementById("recipeslist");
      recipeList.innerHTML = "";
  
      recipes.forEach((recipeElement) => {
  
        var li = document.createElement("li");
        var span = document.createElement("span");
  
        var returnString = recipeElement.Name + " - Description: " +  recipeElement.Description + " - Ingredients: " + recipeElement.Ingredients
        span.innerHTML = returnString
        
        li.appendChild(span);
        recipeList.appendChild(li);
      });
    });
  }