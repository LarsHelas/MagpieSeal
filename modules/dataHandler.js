const pg = require ('pg'); 

class StorageHandler {
    constructor (credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        }
    };
}