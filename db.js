var recipeDB = (function () {     // This is the variable (recipeDB) that we can use in other files to communicate with the DB
  var rDB = {};         // This object holds the methods and this is the object we return at the end of the file
  var datastore = null; // This variable is necessary to use the same datastore through the whole process

  //open connection to indexedDB
  rDB.open = function (callback) {
    var request = window.indexedDB.open("recipes", 2);

    //New version - When browser detects new version number, it will  trigger an upgrade needed event.
    request.onupgradeneeded = function (event) {
      var db = event.target.result;

      // Delete the old datastore.
      if (db.objectStoreNames.contains("recipe")) {
        console.log("Deleting the old databse");
        db.deleteObjectStore("recipe");
      }

      // creates the database called "recipe"
      var store = db.createObjectStore("recipe", { keyPath: "recipeId" });

      // Creates the fields inside the database
      store.createIndex("Name", "Name", { unique: false });
      store.createIndex("Description", "Description", { unique: false });
      store.createIndex("Ingredients", "Ingredients", { unique: false });
    };

    // This event fires when the database was created successfully
    request.onsuccess = function (event) {
      var db = event.target.result;

      console.log("Database: ", db);
      console.log("Object store names: ", db.objectStoreNames);

      // Get a reference to the DB.
      datastore = event.target.result;

      callback()
    };

    // This event fires when something went wrong while creating the database
    request.onerror = function (event) {
      console.log("database-error: ", event.target.error);
    };



  };

  // This method is responsible to save new data into our database
  rDB.createRecipe = function (name, description, ingredients, callback) {
    var db = datastore;  // Here we use the reference we initialised in the open() method to get a connection to the databse
    var date = new Date();
    var timestamp = date.getTime(); // Time stamp is used as our primary key

    // This is the schema of our data
    // It has to be an object because only objects can be stored in an IndexedDB
    var recipeItem = {
      Name: name,
      Description: description,
      Ingredients: ingredients,
      recipeId: timestamp,
    };
    // Initiate a new transaction.
    var transaction = db.transaction(["recipe"], "readwrite");
    // Get the datastore.
    var objStore = transaction.objectStore("recipe");

    // Create the datastore request.
    const request = objStore.add(recipeItem);
    console.log("Object store:" + JSON.stringify(objStore));

    // Handle a successful datastore put.
    request.onsuccess = () => {
      console.log(
        "Successfully Saved to do item: " + JSON.stringify(recipeItem)
      );
      callback() // when the saving is successfull it calles the method passed in automatically
    };

    // Execute the callback function.
    transaction.oncomplete = () => {
      console.log("Transaction completed on the database");
    };

    // Handle errors.
    transaction.onerror = () => {
      window.location.href = window.location.hostname + "/offline.html"
    };
  };

  // This part is responsible for getting all data from the Database
  rDB.fetchRecipes = function (callback) {
    console.log("Fetching function");

    var db = datastore;  // We are using the database instance saved in the open() function
    var transaction = db.transaction(["recipe"], "readwrite");
    var objStore = transaction.objectStore("recipe");

    var keyRange = IDBKeyRange.lowerBound(0);         // ??
    var cursorRequest = objStore.openCursor(keyRange);  // ??

    // This list will hold all the extracted objects from the database
    var recipes = [];

    // This part is essential in returning the data
    // This function returns the data stored in the "recipes[]" in the form of a callback
    // That means when we call it we can extract the data with a method (index.js refreshRecipes())
    // Its also important to point out that this is the oncomplete() event which only fires when
    // The transaction is over successfully
    transaction.oncomplete = function (e) {
      callback(recipes);
    };

    // This is where we extract the data from the database
    cursorRequest.onsuccess = function (e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      recipes.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = rDB.onerror;
  };

  // This is the delete method that deletes elements from the database by their ID
  rDB.deleteRecipe = function (id, callback) {
    console.log("ID to delete: " + id)
    var db = datastore;
    var transaction = db.transaction(["recipe"], "readwrite");
    var objStore = transaction.objectStore("recipe");

    var request = objStore.delete(id);

    request.onsuccess = function (e) {
      callback();
    };

    request.onerror = function (e) {
      window.location.href = window.location.hostname + "/offline.html"
    };
  }

  return rDB; // We return the rDB which gives us access to the methods above
})(); // This means that the file is compiled automatically
