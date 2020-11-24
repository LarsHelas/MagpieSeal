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


//Users
server.post("/user", async function (req, res){
    const newUser = new user(req.body.username, req.body.password);
    const response = await newUser.create();
    if (response == false) {
        res.status(400).json({msg:"Username already exists"}).end();
    }else {
        res.status(200).json({msg:"Ok"}).end();
    }
    
});

server.post("/user/login", async function (req, res){
    const userLogin = new user(req.body.username, req.body.password);
    const response = await userLogin.login();
    const headerValue = {
        "alg": "HS256",
        "typ": "JWT"
        };
     const payloadValue = {
        "userId": response
     };
    const token = new Token(headerValue, payloadValue);
    const data = {
        "username": userLogin.username,
        "token": token
    };

    if(response == null){
        res.status(401).json({msg:"Incorrect username and password"}).end();
    }else {
        res.status(200).json(data).end();
    }
});

server.put("/user/updateUsername", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.updateUser(req.body.username, usersId);
    res.status(200).json({msg:"Username updated"}).end();
    }
});

server.put("/user/updatePassword", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    const newUser = new user(usersId, req.body.password);
    await newUser.updatePassword();
    res.status(200).json({msg:"Password updated"}).end();
    }
});

server.delete("/user/deleteUser", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.deleteUser(usersId); 
    res.status(200).json({msg:"User yeeted"}).end();
    }
});

//Lists
server.get("/tasks", authenticator, async function (req, res){ 
    const result = res.locals.result;
    if (result === true){
        const token = JSON.parse(req.headers.authorization);
        const payload = new PayloadInfo(token.payload)  
        const usersId = payload.id();
        const list = await database.listName(usersId);
        res.status(200).json(list)
    }else if(result === false) {
        res.status(403).json({msg:"Bad token"})
    }
});

server.post("/tasks", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listAdd(req.body.title, usersId);
    
    res.status(200).json({msg:"test"}).end();
    }
});

server.put("/tasks/updateLists", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listUpdate(req.body.listTitle, req.body.listGroupsId, usersId);
    res.status(200).json({msg:"List updated!"}).end();
    }
});

server.delete("/tasks/deleteLists", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listDelete(req.body.listGroupsId, usersId);
    res.status(200).json({msg:"List deleted!"}).end();
    }
});

//List items
server.get("/tasks/items", authenticator, async function (req, res){ 
    const result = res.locals.result;
    if (result === true){
        const list = await database.listItemName(req.body.listGroupsId);
        res.status(200).json(list)
    }else if(result === false) {
        res.status(403).json({msg:"Bad token"})
    }
});

server.post("/tasks/items", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listItemAdd(req.body.itemName, req.body.listGroupsId, usersId);
    res.status(200).json({msg:"ok"}).end();
    }
});

server.put("/tasks/updateListItems", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listItemUpdate(req.body.itemName, req.body.listItemsId, usersId);
    res.status(200).json({msg:"List updated!"}).end();
    }
});

server.post("/tasks/deleteListItems", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listItemDelete(req.body.listItemsId, usersId);
    res.status(200).json({msg:"List deleted!"}).end();
    }
});

server.delete("/tasks/deleteListItems", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
    const token = JSON.parse(req.headers.authorization);
    const payload = new PayloadInfo(token.payload)  
    const usersId = payload.id();
    await database.listItemDelete(req.body.listGroupsId, usersId);
    res.status(200).json({msg:"list item deleted"}).end();
    }
});

server.put("/tasks/togglePublic", authenticator, async function (req, res){
    const result = res.locals.result;
    if(result===true){
        const token = JSON.parse(req.headers.authorization);
        const payload = new PayloadInfo(token.payload)  
        const usersId = payload.id();
        await database.publicToggle(req.body.listGroupsId, usersId);
        res.status(200).json({msg:"toggle successful"}).end();
    }
});

//private/public
server.get("/public", authenticator, async function (req, res){ 
    const result = res.locals.result;
    if (result === true){
        const list = await database.publicLists();
        res.status(200).json(list)
    }else if(result === false) {
        res.status(403).json({msg:"Bad token"})
    }
});

server.get("/public/tasks", authenticator, async function (req, res){ 
    const result = res.locals.result;
    if (result === true){
        const list = await database.publicListItems(req.body.listGroupsId);
        res.status(200).json(list)
    }else if(result === false) {
        res.status(403).json({msg:"Bad token"})
    }
});