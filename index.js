window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
    OneSignal.init({
        appId: "e0ffda7d-3642-46f4-bbe1-6cbcec752ba8",
    });
});


window.onload = function () {
  recipeDB.open();

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

    recipeDB.createRecipe(name, des, ing, refreshRecipes);
    // Don't send the form.
    return false;
  };

  refreshRecipes();
};

function refreshRecipes() {
  recipeDB.fetchRecipes(function (recipes) {

    var recipeList = document.getElementById("recipeslist");
    recipeList.innerHTML = "";

    recipes.forEach((recipeElement) => {

      var li = document.createElement("li");
      var span = document.createElement("span");

      var returnString = recipeElement.Name + " " +  recipeElement.Description + " " + recipeElement.Ingredients
      span.innerHTML = returnString
      
      li.appendChild(span);
      recipeList.appendChild(li);
    });
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});
