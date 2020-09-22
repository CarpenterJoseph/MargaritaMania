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


return rDB
})();
