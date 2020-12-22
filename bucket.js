const SIGNED_S3_URL_FUNCTION = "https://7w8xcbe5ra.execute-api.eu-central-1.amazonaws.com/default/uploadPicUrl"

let imageURL = "";
let signURL = "";

async function uploadPicture(file) {
	console.log(file);
	// Get Signed URL
	const body = {key: file.name, type: "image/jpeg"};
	const options = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	}
	const rawResponse = await fetch(SIGNED_S3_URL_FUNCTION, options);
	const data = await rawResponse.json();
	//console.log("signedUrl", data.url);
	//console.log("photoUrl", data.photoURL);
	signURL = data.url;
	imageURL = data.photoURL;

	// After you obtain the signedUrl, you upload the file directly as the body.
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

