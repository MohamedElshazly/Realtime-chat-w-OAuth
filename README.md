# Realtime-chat-w-OAuth

Realtime chat app using Express and socket.io

The user authentication is made using passport, google Oauth startegy. 

To get the app running on your machine, you need to rename the '.env-example' file to '.env', and to fill in the required info 

stated in there. 

You can set up the google credentials from : https://console.developers.google.com/ 

One last thing: 

in ./config/passport-config.js:

    new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID, 
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : 'YOUR CALLBACK URI THAT YOU'VE SPECIFIED WHEN SETTING UP GOOGLE CREDENTIALS'
    }

to run this app: 
  1. install all the dependencies with: "npm install"
  2. To run the app : "npm run start"
  
 
To demo the app : 
https://poormans-discord.herokuapp.com/
