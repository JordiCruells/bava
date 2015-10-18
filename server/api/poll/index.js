'use strict';

var express = require('express');
var controller = require('./poll.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/all', controller.index);
router.get(['/top/:limit', '/top'], controller.indexTop); // Returns the top first voted <limit> of polls
router.get(['/last/:limit/:page','/last/:limit', '/last'], controller.indexLast); // Returns the top first voted <limit> of polls
router.get('/', auth.isAuthenticated(), controller.indexUser);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(),controller.update);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

//Let an unauthenticated user vote
router.put('/:id/vote', controller.vote);

module.exports = router;
