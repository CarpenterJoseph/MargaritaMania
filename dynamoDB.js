var dynomoDB = (function () {
	var rDynamoDB = {}

	//post drink
	// .then().catch() when implemented
	rDynamoDB.postDrink = async function(formData) {
		const reponse = await fetch('https://t3p39a6dcf.execute-api.eu-central-1.amazonaws.com', {
			method: 'POST',
			body: JSON.stringify(formData)
		})

		return response.json()
	}

	//get drink
	rDynamoDB.getDrinks = function() {
		fetch('https://bqll1b4dri.execute-api.eu-central-1.amazonaws.com')
			.then((response) => {
				if (response.status != 200) {
					console.error('oopsie')
					return
				}

				return response.json();
			})
		}

	return rDynamoDB;
})();