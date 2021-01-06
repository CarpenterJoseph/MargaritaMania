//dynomoDB will be a reference to all the CRUD functions towards the DB
var dynamoDB = (function () {

	//The object holding the functions
	var rDynamoDB = {};

	//post drink lampda funtion 
	// .then().catch() when implemented
	//The formData will be the json object and get passed into the function and saved into the DB. 
	rDynamoDB.postDrink = async function (formData) {

		//fetchings the function api gateway 
		const response = await fetch(
			" https://t3p39a6dcf.execute-api.eu-central-1.amazonaws.com/default/postDrink",
			{
				method: "POST",
				mode: "cors",
				body: JSON.stringify(formData),
			}
		);
		return response.json();
	};

	//get drink lampda function
    rDynamoDB.getDrinks = async function () {

		//fetchings the function api gateway 
		const response = await fetch(
			" https://bqll1b4dri.execute-api.eu-central-1.amazonaws.com/default/getDrink"
		);

		return response.json();
	};

	//delete drink lampda function by id
	//https://zdv7bwlf34.execute-api.eu-central-1.amazonaws.com
	rDynamoDB.deleteDrink = async function (id) {

		//fetchings the function api gateway 
		const response = await fetch(
			"https://zdv7bwlf34.execute-api.eu-central-1.amazonaws.com/default/deleteDrink",
			{
				method: "POST",
				mode: "cors",
				body: JSON.stringify({id: id})
			}
		)
		return response
	}

	//Returns it so we can access it from the dynamo DB
	return rDynamoDB;
})();
