const crypto = require('crypto');
const secret = process.env.hashSecret || require ("../localenv").hashSecret;

function encode(inp){
   let input = Buffer.from(inp, "utf-8");
   let result = input.toString("base64");
   return result;
}

let headerValue = `{"alg":"HS256","typ":"JWT"}`
let payloadValue = `{"username":"bob"}`;



class Token{
    
   constructor(header, payload){
      this.header = encode(header)

      this.payload = encode(payload);

      let signatureInput = this.header + "." + this.payload;
       this.signature = crypto.createHmac('sha256', secret)
          .update(signatureInput)
          .digest('hex');
       this.valid = false; 
      console.log(signatureInput)
       this.sign64 = encode(signatureInput);
       console.log(this.sign64);
   }
    result(){
      try {
         let jwt = this.header+"."+this.payload+"."+this.sign64;
         return jwt;
      } catch (error) {
          console.error(error)
      }
  }
}
let test = new Token(headerValue, payloadValue)
console.log(test.result());

    
    module.exports= Token;