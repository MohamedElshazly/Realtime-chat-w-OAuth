const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const userSchema = new Schema({
    username : {
        type : String, 
        required : true
    },
    googleID : {
        type : String, 
        required : true
    },
    room : {
        type : String
    }
}); 

const User = module.exports = mongoose.model('user', userSchema);