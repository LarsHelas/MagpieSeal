const crypto = require('crypto');
const secret = process.env.hashSecret || require("../localenv").hashSecret;

function encode(inp) {
   let result = Buffer.from(JSON.stringify(inp)).toString('base64')
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
   return result;
}

class Token {

   constructor(header, payload) {
      this.header = encode(header)

      this.payload = encode(payload);


      this.signature = crypto.createHmac('SHA256', secret)
         .update(this.header + '.' + this.payload)
         .digest('base64')
         .replace(/=/g, "")
         .replace(/\+/g, "-")
         .replace(/\//g, "_")
   }
}

module.exports = Token;