const crypto = require('crypto');
const secret = process.env.hashSecret || require ("../localenv").hashSecret;
const dataHandler = require("./dataHandler");

function encode(inp){
   let result = Buffer.from(JSON.stringify(inp)).toString('base64')
      .replace(/=/g, "")                               
      .replace(/\+/g, "-")                               
      .replace(/\//g, "_");
   return result;
}



/*let headerValue = {
   "alg": "HS256",
   "typ": "JWT"
   };
let payloadValue = {
   "userId": userId
};*/


class Token{
    
   constructor(header, payload){
      this.header = encode(header)

      this.payload = encode(payload);

      
      this.signature = crypto.createHmac('SHA256', secret)
       .update(this.header + '.' + this.payload)
       .digest('base64')
       .replace(/=/g, "")                      
       .replace(/\+/g, "-")                               
       .replace(/\//g, "_")
   }
    result(){
      try {
         let jwt = this.header+"."+this.payload+"."+this.signature;
         return jwt;
      } catch (error) {
          console.error(error)
      }
  }
}
//let test = new Token(headerValue, payloadValue)
//console.log(test.result());

    
    module.exports= Token;