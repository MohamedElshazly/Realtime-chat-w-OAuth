const router = require('express').Router(); 
const Room = require('../models/room-model');
const User = require('../models/user-model');


router.get('/home', checkIfAuthenticated, (req, res) => {
    res.render('home')
})

router.get('/create', checkIfAuthenticated, (req, res) => {
    res.render('create', {err : ""});

});
router.post('/create', (req, res) => {
    Room.findOne({name : req.body.roomName}).then((currentRoom) => {
        if(currentRoom){
            res.render('create', {err : 'Room Already exists'});
        }else{
            if(req.body.status === 'public'){
               new Room({
                name : req.body.roomName,
                }).save().then((newRoom) => {
                    console.log(`Room: "${newRoom.name}" has been created...`);
                    res.redirect('/room/home'); 
                }); 
            }else{
                new Room({
                    name : req.body.roomName,
                    password : req.body.password 
                    }).save().then((newRoom) => {
                        console.log(`Room: "${newRoom.name}" has been created...`);
                        res.redirect('/room/home'); 
                    }); 
            }
            
        }
    });

});

router.get('/join', checkIfAuthenticated, (req, res) => {
    Room.find({}).then((rooms) => {
        res.render('join', {rooms : rooms});
    });
});

router.post('/join', (req, res) => {
    User.findOneAndUpdate({googleID : req.user.googleID}, {room : req.body.room}, {new : true, useFindAndModify: false}).then((user) => {
        res.redirect(`/room/chat?username=${user.username}&room=${user.room}`)
    });    
})
router.get('/chat', checkIfAuthenticated, checkIfInRoom, (req, res) => {
    //IMPORTANT.....IMPORTANT
    //THINK OF HOW TO PREVENT SOMEONE FROM GOING HERE WITHOUT GOING
    //THROUGH THE /JOIN ROUTE FIRST....(DONE....)
    // console.log(req.body.room)
    res.render('chat')
})
router.get('/leave', checkIfAuthenticated, (req, res) => {
    res.redirect('/room/home');
})

function checkIfAuthenticated(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/')
    }else{
        next();
    }
}

function checkIfInRoom(req, res, next) {
    if(req.user.room === ""){
        res.redirect('/room/home');
    }else{
        next();
    }
}
module.exports = router;