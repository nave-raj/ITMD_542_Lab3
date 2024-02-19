var express = require('express');
var crypto = require('node:crypto');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const contactRepo = require('../src/contactsRepository');

/* GET all contacts listing */
router.get('/', (req, res, next) => {
  const contactData = contactRepo.findAll();
  res.render('contacts', {contacts: contactData});
});

/* GET Create Contact Page */
router.get('/create-contact', (req, res, next) => {
  res.render('create-or-edit-contact',{title: 'Create a New Contact', buttonText: 'Create Contact', actionURL: 'create-contact'});
});

/* POST Contact Details from Create Contact Page */
router.post('/create-contact', body('firstName').trim().escape().notEmpty().withMessage('First Name Cannot Be Empty!'), 
                body('lastName').trim().escape().notEmpty().withMessage('Last Name Cannot be Empty!'),
                body('email').trim().escape().notEmpty().withMessage('Email cannot be Empty!').isEmail().withMessage('Enter a valid Email'),
                body('notes').trim().escape(), (req, res, next) => {
  const result = validationResult(req);
  if(!result.isEmpty()){
    res.render('create-or-edit-contact',{title: 'Create a New Contact', buttonText: 'Create Contact', actionURL: 'create-contact',msg: result.array()});
  }
  const { firstName, lastName, email, notes } = req.body;
  if (!firstName || !email || !lastName) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const uuid = crypto.randomUUID();
  const date = new Date();
  const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const newContact = { id: uuid, firstName: firstName, lastName: lastName, email: email, notes: notes, lastUpdateDate: formattedDate};
  contactRepo.addNewContact(uuid, newContact);
  res.redirect('/contacts');
});

/* GET Edit Contact Page */
router.get('/:id/edit', (req, res, next) => {
  const editContactData = contactRepo.findContactById(req.params.id);
  res.render('create-or-edit-contact',{title: 'Edit Contact', buttonText: 'Edit Contact', contact: editContactData, actionURL: `edit`});
});

/* POST Edit Contact */
router.post('/:id/edit', body('firstName').trim().escape().notEmpty().withMessage('First Name Cannot Be Empty!'), 
                  body('lastName').trim().escape().notEmpty().withMessage('Last Name Cannot be Empty!'),
                  body('email').trim().escape().notEmpty().withMessage('Email cannot be Empty!').isEmail().withMessage('Enter a valid Email'),
                  body('notes').trim().escape(), (req, res, next) => {
  const result = validationResult(req);
  if(!result.isEmpty()){
    res.render('create-or-edit-contact',{title: 'Create a New Contact', buttonText: 'Create Contact', actionURL: 'create-contact',msg: result.array()});
  }
  const {firstName, lastName, email, notes} = req.body;
  if (!firstName || !email || !lastName) {
    return res.status(400).json({ message: 'Name and email are required' });
  } 
  const date = new Date();
  const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const editedContact = { id: req.params.id, firstName: firstName, lastName: lastName, email: email, notes: notes, lastUpdateDate: formattedDate};
  contactRepo.updateExistingContact(editedContact);  
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
