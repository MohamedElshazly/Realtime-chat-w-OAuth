const chatMessages = document.querySelector('.chat-messages'); 
const chatForm = document.getElementById('chat-form'); 

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});
// console.log(username, room)
const socket = io();

socket.emit('joinRoom', {username, room}); 

socket.on('roomInfo', ({room, users}) => {
    //get room name element and add room name
    const roomName = document.getElementById('room-name');
    roomName.innerText = room;
    
    const roomUsers = document.getElementById('users'); 
    roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`; 

});

socket.on('message', message => {
    outputMessage(message); 

    //scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    //get the msg 
    const msg = e.target.elements.msg.value; 

    socket.emit('chatMessage', msg); 

    e.target.elements.msg.value = ""; 
    e.target.elements.msg.focus();
});

function outputMessage(message) { 
    const div = document.createElement('div'); 
    div.classList.add('message'); 
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
                     <p class="text">${message.text}</p>` 
    chatMessages.appendChild(div);

}