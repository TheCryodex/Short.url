const express = require('express');
const router = require('express-promise-router')();
const Controller = require('../controller/controller');


router.route('/')
  .get(Controller.index);


router.route('/:id')
  //Redirects to url
  .get(Controller.urlForward);

router.route('/url')
  //Makes a url -  Add a post method
  .post(Controller.checkUrl);

  //router.route('/url/:id')
  //Get's url's info from db

module.exports =  router;
