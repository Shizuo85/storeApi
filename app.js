require("dotenv").config()
require("express-async-errors")
const express = require("express");
const app = express();
const productsRouter = require("./routes/products")
const connectDB = require("./db/connect")

const notFoundMiddleware = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")


app.use(express.json())


app.get("/", (req, res) => {
    res.send("<h1>Store Api</h1><a href='/api/v1/products'>products route</a>")
})
app.use("/api/v1/products", productsRouter)

app.use(notFoundMiddleware)
app.use(errorHandler)

const port = process.env.PORT || 5000

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error){
        console.log(error)
    }
}

start()
