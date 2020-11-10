const pg = require ('pg'); 
const dbCredentials = process.env.DATABASE_URL || require('../localenv').credentials;

class LoginHandler  {
    constructor (credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    async insertUser(username,password){
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])

            if(results.rows.length > 0){
            console.log("yay") 
            }else{
                console.log("nay");
            }

        }catch (err) {
            client.end();
            console.log(err);
            results = err; 
        }
        return results;   
    }
}



module.exports = new LoginHandler(dbCredentials);