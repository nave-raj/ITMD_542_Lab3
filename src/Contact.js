class Contact {
    constructor(id, firstName, lastName, email, notes, lastUpdateDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.notes = notes;
        this.lastUpdateDate = lastUpdateDate;
    }
}

module.exports = Contact;