const express = require('express');
const server = require("./server");
const cors = require('cors') 
const imageGenerator = require("./image-generator");

const app = express();
serverInfo = new server.ServerInfo();

// initialize
imageGenerator.generateContent(serverInfo);
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

app.get("/api/status", (request, response) => {

});

app.post("/api/update", (request, response) => {
    response.send(server.handleActions(request, serverInfo));
});