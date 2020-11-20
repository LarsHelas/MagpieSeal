const crypto = require('crypto');
const secret = process.env.hashSecret || require ("../localenv").hashSecret;


class TokenCheck{
    
   constructor(header, payload, signature){
      this.header = header;

      this.payload =payload;

      this.signature = signature; 

      this.newSignature = crypto.createHmac('SHA256', secret)
       .update(this.header + '.' + this.payload)
       .digest('base64')
       .replace(/=/g, "")                      
       .replace(/\+/g, "-")                               
       .replace(/\//g, "_")
   }
    result(){
      if (this.signature===this.newSignature){
          console.log("yes sir")
          return true
      }else{
        console.log("no sir")
          return false
      }
  }
}
//let test = new Token(headerValue, payloadValue)
//console.log(test.result());

    
    module.exports= TokenCheck;