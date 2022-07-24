const express = require("express");
const app = express();
const axios = require("axios");

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

function filterTasksByState(todos, status) {
  return todos.filter(({completed}) => completed === (status === "done"));
}

function mapTodoToText(todos) {
  return todos.map(({id, userId, title, completed}) => {
    return {
      text: {
        text: [
          `${userId} - ${title} - ${(completed ? 'done' : 'todo')}`
        ],
      },
    };
  });
}

app.post("/webhook", function (request, response) {
  var intentName = request.body.queryResult.intent.displayName;
  var parameters = request.body.queryResult.parameters;
  console.log(intentName);
  const { number: userId, status } = parameters;
  const basePath = "https://jsonplaceholder.typicode.com";
  let path = "/todos";

  if (userId) {
    path = `/users/${userId}/todos`;
  }

  axios
    .get(basePath + path)
    .then(function ({ data }) {
      // handle success
      let tasks = !status ? data : filterTasksByState(data, status);
      
      response.json({ fulfillmentMessages: mapTodoToText(tasks) });
      console.log(data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      response.json({
        fulfillmentText: "I could not understain what you said :(",
      });
    });

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
