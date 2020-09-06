const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20'); 
const keys = require('../keys');
const User = require('../models/user-model'); 



passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
});

passport.use(
    new GoogleStrategy({
        clientID : keys.google.clientID, 
        clientSecret : keys.google.clientSecret,
        callbackURL : 'http://localhost:3000/auth/google/redirect'
    }, 
    (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID : profile.id}).then((currentUser) => {
            if(currentUser){
                //if we already have that user, just serialize them
                done(null, currentUser); 
            }else{
                //otherwise add them to our database 
                new User({
                    username : profile.displayName, 
                    googleID : profile.id, 
                    room : "" 
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);