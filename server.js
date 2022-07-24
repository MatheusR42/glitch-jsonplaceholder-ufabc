const express = require("express");
const app = express();
const axios = require('axios');

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/webhook", function (request, response) {
  var intentName = request.body.queryResult.intent.displayName;
  var parameters = request.body.queryResult.parameters;
  console.log(intentName)
  console.log(parameters)
  response.json({"fulfillmentText" : "Aloooo!"});
  
  // Make a request for a user with a given ID
  axios.get('/user?ID=12345')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  return;

  


//       response.json({
//         "fulfillmentMessages": [
//                 {
//                   "card": {
//                     "title": "Processo Seletivo",
//                     "subtitle": "Bem vindo ao nosso Processo seletivo",
//                     "imageUri": "https://cdn.glitch.global/40696ccc-9795-4f13-933d-12fb6ceec97b/processo-seletivo.jpg?v=1658277254993"
//                   }
//                 },
//                 {
//                   "text" :{
//                      "text": [
//                         "Os campi da UFABC estão sediados nos municípios de Santo André e São Bernardo do Campo"
//                     ]
//                   }
//                 },
//                 {
//                   "image":{

//                       "imageUri": "https://www.ufabc.edu.br/images/imagens_a_ufabc/campus-sa.jpg",
//                       "accessibilityText": "Campus em Santo André"

//                   }
//                 },
//                 {
//                   "image":{

//                       "imageUri": "https://www.ufabc.edu.br/images/imagens_a_ufabc/campus-sbc.jpg",
//                       "accessibilityText": "Campus em São Bernardo do Campo"

//                   }
//                 },
//                 {
//                   "text" :{
//                      "text": [
//                         "Nossos campi são os melhores do Brasil"
//                     ]
//                   }
//                 },
//                 {
//                   "text" :{
//                      "text": [
//                         "Voce quer participar do processo seletivo?"
//                     ]
//                   }
//                 }
//               ]
//        });

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
