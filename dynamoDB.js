var dynamoDB = (function () {
  var rDynamoDB = {};

  //post drink
  // .then().catch() when implemented
  rDynamoDB.postDrink = async function (formData) {
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

  //get drink
  rDynamoDB.getDrinks = async function () {
    const response = await fetch(
      " https://bqll1b4dri.execute-api.eu-central-1.amazonaws.com/default/getDrink"
    );

    return response.json();
  };

  return rDynamoDB;
})();
