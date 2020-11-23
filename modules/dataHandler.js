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
                return false; 
            } else {
                results = await client.query('INSERT INTO "public"."tUsers"("username", "password") VALUES($1, $2) RETURNING *;', [username, password])

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
            if(groupIDs.length>0){
            let listQuery = ''.concat('SELECT * FROM "tItems" WHERE "listGroupsId" IN (', groupIDs.toString(), ')'); // .ToString concats array values with comma - perfect for SQL :)
            userItems = await client.query(listQuery);
            userItems.rows.forEach(row => {
                itemIDs.push(row.listItemsId)
            });
            }
            // Delete all items
            
            if(itemIDs.length>0){
            let itemDeleteQuery = ''.concat('DELETE FROM "public"."tItems" WHERE "listItemsId" IN (', itemIDs.toString(), ')');
            deleteItems = await client.query(itemDeleteQuery);
            }
            // Delete lists
            
            if(groupIDs.length>0){
            deleteLists = await client.query('DELETE FROM "tLists" WHERE "usersId"= $1', [usersId]);
            }
            // Destroy user
            deleteUser = await client.query('DELETE FROM "public"."tUsers" WHERE "usersId" = $1', [usersId]);

        } catch (err) {
            client.end();
            console.log(err);
        }
    }
    async listName(usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tLists" WHERE "tLists"."usersId" = $1', [usersId])

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
    async listUpdate(title, listGroupsId, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('UPDATE "public"."tLists" SET "listName" = $1 WHERE "listGroupsId" = $2 AND "usersId" = $3', [title, listGroupsId, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listDelete(listGroupsId, usersId) {
        const client = new pg.Client(this.credentials);
        let items = null; 
        let results = null;
    
        try {
            await client.connect();
            items = await client.query('DELETE FROM "public"."tItems" WHERE "listGroupsId" = $1 AND "usersId = $2', [listGroupsId, usersId])
            results = await client.query('DELETE FROM "public"."tLists" WHERE "listGroupsId" = $1 AND "usersId = $2', [listGroupsId, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listItemName(listGroupsId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tItems" WHERE "tItems"."listGroupsId" = $1', [listGroupsId])

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
    async listItemAdd(itemName, listGroupsId, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."tItems"("itemName", "listGroupsId", "usersId") VALUES($1, $2, $3) RETURNING *;', [itemName, listGroupsId, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listItemUpdate(itemName, listItemsId, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('UPDATE "public"."tItems" SET "itemName" = $1 WHERE "listItemsId" = $2 AND "usersId" = $3', [itemName, listItemsId, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async listItemDelete(listItemsId, usersId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('DELETE FROM "public"."tItems" WHERE "listItemsId" = $1 AND "usersId" = $2', [listItemsId, usersId])

        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }
    }
    async publicLists() {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tLists" WHERE "tItems"."public" = 1')

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
    async publicListItems(listGroupsId) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "public"."tItems" WHERE "tItems"."listGroupsId" = $1 AND "tItems"."public" = 1', [listGroupsId])

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
    async publicToggle(listGroupsId, usersId) {
        const client = new pg.Client(this.credentials);
        let checkPublicLists = null; 
        let checkPublicItems = null; 
        let resultList = null;
        let resultItems = null;
        try {
            await client.connect();
                checkPublicLists = await client.query('SELECT * FROM "public"."tLists" WHERE "tLists"."listGroupsId" = $1  AND "usersId" = $2', [listGroupsId, usersId])
            if (checkPublicLists.rows[0].public===0){
                resultList = await client.query('UPDATE "public"."tLists" SET "public" = 1 WHERE "listGroupsId" = $1 AND "usersId" = $2', [listGroupsId, usersId])
            }else{
                resultList = await client.query('UPDATE "public"."tLists" SET "public" = 0 WHERE "listGroupsId" = $1 AND "usersId" = $2', [listGroupsId, usersId])
            }
                checkPublicItems = await client.query('SELECT * FROM "public"."tItems" WHERE "tItems"."listGroupsId" = $1  AND "usersId" = $2', [listGroupsId, usersId])
            if (checkPublicItems.rows[0].public===0){
                resultList = await client.query('UPDATE "public"."tItems" SET "public" = 1 WHERE "listGroupsId" = $1 AND "usersId" = $2', [listGroupsId, usersId])
            }else{
                resultList = await client.query('UPDATE "public"."tItems" SET "public" = 0 WHERE "listGroupsId" = $1 AND "usersId" = $2', [listGroupsId, usersId])
            }
        } catch (err) {
            client.end();
            console.log(err);
            resultList = err;
            resultItems = err;
        }
        if (checkPublicLists.rows[0].public===0){
            return {msg:"List is public"}
        } else {
            return {msg:"List is private"}
        }
    }
}



module.exports = new StorageHandler(dbCredentials);