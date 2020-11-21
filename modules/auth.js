const crypto = require('crypto');
const secret = process.env.hashSecret || require ("../localenv").hashSecret;


const authenticator = (req, res, next) => {
  const token = JSON.parse(req.headers.authorization); 
  const header = token.header;
  const payload = token.payload;
  const signature = token.signature; 
  const newSignature = crypto.createHmac('SHA256', secret)
  .update(header + '.' + payload)
  .digest('base64')
  .replace(/=/g, "")                      
  .replace(/\+/g, "-")                               
  .replace(/\//g, "_")
  
  if (signature===newSignature){
      console.log("yes sirrrr")
      res.locals.result = true;  
      next()
  }else{
      console.log("no sirrrr")
      res.locals.result = false;
      next()
  }

}

  module.exports = authenticator; 