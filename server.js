const express = require('express');
const keys = require('./keys');
const mongoose = require('mongoose');
const passportInit = require('./config/passport-config');
const roomRoutes = require('./routes/room-routes');
const authRoutes = require('./routes/auth-routes');
const cookieSession = require('cookie-session');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const userLeave = require('./utils/user');  


const Room = require('./models/room-model'); 
const User = require('./models/user-model'); 

const app = express();

mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to database');
}); 

app.set('view engine', 'ejs');
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, 
    keys : [keys.session.cookieKey]
}));
app.use(passport.initialize()); 
app.use(passport.session());
app.use(express.static('./public'));
app.use(express.urlencoded({extended : false}));

app.use('/room', roomRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.render('index')
})

const server = http.createServer(app);
const io = socketio(server);  

//our Almighty AI Overlord
const bot = 'AI Overlord'; 

io.on('connection', socket => {
    // console.log("user connected....");
    socket.on('joinRoom', ({username, room}) => {

        //join room
        socket.join(room);

        User.find({room : room}).then((users) => {
            // console.log('here')
            io.to(room).emit('roomInfo', {
                room : room, 
                users : users
            });
        })

        // emit a welcome message to connected user
        socket.emit('message', formatMessage(bot, ` Welcome to AssCord, ${username}`));

        socket.broadcast.to(room).emit('message', formatMessage(bot, `${username} has joined the chat`));

        socket.on('chatMessage', (message) => {
            io.to(room).emit("message", formatMessage(username, message));
        });

        socket.on('disconnect', () => {
            userLeave(username);
            io.to(room).emit("message", formatMessage(bot, `${username} has left the chat`));

        User.find({room : room}).then((users) => {
            // console.log('here')
            io.to(room).emit('roomInfo', {
                room : room, 
                users : users
            });
        }); 
    });

    }); 


})



const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
});