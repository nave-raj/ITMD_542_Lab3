var express = require('express');
var crypto = require('node:crypto');
var router = express.Router();
const contactRepo = require('../src/contactsRepository');

/* GET all contacts listing */
router.get('/', (req, res, next) => {
  const contactData = contactRepo.findAll();
  res.render('contacts', {contacts: contactData});
});

/* GET Create Contact Page */
router.get('/create-contact', (req, res, next) => {
  res.render('create-contact',{title: 'Create a New Contact'});
});

/* POST Contact Details from Create Contact Page */
router.post('/create-contact', (req, res, next) => {
  const { firstName, lastName, email, notes } = req.body;
  if (!firstName || !email || !lastName) {
      return res.status(400).json({ message: 'Name and email are required' });
  }
  const uuid = crypto.randomUUID();
  const newContact = { id: uuid, firstName: firstName, lastName: lastName, email: email };
  contactRepo.addNewContact(uuid, newContact);
  res.redirect('/contacts');
});

/* GET Single Contact View Page */
router.get('/:id', (req, res, next) => {
  const singleContactData = contactRepo.findContactById(req.params.id);
  if(singleContactData){
  res.render('contact', { contact: singleContactData});
  } else {
    res.redirect('/contacts');
  }
});

/* GET Contact Confirm Delete Page */
router.get('/:id/delete', (req, res, next) => {
  const data = contactRepo.findContactById(req.params.id);
  res.render('delete-contact', { contact: data });
});

/* POST Contact Delete */
router.post('/:id/delete', (req, res, next) => {
  contactRepo.deleteContactById(req.params.id);
  res.redirect('/contacts');
});

module.exports = router;
