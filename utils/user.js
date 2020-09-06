const mongoose = require('mongoose'); 
const User = require('../models/user-model'); 

function userLeave(name) {
    User.findOneAndUpdate({username : name }, {room : ""}, {new : true, useFindAndModify: false}).then((user) =>{
        // console.log(user.room);
    });
}

module.exports = userLeave;