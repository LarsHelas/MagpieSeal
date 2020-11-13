const pg = require ('pg'); 
const dbCredentials = process.env.DATABASE_URL || require('../localenv').credentials;

class StorageHandler  {
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
        let usernamesDB = null; 
        try {
            await client.connect();
            usernamesDB = await client.query('SELECT * FROM users WHERE username = $1', [username])

            if(usernamesDB.rows.length > 0){
            
            }else{
            results = await client.query('INSERT INTO "public"."users"("username", "password") VALUES($1, $2) RETURNING *;', [username, password] )
            results = results.rows[0].message;
            client.end();
            }

        }catch (err) {
            client.end();
            console.log(err);
            results = err; 
        }
        return results;   
    }
    async loginUser(username,password){
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



module.exports = new StorageHandler(dbCredentials);