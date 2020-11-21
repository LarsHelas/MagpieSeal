const express = require('express');
const bodyParser = require('body-parser');
const user = require('./modules/user');
const Token = require('./modules/jwt');
const PayloadInfo = require('./modules/payloadInfo');
const database = require('./modules/dataHandler');
const authenticator = require('./modules/auth');

const server = express(); 

server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});



server.post("/user", async function (req, res){
    const newUser = new user(req.body.username, req.body.password);
    await newUser.create();
    res.status(200).json(newUser).end();
});

server.post("/user/login", async function (req, res){
    const userLogin = new user(req.body.username, req.body.password);
    let response = await userLogin.login();
    let headerValue = {
        "alg": "HS256",
        "typ": "JWT"
        };
     let payloadValue = {
        "userId": response
     };
    let token = new Token(headerValue, payloadValue);
    let data = {
        "username": userLogin.username,
        "token": token
    };

    if(response == null){
        res.status(401).json({msg:"Incorrect username and password"}).end();
    }else {
        res.status(200).json(data).end();
    }
});

server.get("/tasks", authenticator, async function (req, res){ 
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    const list = await database.listName(usersId);

    const result = res.locals.result;
    if (result === true){
        res.status(200).json(list)
    }else if(result === false) {
        res.status(403).json({msg:"Bad token"})
    }
});

server.post("/tasks", async function (req, res){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listAdd(req.body.title, usersId);
    
    res.status(200).json({msg:"test"}).end();
});