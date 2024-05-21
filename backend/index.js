const express = require('express');
const server = require("./server");
const cors = require('cors') 

const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 3000;

serverInfo = new server.ServerInfo();

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

app.get("/status", (request, response) => {

});

app.post("/update", (request, response) => {
    response.send(server.handleActions(request, serverInfo));
});