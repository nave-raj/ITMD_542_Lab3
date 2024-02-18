const db = new Map();
db.set('405226f4-0a2c-4ae0-b857-aa18d45cb12f',{id: '405226f4-0a2c-4ae0-b857-aa18d45cb12f', firstName: 'Michelle', lastName: 'Scott', email: 'mitchelle@gmail.com'});

db.set('1f352c5c-c41f-44b2-acfa-d7bc5c52f221',{id: '1f352c5c-c41f-44b2-acfa-d7bc5c52f221', firstName: 'Cameron', lastName: 'Scott', email: 'cam.34@gmail.com'});

const repo = {
    findAll: () => Array.from(db.values()),
    findContactById: (id) => db.get(id),
    deleteContactById: (id) => db.delete(id),
    addNewContact: (id,data) => db.set(id,data)
}

module.exports = repo;