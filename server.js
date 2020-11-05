const express = require('express');
const bodyParser = require('body-parser');
const { Router } = require('express');
const secureEndpoints = require('./modules/secureEndpoints');
const user = require('./modules/user')



const server = express(); 

server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

server.use("/secure", secureEndpoints);


server.post("/user", function (req, res){
    const newUser = new user(req.body.username, req.body.password);
    await newUser.create();
    res.status(200).json(newUser).end();
});