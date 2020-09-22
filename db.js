var recipeDB = (function() {

var rDB = {};
 var datastore = null;


//open connection to indexedDB
rDB.open = function(){
var request = window.indexedDB.open("recipes", 2);

request.onerror = function(event){
    console.log("database-error: ", event.target.error);
};

request.onsuccess = function(event){
    var db = event.target.result;
    
    console.log("Database: ", db);
    console.log("Object store names: ", db.objectStoreNames);


 // Get a reference to the DB.
    datastore = event.target.result;

    
};

//New version - When browser detects new version number, it will  trigger an upgrade needed event.

request.onupgradeneeded = function(event){
var db = event.target.result;

        // Delete the old datastore.
        if (db.objectStoreNames.contains("recipe")) {
            console.log("Deleting the old databse");
            db.deleteObjectStore("recipe");
          }


    var store = db.createObjectStore("recipe", {keyPath: "recipeId"}
    );

    store.createIndex("Name","Name", {unique:false})
    store.createIndex("Description", "Description", {unique:false})
    store.createIndex("Ingredients","Ingredients", {unique:false})
};
};

rDB.createRecipe = function(name, description, ingredients){
    var db = datastore;
    var date = new Date();
    var timestamp = date.getTime();
    
    var recipeItem = { Name: name, Description: description, Ingredients: ingredients , recipeId: timestamp};
    // Initiate a new transaction.
    var transaction = db.transaction(["recipe"], "readwrite");
    // Get the datastore.
    var objStore = transaction.objectStore("recipe");
   

    // Create an object for the todo item.

    // Create the datastore request.
    const request = objStore.add(recipeItem);
    console.log("Object store:" + JSON.stringify(objStore))

    // Handle a successful datastore put.
    request.onsuccess = () => {
      console.log("Successfully Saved to do item: " + JSON.stringify(recipeItem));
    };

    // Execute the callback function.
    transaction.oncomplete = () => {
      console.log("Transaction completed on the database");
    };

    // Handle errors.
    transaction.onerror = () => {
      console.log("Transaction error happened on database");
    };
}

rDB.fetchRecipes = function(callback){
    console.log("Fetching function");

    var db = datastore;
    var transaction = db.transaction(["recipe"], "readwrite");
    var objStore = transaction.objectStore("recipe");

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var recipes = [];

    transaction.oncomplete = function (e) {
        callback(recipes);
    };

    cursorRequest.onsuccess = function (e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      recipes.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = rDB.onerror;
}
return rDB
})();
