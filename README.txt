//Node Installeren vanuit onderstaande link kies voor LTS
https://nodejs.org/

//Check als Node er is
node -v

//check als npm er is
npm -v

//indien npm niet
npm install

//Database users opzetten
npm install sqlite3
cd "hier je path naar database.js"
node database.js

//node server starten
npm start 


//IF NPM NOT RECOGNIZED IN VS CODE
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
