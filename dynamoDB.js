//post drink
//
// fetch('https://pj0wgp8ipl.execute-api.eu-central-1.amazonaws.com/default/postDrink')
// 	.then((response) => {
// 		if(response.status != 200) {
// 			console.error('oopsie')
// 			return
// 		}
//
// 		response.json().then((data) => {
// 			console.log(data)
// 		})
// 	})
// 	.catch((err) => {
// 		console.log('asdads')
// 	})



//get drink
//
fetch('https://ic0g1vv319.execute-api.eu-central-1.amazonaws.com/default/getDrink')
	.then((response) => {
		if(response.status != 200) {
			console.error('oopsie')
			return
		}

		response.json().then((data) => {
			console.log(data)
		})
	})
	.catch((err) => {
		console.log(err)
	})



//get drinks
//https://yfpjb8y63j.execute-api.eu-central-1.amazonaws.com/default/getDrinks