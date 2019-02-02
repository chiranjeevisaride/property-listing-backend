const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const  userSchema = new Schema({
    username : {
        type: String, 
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too short, max is 32 characters'],
    },
    email: {
        type: String, 
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too short, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is reuired',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String, 
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too short, max is 32 characters'],
        required: true,
    },
    rentlas: [{
        type: Schema.Types.ObjectId, 
        ref: 'Rental'
    }]
});


userSchema.methods.isSamePassword = function(requestedPassword){
    return bcrypt.compareSync(requestedPassword, this.password);
};

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
           user.password = hash;
           next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);