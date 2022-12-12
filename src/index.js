const express = require("express");
const app = express();
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

app.use(express.json());

app.use(cors());

//define simple middleware example
app.use((req, res, next)=>{
    console.log("HTTP Method - " + req.method + " , URL - " + req.url);
    next();
});

app.use("/users", userRouter);
app.use("/notes", noteRouter);

app.get("/", (req, res)=>{
    res.send("Notes API");
});


// connectivity with mongo db 

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started on port no. " + PORT);
    
    });
})
.catch((error)=>{
    console.log(error);
});

