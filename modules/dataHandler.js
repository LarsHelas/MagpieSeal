const pg = require ('pg'); 
const dbCredentials = process.env.DATABASE_URL || require('../localenv').credentials;

class StorageHandler {
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
            results = await client.query('INSERT INTO "public"."users"("username", "password") VALUES($1, $2) RETURNING *;', [username, password] )
            results = results.rows[0].message;
            client.end();
        }catch (err) {
            client.end();
            console.log(err);
            results = err; 
        }
        return results;   
    }

    async insert(...params) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."$1"("username", "password") VALUES($2, $3) RETURNING *;', params )
            results = results.rows[0].message;
            client.end();
        }catch (err) {
            client.end();
            results = err; 
        }
        return results; 
    }
}



module.exports = new StorageHandler(dbCredentials);