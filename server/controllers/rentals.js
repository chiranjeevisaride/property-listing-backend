const Rental = require('../models/rentals');

exports.rentals = function(req, res) {
    Rental.find({}, function(err, foundRentals) {
        res.json(foundRentals);
    });
 }

 exports.rental = function (req, res) {
    const rentalId = req.params.id;
    Rental.findById(rentalId, function (err, foundRental) {
        if(err){
            res.status(422).send({errors: [{
                title: 'Rentals Errors!',
                detail: 'Cound not find Rental!' }]
            });
        }
        res.json(foundRental);
    });
}