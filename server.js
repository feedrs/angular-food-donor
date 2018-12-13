const path = require('path');
const express = require('express');
const app = express();
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var DONOR_COLLECTION = "food_donor";

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

app.post("/api/donor", function (req, res) {
    var newDonor = req.body;
    newDonor.createDate = new Date();

    if (!req.body.first_name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
        db.collection(DONOR_COLLECTION).insertOne(newDonor, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new donor.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/donor/:id", function (req, res) {
});

app.put("/api/donor/:id", function (req, res) {
});

app.delete("/api/donor/:id", function (req, res) {
});
