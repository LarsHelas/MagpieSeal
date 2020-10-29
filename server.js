const express = require('express');
//const bodyParser = require('body-parser')
const app = express(); 




app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
//app.use(bodyParser.json());
app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});

app.get("/", function (req, res) {
    console.log("Hello from inside get")
    res.status(200).send("hello from get ");
})