const SIGNED_S3_URL_FUNCTION = "https://7w8xcbe5ra.execute-api.eu-central-1.amazonaws.com/default/uploadPicUrl"

let Img_url = "";
let Sign_url = "";
let file = "";

async function uploadPicture(file, album) {
    console.log(file, album);
  // Get Signed URL
  const body = {key: file.name, type: "image/jpeg", album: album}; 
  const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"    
      },
      body: JSON.stringify(body)
  }
  const rawResponse = await fetch(SIGNED_S3_URL_FUNCTION, options);
    const data = await rawResponse.json();
    console.log("signedUrl", data.url);
    console.log(data);
    Sign_url= data.url;
    Img_url = data.photoURL;

}

function handleFileChange(event) {
    file = (event.target.file[0]);

}