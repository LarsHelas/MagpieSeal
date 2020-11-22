const pg = require('pg');
const dbCredentials = process.env.DATABASE_URL || require('../localenv').credentials;

class StorageHandler {
    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    async insertUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        let usernamesDB = null;
        try {
            await client.connect();
            usernamesDB = await client.query('SELECT * FROM "public"."tUsers" WHERE username = $1', [username])

            if (usernamesDB.rows.length > 0) {

            } else {
                results = await client.query('INSERT INTO "public"."tUsers"("username", "password") VALUES($1, $2) RETURNING *;', [username, password])
                results = results.rows[0].message;
                client.end();
            }

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
        return results;
    }
    async loginUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;

        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tUsers" WHERE username = $1 AND password = $2', [username, password])
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
        if (results.rows.length > 0) {
            return results.rows[0].usersId;
        } else {
            return null;
        }

    }
    async updateUser(username, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('UPDATE "public"."tUsers" SET "username" = $1 WHERE "usersId" = $2', [username, usersId])
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async updatePassword(password, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('UPDATE "public"."tUsers" SET "password" = $1 WHERE "usersId" = $2', [password, usersId])
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async deleteUser(usersId) {
        const client = new pg.Client(this.credentials);

        let groupIDs = [];
        let itemIDs = [];
        let userLists = null;
        let userItems = null;
        let deleteItems = null;
        let deleteLists = null;
        let deleteUser = null;

        try {
            await client.connect();

            // Get all items
            userLists = await client.query('SELECT* FROM "tLists" WHERE "usersId"= $1', [usersId]);
            userLists.rows.forEach(row => {
                groupIDs.push(row.listGroupsId)
            });

            let listQuery = ''.concat('SELECT * FROM "tItems" WHERE "listGroupsId" IN (', groupIDs.toString(), ')'); // .ToString concats array values with comma - perfect for SQL :)
            userItems = await client.query(listQuery);
            userItems.rows.forEach(row => {
                itemIDs.push(row.listItemsId)
            });

            // Delete all items
            let itemDeleteQuery = ''.concat('DELETE FROM "public"."tItems" WHERE "listItemsId" IN (', itemIDs.toString(), ')');
            deleteItems = await client.query(itemDeleteQuery);

            // Delete lists
            deleteLists = await client.query('DELETE FROM "tLists" WHERE "usersId"= $1', [usersId]);

            // Destroy user
            deleteUser = await client.query('DELETE FROM "public"."tUsers" WHERE "usersId" = $1', [usersId]);

        } catch (err) {
            client.end();
            console.log(err);
        }
    }
    async listName(id) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tLists" WHERE "tLists"."usersId" = $1', [id])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
        if (results.rows.length > 0) {
            return results.rows
        } else {
            return null;
        }

    }
    async listAdd(title, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."tLists"("listName", "usersId") VALUES($1, $2) RETURNING *;', [title, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listUpdate(title, listGroupsId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('UPDATE "public"."tLists" SET "listName" = $1 WHERE "listGroupsId" = $2', [title, listGroupsId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listDelete(listGroupsId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('DELETE FROM "public"."tLists" WHERE "listGroupsId" = $1', [listGroupsId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
}



module.exports = new StorageHandler(dbCredentials);