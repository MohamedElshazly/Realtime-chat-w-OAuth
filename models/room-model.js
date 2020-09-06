const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const roomSchema = new Schema({
    name : {
        type : String,
        required : true
    }, 
    password : {
        type : String 
    }
}); 

const Room = module.exports = mongoose.model('room', roomSchema); 