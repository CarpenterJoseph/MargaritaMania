window.onload = function () {
  recipeDB.open(refreshRecipes);
  var newRecipeForm = document.getElementById("new-recipe-form");
  var newInputName = document.getElementById("new-recipe");
  var newInputDes = document.getElementById("new-recipe-description");
  var newInputIng = document.getElementById("new-recipe-ingredients");
  var newInputCat = document.getElementById("new-recipe-category");

  // Handle new item form submissions.
  newRecipeForm.onsubmit = function (e) {
    e.preventDefault();

    // Get the text.
    var name = newInputName.value;
    var des = newInputDes.value;
    var ing = newInputIng.value;
    var cat = newInputCat.value;

    // Reset the input field.
    newInputName.value = "";
    newInputDes.value = "";
    newInputIng.value = "";
    newInputCat.value = "";

    console.log("Name: " + name + " des: " + des);

    recipeDB.createRecipe(name, des, ing, cat, refreshRecipes);

    var date = new Date();
    var timestamp = date.getTime(); // Time stamp is used as our primary key

    dynamoDB
      .postDrink({
        title: name,
        drinkDescription: des,
        ingredients: ing,
        category: cat,
        id: timestamp,
      })
      .then((result) => {
        console.log("SUCCESS: " + result);
      })
      .catch((err) => {
        console.log("ERROR: " + err);
      });
    // Don't send the form.
    return false;
  };
};

function refillLocalDB() {
  dynamoDB.getDrinks().then((drinks) => {
    recipeDB.fetchRecipes(function (recipes) {
      for (let index = 0; index < drinks.length; index++) {
        const localRecipes = [];
        recipes.forEach((recipe) => localRecipes.push({ id: recipe.recipeId }));

        if (!localRecipes.find((item) => item.id == drinks[index].recipeID)) {
          var drink = drinks[index];

          recipeDB.createRecipeWithId(
            drink.recipeID,
            drink.Name,
            drink.Description,
            drink.Ingredients,
            drink.Category,
            function () {}
          );
        }
      }
    });
  });
}

function refreshRecipes() {
  refillLocalDB();

  dynamoDB.getDrinks().then((drinks) => {
    var recipeList = document.getElementById("recipeslist");
    recipeList.innerHTML = "";

    //set recipeslist content
    drinks
      .forEach((recipeElement) => {
        console.log("Element: " + JSON.stringify(recipeElement));
        var li = document.createElement("li");
        var span = document.createElement("span");

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.setAttribute("data-id", recipeElement.recipeID);

        var returnString =
          "<p><b>Name:</b>" +
          recipeElement.Name +
          "</p> <p><b>Description:</b> " +
          recipeElement.Description +
          "<br> <b>Ingredients:</b> " +
          recipeElement.Ingredients +
          "</p>";
        span.innerHTML = returnString;

        li.appendChild(checkbox);
        li.appendChild(span);

        if (recipeElement.Category === "alcoholic") {
          alcoholicList.appendChild(li);
        } else {
          nonAlcoholicList.appendChild(li);
        }

        checkbox.addEventListener("click", (e) => {
          var id = parseInt(e.target.getAttribute("data-id"));
          recipeDB.deleteRecipe(id, () => {
            refreshRecipes();
          });
        });
      })
      .catch((err) => {
        console.log(`Error occured while fetching: ${err}`);
      });
  });
}
