//[Dependencies and Modules]
const express = require("express");
const mongoose = require("mongoose");
//allows our backend app to be available to our frontend app
//allows to control the app's CORS settings
const cors = require("cors");

//[Routes]
//allows access to routes defined within our app
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

//[Environment Setup]
//const port = 4000;
//loads variables from env files
require('dotenv').config();

//[Server Setup]
// Creates an "app" variable that stores the result of the "express" function that initializes our express application and allows us access to different methods that will make backend creation easy
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
//Allows all resources to access our backend app
//app.use(cors());//is not the best practice because it allows all other apps to access our backend app

//will allow s to customize CORS options to meet our specific requirements
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://csp2-ecommerce-api-server.onrender.com',
        'https://csp3-e-commerce-client.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

app.options('*', cors(corsOptions));




//[Database Connection]
//Connect to our MongoDB
mongoose.connect(process.env.MONGODB_STRING);
//prompts a message once the connection is 'open' and we are connected successfully to the db
mongoose.connection.once('open',()=>console.log("Now connected to MongoDB Atlas"));

//[Backend Routes]
//http://localhost:4000/users
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

//[Server Gateway Response]
// if(require.main) would allow us to listen to the app directly if it is not imported to another module, it will run the app directly.
// else, if it is needed to be imported, it will not run the app and instead export it to be used in another file.

//process.env.PORT || 3000 will use the env if it is available OR use port 3000 if no env is defined
if(require.main === module){
    app.listen( process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`)
    });
}

// In creating APIs, exporting modules in the "index.js" file is ommited
// exports an object containing the value of the "app" variable only used for grading.
module.exports = { app, mongoose };