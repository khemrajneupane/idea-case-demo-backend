var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var filePath = __dirname + "/" + "categories.json";

app.use(function (req, res, next) {
    "use strict";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

var fs = require('fs');//
app.get('/myfile', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("category-server.js is running");
    fs.readFile('my-file.txt', 'utf8', function (req, res) {
        console.log(data);
    })
});

//******GET category all********* */
// GET category/all
app.get('/category/all', function (req, res) {
    jsonfile.readFile(filePath)
    .then((obj) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(obj));
        console.log("Reading server side JSON file OK.\n" + JSON.stringify(obj));
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
});
// POST category (id, name, budget)
app.post('/addCategory', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let budget = req.body.budget;
    let newItem = { id, name, budget };
    addItemToJsonArrayFile(res, newItem);
});

function addItemToJsonArrayFile (res, newItem) {
    jsonfile.readFile(filePath)
    .then((obj) => {
        obj.push(newItem);
        jsonfile.writeFile(filePath, obj)
        .then(() => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
            console.log("Writing JSON to server file system OK.\n" + "Item added: " + JSON.stringify(newItem));
        })
        .catch(() => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end();
            console.error("Writing JSON to server file system failed.");
        });
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
};
//delete based on id..

app.delete('/deleteCategory', function (req, res) {
	let id = req.query.id;
	if (!id) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "No ID supplied in query.");
	} else if (isNaN(id)) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "The supplied ID is not a number.");
	} else {
		deleteById(res, id);
	}	
});

//delete by id request
/*
app.delete("/deleteCategory", function(req, res) {
    let thisId = req.query.id;
    var returnValue;
    if (!thisId) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      returnValue = {
        HttpStatusCode: "400",
        Message:
          "Reading server side JSON file failed.\n" + "No ID supplied in query."
      };
      res.end(returnValue.HttpStatusCode + " " + returnValue.Message);
      console.error(
        "Reading server side JSON file failed.\n" + "No ID supplied in query."
      );
    } else if (isNaN(thisId)) {
      returnValue = {
        HttpStatusCode: "400",
        Message:
          "Reading server side JSON file failed.\n" +
          "The supplied ID (" +
          thisId +
          ") is not a number."
      };
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(returnValue.HttpStatusCode + " " + returnValue.Message);
      console.log(
        "Reading server side JSON file failed.\n" +
          "The supplied ID (" +
          thisId +
          ") is not a number."
      );
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("item deleted succesfully");
      deleteById(res, thisId);
    }
  });
  */
  
  //deleteByid helper function
  
  function deleteById(res, thisId) {
    let array = [];
    let itemDeleted = null;
    jsonfile
      .readFile(filePath)
      .then(obj => {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].id !== Number(thisId)) {
            array.push(obj[i]);
          } else {
            itemDeleted = obj[i];
          }
        }
  
        if (array) {
          jsonfile
            .writeFile(filePath, array)
            .then(() => {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end();
              console.log("Writing JSON to server file system OK");
            })
            .catch(() => {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end();
              console.error("Writing JSON to server file system failed.");
            });
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end();
          console.log(
            "Reading server side JSON file OK.\n" +
              "No item found with ID = " +
              thisId +
              "."
          );
        }
        console.log("After deleting this item: ");
        console.dir(itemDeleted);
        console.log("The remaining items are: ");
        console.dir(array);
      })
  
      .catch(() => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end();
        console.error("Reading server side JSON file failed.");
      });
  }
//find category by id....
app.post('/categoryById',
    function (req, res) {
        var id = req.body.id;
        console.log("Find by this id: " + id);
        "use strict";
        var returnValue;
        var filePath = __dirname + "/" + "categories.json";
        console.log(filePath);
        if (!id || id.length === 0) {
            returnValue = {
                "HttpStatusCode": "400",
                "Message": "Id cannot be empty!"
            };
            res.writeHead(Number(returnValue.HttpStatusCode),
                {
                    'Content-Type': 'text/plain'
                });
            res.end(returnValue.Message.toString());
        } else {
            jsonfile.readFile(filePath)
                .then(obj => {
                    for(let i = 0; i < obj.length; i++){
                        if(obj[i].id == Number(id)){
                        returnValue = {
                            "HttpStatusCode": "200",
                            "Message": "Id found",
                            "Data": {
                                "id": id,
                                "name": obj[i].name,
                                "budget": obj[i].budget
                            }
                        }
                    }
                    }
                        res.writeHead(Number(returnValue.HttpStatusCode), { 'Content-Type': 'text/plain' });
                        res.end(JSON.stringify(returnValue.Data));
                    //console.dir(obj);
                    console.log("Reading server side json file ok.\n"+ JSON.stringify(returnValue.Data));
                })
                   
                .catch(() => {
                    res.writeHead(Number(returnValue.HttpStatusCode), { 'Content-Type': 'text/plain' });
                    res.end(returnValue.HttpStatusCode + " " + returnValue.Message.toString());
                })
                
                
        }

    });


//******GET category******** */
//get or post both can add the following object.
app.post("/category",
    function (req, res) {
        jsonfile.readFile(filePath)
            .then(obj => {
                obj.push(
                    {
                        name: "khem added",
                        points: 100
                    }
                );
                return obj;
            }

            ).then(obj => jsonfile.writeFile(filePath, obj)

            )
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Writing Json to server file system OK.");
            })
            .catch(() => {//this catch is for previous readFile function
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Writing Json to server file system failed.");
            })
    }
);
//get category/budgetLimit
app.get('/category/idsByBudgetLimit', function (req, res) {
  let budgetArray = [];
  let budgetLimit = 700;
  let higherBudgetIds = [];
 
  jsonfile.readFile(filePath)
  .then((obj) => {
      for(var i = 0; i < obj.length; i++){
        if(obj[i].budget > Number(budgetLimit)){
          budgetArray.push(obj[i]);
          higherBudgetIds.push(obj[i].id);
        }

      }
      console.log("budget higher than "+ budgetLimit+" :");
      console.dir(budgetArray);
      console.log("Higher budget ids: ");
      console.dir(higherBudgetIds);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify(higherBudgetIds));
  })
  
  .catch(() => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end();
      console.error("Reading server side JSON file failed.");
      }
  );
}); 

var server = app.listen(3001, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});