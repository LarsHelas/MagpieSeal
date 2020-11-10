const express = require('express');
const bodyParser = require('body-parser');
//const { Router } = require('express');
const secureEndpoints = require('./modules/secureEndpoints');
const user = require('./modules/user')
const userLogin = require("./modules/userLogin")




const server = express(); 

server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());


server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

server.use("/secure", secureEndpoints);


server.post("/user", async function (req, res){
    const newUser = new user(req.body.username, req.body.password);
    await newUser.create();
    res.status(200).json(newUser).end();
});

server.post("/user/login", async function (req, res){
    const loginUser = new userLogin(req.body.username, req.body.password);
    await loginUser.create();
    res.status(200).json(loginUser).end();
});