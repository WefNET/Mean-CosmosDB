// stolen from https://www.positronx.io/mean-stack-tutorial-angular-7-crud-bootstrap/

let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db'),
    env = require('dotenv').config();   //Use the .env file to load the variables;

// Connecting with mongo db
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://a6203f67-0ee0-4-231-b9ee:RRrevE5AYTyW9S8sRtPFDb0lLf7tvm1WkOjj6YIna2GWpTCmGm3eh0yIYNG4enASTSpXaUTmzj96OZWzHujXWg%3D%3D@a6203f67-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Database sucessfully connected')
// },
//     error => {
//         console.log('Database could not connected: ' + error)
//     }
// )

mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
  auth: {
    user: process.env.COSMODDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  }
})
.then(() => console.log('Connection to CosmosDB successful'))
.catch((err) => console.error(err));

// Setting up port with express js
const employeeRoute = require('../backend/routes/employee.route')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/api', employeeRoute)

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

// database stuff
// let mongoose = require('mongoose');

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
   useNewUrlParser: true
}).then(() => {
      console.log('Database sucessfully connected')
   },
   error => {
      console.log('Database could not connected: ' + error)
   }
)