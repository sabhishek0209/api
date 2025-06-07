const express = require("express");
const router = require("./routes/route")
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use("/", router)

app.listen(8000, ()=>{
    console.log("server listening on port " +8000)
})