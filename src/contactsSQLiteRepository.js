const fs = require('node:fs');
const path = require('node:path');
const Contact = require('./Contact');

const betterSqlite3 = require('better-sqlite3');
const db = new betterSqlite3(path.join(__dirname, '../data/contactDetails.sqlite'), { verbose: console.log });

//db.set('405226f4-0a2c-4ae0-b857-aa18d45cb12f',{id: '405226f4-0a2c-4ae0-b857-aa18d45cb12f', firstName: 'Michelle', lastName: 'Scott', email: 'mitchelle@gmail.com'});
const createStatement = db.prepare("CREATE TABLE IF NOT EXISTS contactdb(id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastName TEXT, email TEXT, notes TEXT, lastupdatedate TEXT)");
createStatement.run();

/*const loadDataFromFile = () => {
    try{
        const jsonDataFromFile = fs.readFileSync(path.join(__dirname, '../data/contactDetails.json'));
        const contactsArray = JSON.parse(jsonDataFromFile);
        contactsArray.forEach((contact) => {
            db.set(contact[0],contact[1]);
        });
    } catch (error) {
        console.log('Error reading data from file', error);
    }
}

const saveDataInFile = () => {
    const stringifiedData = JSON.stringify(Array.from(db));
    console.log(stringifiedData);
    fs.writeFileSync(path.join(__dirname, '../data/contactDetails.json'), stringifiedData);
}*/

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
        const st = db.prepare("INSERT INTO contactdb (firstname, lastname, email, notes, lastupdatedate) VALUES (?,?,?,?,?)");
        const row = st.run(data.firstName, data.lastName, data.email, data.notes, data.lastUpdateDate);
        console.log(`Contact created with id: ${row.lastInsertRowid}`);
    },
    updateExistingContact: (data) => {
        // db.set(data.id, data);
        // saveDataInFile();
    }
    
}

// loadDataFromFile();

module.exports = repo;