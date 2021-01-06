
//Getting the lampda function for uploading a picture
const SIGNED_S3_URL_FUNCTION = "https://7w8xcbe5ra.execute-api.eu-central-1.amazonaws.com/default/uploadPicUrl"

// Variable for imageURL - The actual image For later use
let imageURL = "";

// Variable for the bucket Url - Where we want to send the image to
let signURL = "";


async function uploadPicture(file) {
	console.log(file);
	// Get Signed URL
	
	//Setting the file name and type
	const body = {key: file.name, type: "image/jpeg"};

	//Sending the file name and type. 
	const options = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		//Converts the Json object into a string
		body: JSON.stringify(body)
	}
	//Fetching the lampda function and the options
	const rawResponse = await fetch(SIGNED_S3_URL_FUNCTION, options);

	//Wait for a json response from the lampda function
	const data = await rawResponse.json();
	
	//Stores the local variables with the fected data
	signURL = data.url;
	imageURL = data.photoURL;

	// After you obtain the signedUrl, you upload the file directly as the body.
	//Putting Image into the bucket
	try {
		const res = await fetch(signURL, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "image/jpeg"
			},
			body: file
		});
		const text = await res.text();
	} catch (e) {
		console.error(e);
	}
	return imageURL
}

