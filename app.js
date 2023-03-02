const express = require("express");
const connectDB = require("./db/connection");
const notFound = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")
const ProductRouter = require("./routes/products");
require("express-async-errors")
require("dotenv").config();
require("./db/connection");

const app = express();

//middleware
app.use(express.json());
app.use('/api/v1/products', ProductRouter)



//routes
app.get('/', (req, res) => {
    res.send('<h1>Store Api</h2><a href="/api/v1/products">Product route</a>')
})

app.use(notFound);
app.use(errorHandlerMiddleware);



const Port = process.env.Port || 5000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(Port, console.log(`Server running on port ${Port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();