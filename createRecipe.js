let uploadFile = null

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

		let date = new Date();
		let timestamp = date.getTime(); // Time stamp is used as our primary key


		// Get the text.
		let name = newInputName.value;
		let des = newInputDes.value;
		let ing = newInputIng.value;
		let cat = newInputCat.value;
		let imageURL = ""

		//upload picture to s3 bucket then upload drink to db with imageurl
		uploadPicture(uploadFile).then(r => {
			imageURL = r
			dynamoDB
				.postDrink({
					title: name,
					drinkDescription: des,
					ingredients: ing,
					category: cat,
					id: timestamp,
					imgPath: imageURL
				})
				.then((result) => {
					//console.log("SUCCESS: " + result);
				})
				.catch((err) => {
					//console.log("ERROR: " + err);
				});

			//save drink to localdb
			recipeDB.createRecipeWithId(timestamp, name, des, ing, cat, imageURL, refreshRecipes);
		})




		// Reset the input field.
		newInputName.value = "";
		newInputDes.value = "";
		newInputIng.value = "";
		newInputCat.value = "";



		// Don't send the form.
		return false;
	};
};

function handleFileChange(event) {
	uploadFile = (event.files[0]);
}

function refillLocalDB() {
	dynamoDB.getDrinks().then((drinks) => {
		recipeDB.clearDatabase()
		recipeDB.fetchRecipes(function (recipes) {
			for (let index = 0; index < drinks.length; index++) {
				const localRecipes = [];
				const cloudIds = []
				recipes.forEach((recipe) => localRecipes.push({id: recipe.recipeId}));

				if (!localRecipes.find((item) => item.id == drinks[index].recipeID)) {
					var drink = drinks[index];

					recipeDB.createRecipeWithId(
						drink.recipeID,
						drink.Name,
						drink.Description,
						drink.Ingredients,
						drink.Category,
						drink.Image,
						function () {
						}
					);
				}
			}
		});
	});
}

function refreshRecipes() {
	refillLocalDB();

	recipeDB.fetchRecipes(function (recipes) {
		var alcoholicList = document.getElementById("Alcoholic-List");
		alcoholicList.innerHTML = "";
		var non_alcoholicList = document.getElementById("Non-alcoholic-List");
		non_alcoholicList.innerHTML = "";
		//set recipeslist content
		recipes
			.forEach((recipeElement) => {
				//console.log("Element: " + JSON.stringify(recipeElement));
				var li = document.createElement("li");
				var span = document.createElement("span");

				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.className = "todo-checkbox";
				checkbox.setAttribute("data-id", recipeElement.recipeId);

				var returnString =
					"<p><b>Name:</b>" +
					recipeElement.Name +
					"</p> <p><b>Description:</b> " +
					recipeElement.Description +
					"<br> <b>Ingredients:</b> " +
					recipeElement.Ingredients +
					"</p>" +
					`<img src='${recipeElement.Image}'>`;
				span.innerHTML = returnString;

				li.appendChild(checkbox);
				li.appendChild(span);

				if (recipeElement.Category === "alcoholic") {
					alcoholicList.appendChild(li);
				} else {
					non_alcoholicList.appendChild(li);
				}

				checkbox.addEventListener("click", (e) => {
					var id = parseInt(e.target.getAttribute("data-id"));
					//console.log("ID to delete: " + id)
					dynamoDB.deleteDrink(id)
						.then(res => {
							recipeDB.deleteRecipe(id, () => {
								refreshRecipes();
							});
						})

				});
			})
	});
}
