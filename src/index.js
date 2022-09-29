const express = require("express")
const bodyParser = require("body-parser")
const route = require("./routes/route")
const app = express()
const mongoose = require("mongoose")
const multer = require("multer")


app.use(bodyParser.json())
app.use(multer().any())

mongoose.connect(
    "mongodb+srv://Parshant_rao:C4fIOvHGi74DVINv@newcluster.squkrr6.mongodb.net/BookManagement",
    {
        useNewUrlParser:true
    }
).then(()=>console.log("MongoDB is connected"))
  .catch((err)=>console.log(err))

app.use("/",route)

app.listen(process.env.PORT || 3000, function(){ 
    console.log("Express is running on port" + (process.env.PORT || 3000))
}) 