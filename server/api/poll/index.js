'use strict';

var express = require('express');
var controller = require('./poll.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/all', controller.index);
router.get('/', auth.isAuthenticated(), controller.indexUser);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(),controller.update);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

module.exports = router;
