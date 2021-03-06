const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    password_hash: String,
    email_id: String,
    phone_number: String,
    first_name: String, 
    last_name: String,
    gender: String,
    dob: Date,
    vehicles: [{
        vehicle_type: String,
        color: String,
        vehicle_number: String,
        make: String,
        model: String,
        currently_parked: {
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('User', userSchema);