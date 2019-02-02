const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/rentals');
const UserCtrl = require('../controllers/user');

router.get('', UserCtrl.authMiddleware, RentalController.rentals);

router.get('/:id', UserCtrl.authMiddleware, RentalController.rental);

module.exports = router;