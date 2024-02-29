const path = require('node:path');
const Contact = require('./Contact');

const betterSqlite3 = require('better-sqlite3');
const db = new betterSqlite3(path.join(__dirname, '../data/contactDetails.sqlite'), { verbose: console.log });

const createStatement = db.prepare("CREATE TABLE IF NOT EXISTS contactdb(id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastName TEXT, email TEXT, notes TEXT, lastupdatedate TEXT)");
createStatement.run();

const repo = {
    findAll: () => {
        const st = db.prepare("SELECT * FROM contactdb");
        const rows = st.all();
        let contacts = [];
        rows.forEach((row)=>{
            const contact = new Contact(row.id, row.firstname, row.lastName, row.email, row.notes);
            contacts.push(contact);
        })
        return contacts;
    },
    findContactById: (id) => {
        const st = db.prepare("SELECT * from contactdb WHERE id = ?");
        const row = st.get(id);
        return new Contact(row.id, row.firstname, row.lastName, row.email, row.notes, row.lastupdatedate);
    },
    deleteContactById: (id) => { 
        const st = db.prepare("DELETE FROM contactdb WHERE id = ?");
        const row = st.run(id);
        console.log(`Rows affected: ${row.changes}`);
    },
    addNewContact: (id,data) => {
        const st = db.prepare("INSERT INTO contactdb (firstname, lastName, email, notes, lastupdatedate) VALUES (?,?,?,?,?)");
        const row = st.run(data.firstName, data.lastName, data.email, data.notes, data.lastUpdateDate);
        console.log(`Contact created with id: ${row.lastInsertRowid}`);
    },
    updateExistingContact: (data) => {
        const st = db.prepare("UPDATE contactdb SET firstname = ?, lastName = ?, email = ?, notes = ?, lastupdatedate = ? WHERE id = ?");
        const row = st.run(data.firstName, data.lastName, data.email, data.notes, data.lastUpdateDate, data.id);
        console.log(`Rows affected: ${row.changes}`);
    }
    
}

module.exports = repo;