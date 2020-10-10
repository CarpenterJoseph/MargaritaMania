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

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.setAttribute("data-id", recipeElement.recipeId);
  
        var returnString = "<p><b>Name:</b>"+ recipeElement.Name + "</p> <p><b>Description:</b> " +  recipeElement.Description + "<br> <b>Ingredients:</b> " + recipeElement.Ingredients + "</p>"
        span.innerHTML = returnString
        
        li.appendChild(checkbox)
        li.appendChild(span);
        recipeList.appendChild(li);

        checkbox.addEventListener('click', (e) => {
          var id = parseInt(e.target.getAttribute("data-id"));
          recipeDB.deleteRecipe(id, () => {
            refreshRecipes();
          });
        });

      });
    });
  }