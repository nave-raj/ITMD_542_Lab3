const fs = require('node:fs');
const path = require('node:path');
const db = new Map();
//db.set('405226f4-0a2c-4ae0-b857-aa18d45cb12f',{id: '405226f4-0a2c-4ae0-b857-aa18d45cb12f', firstName: 'Michelle', lastName: 'Scott', email: 'mitchelle@gmail.com'});
//db.set('1f352c5c-c41f-44b2-acfa-d7bc5c52f221',{id: '1f352c5c-c41f-44b2-acfa-d7bc5c52f221', firstName: 'Cameron', lastName: 'Scott', email: 'cam.34@gmail.com'});

const loadDataFromFile = () => {
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
}

const repo = {
    findAll: () => {

        return Array.from(db.values());
    },
    findContactById: (id) => db.get(id),
    deleteContactById: (id) => { 
        db.delete(id);
        saveDataInFile();
    },
    addNewContact: (id,data) => {
        db.set(id,data);
        saveDataInFile();
    },
    updateExistingContact: (data) => {
        db.set(data.id, data);
        saveDataInFile();
    }
    
}

loadDataFromFile();

module.exports = repo;