const express = require("express");
const router = require("./routes/route")

const app = express();


app.use("/", router)

app.listen(8000, ()=>{
    console.log("server listening on port " +8000)
})