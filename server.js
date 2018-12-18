const path = require('path');
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectId;

var DONOR_COLLECTION = "food_donor";
var FOOD_COLLECTION = "food";
var STOCK_COLLECTION = "stock";
var CONTACTUS_COLLECTION = "contact_us";
var TRANS_COLLECTION = "transactions";

// Serve static files
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-donor", { useNewUrlParser: true }, function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 5000, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Send all requests to index.html
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

// default Heroku port
// app.listen(process.env.PORT || 5000);

// Heroku automagically gives us SSL
// Lets write some middleware to redirect us
let env = process.env.NODE_ENV || 'development';

let forceSSL = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};

if (env === 'production') {
    app.use(forceSSL);
}

// DONOR API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

/*  "/api/donor"
 *    GET: finds all donor
 *    POST: creates a new donor
 */

app.get("/api/donor", function (req, res) {
    db.collection(DONOR_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/api/food/:type", function (req, res) {

    var type = req.params.type;

    db.collection(FOOD_COLLECTION).find({ type: type }).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get food.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/donor", function (req, res) {

    var newDonor = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address
    };

    newDonor.createDate = new Date();

    if (!req.body.first_name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {

        db.collection(DONOR_COLLECTION).findOne({ first_name: newDonor.first_name, last_name: newDonor.last_name }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to find donor.");
            } else {
                if (doc) {
                    console.log('NOT NULL', doc);

                    getFood(req.body.food_name).then(function (result) {
                        var newTrans = {
                            "donor": doc,
                            "food": result,
                            "quantity": parseInt(req.body.quantity)
                        }
                        // console.log(newStock);
                        db.collection(TRANS_COLLECTION).insertOne(newTrans, function (err, doc) {
                            if (err) {
                                handleError(res, err.message, "Failed to create new stock.");
                            } else {

                                checkStock(newTrans.food.name).then(function (result) {

                                    var newStock = {
                                        "food_desc": newTrans.food.name,
                                        "quantity": parseInt(req.body.quantity)
                                    }

                                    if (result) {

                                        let sum = parseInt(result.quantity) + newStock.quantity;
                                        console.log(sum);
                                        //update
                                        db.collection(STOCK_COLLECTION).findOneAndUpdate(
                                            { food_desc: newTrans.food.name },
                                            {
                                                $set: {
                                                    quantity: sum,
                                                }
                                            },
                                            { upsert: true },
                                            function (err, doc) {
                                                if (err) {
                                                    handleError(res, err.message, "Failed to update stock.");
                                                } else {
                                                    console.log(doc.value);
                                                    res.status(201).json(doc.value);
                                                }
                                            }
                                        )
                                    }
                                    else {
                                        db.collection(STOCK_COLLECTION).insertOne(newStock, function (err, doc) {
                                            if (err) {
                                                handleError(res, err.message, "Failed to create new stock.");
                                            } else {
                                                res.status(201).json(doc.ops[0]);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    })
                }
                else {
                    console.log('NULL');
                    db.collection(DONOR_COLLECTION).insertOne(newDonor, function (err, doc) {
                        if (err) {
                            handleError(res, err.message, "Failed to create new donor.");
                        } else {
                            getFood(req.body.food_name).then(function (result) {

                                var newTrans = {
                                    "donor": doc.ops[0],
                                    "food": result,
                                    "quantity": req.body.quantity
                                }

                                db.collection(TRANS_COLLECTION).insertOne(newTrans, function (err, doc) {
                                    if (err) {
                                        handleError(res, err.message, "Failed to create new donor.");
                                    } else {

                                        checkStock(newTrans.food.name).then(function (result) {

                                            var newStock = {
                                                "food_desc": newTrans.food.name,
                                                "quantity": parseInt(req.body.quantity)
                                            }

                                            if (result) {

                                                let sum = parseInt(result.quantity) + newStock.quantity;
                                                console.log(sum);

                                                //update
                                                db.collection(STOCK_COLLECTION).findOneAndUpdate(
                                                    { food_desc: newTrans.food.name },
                                                    {
                                                        $set: {
                                                            quantity: sum,
                                                        }
                                                    },
                                                    { upsert: true },
                                                    function (err, doc) {
                                                        if (err) {
                                                            handleError(res, err.message, "Failed to update stock.");
                                                        } else {
                                                            res.status(201).json(doc.value);
                                                        }
                                                    }
                                                )

                                                // db.collection(STOCK_COLLECTION).insertOne(newStock, function (err, doc) {
                                                //     if (err) {
                                                //         handleError(res, err.message, "Failed to create new stock.");
                                                //     } else {
                                                //         res.status(201).json(doc.ops[0]);
                                                //     }
                                                // });  
                                            }
                                            else {
                                                db.collection(STOCK_COLLECTION).insertOne(newStock, function (err, doc) {
                                                    if (err) {
                                                        handleError(res, err.message, "Failed to create new stock.");
                                                    } else {
                                                        res.status(201).json(doc.ops[0]);
                                                    }
                                                });
                                            }
                                        });

                                        // res.status(201).json(doc.ops[0]);
                                    }
                                });
                            })
                        }
                    });
                }
            }
        });
    }
});

app.get("/api/stock", function (req, res) {
    db.collection(STOCK_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/contact-us", function (req, res) {

    var newContact = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    };

    db.collection(CONTACTUS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

let getFood = (id) => {

    return new Promise(function (resolve, reject) {
        // Do async job
        db.collection(FOOD_COLLECTION).findOne({ _id: ObjectID(id) }, function (err, doc) {
            // console.log(JSON.stringify(doc))
            if (err) {
                reject(err)
            }
            else {
                resolve(doc);
            }
        });
    })
}

let checkStock = (food_name) => {

    return new Promise(function (resolve, reject) {
        // Do async job
        db.collection(STOCK_COLLECTION).findOne({ food_desc: food_name }, function (err, doc) {
            // console.log(JSON.stringify(doc))
            if (err) {
                reject(err)
            }
            else {
                resolve(doc);
            }
        });
    })
}

// app.put("/api/donor/:id", function (req, res) {
// });

// app.delete("/api/donor/:id", function (req, res) {
// });

