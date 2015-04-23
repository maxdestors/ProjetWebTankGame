/**
 * Created by Romain on 18/02/2015.
 */

var usernameAsk, regex, res;
var conversation, data, datasend, users;
var game;
var socket = io.connect();

// chargement de la page
window.addEventListener("load", function ()
{
	conversation = document.querySelector("#conversation");
	data = document.querySelector("#data");
	datasend = document.querySelector("#datasend");
	startGameBtn = document.querySelector("#startGameBtn");
	users = document.querySelector("#users");

	game = new Jeu();
	game.init();

	// bouton start
	startGameBtn.addEventListener("click", function (evt) {
        socket.emit('startGame');
	});
	// bouton envoyer
	datasend.addEventListener("click", function() {
		sendMessage();
	});

	// test appui sur enter et test si dans input
	data.addEventListener("keypress", function (evt) {
		if(evt.keyCode === 13) {
			this.focus();
			sendMessage();
		}
	});

    // connexion server et demande pseudo
	socket.on('connect', function(){
		getPseudo();
		socket.emit('adduser', usernameAsk);
	});
});

// update chat
socket.on('updatechat', function (username, data) {
	var chatMessage = "<div><b>" + username + ":</b> " + data + "</br></div>";
	conversation.innerHTML += chatMessage;
});

// le serveur emet update rooms
socket.on('updaterooms', function (rooms, current_room) {
	var rms = document.querySelector("#rooms");
	rms.innerHTML = null;
	for (var i = 0; i < rooms.length; i++) {
		if(rooms[i] === current_room){
			rms.innerHTML += '<div><button class="btnfocus" disabled> ' + rooms[i] + '</button></div>';
		}
		else {
			rms.innerHTML += '<div><button class="btnrooms" onclick="switchRoom(\'' + rooms[i] + '\')">' + rooms[i] + '</button></div>';
		}
	}
});

// changement de salle
function switchRoom(room){
	socket.emit('switchRoom', room);
}

// mise à jour de la liste avec le nouveau joueur
socket.on('updateusers', function (listOfUsers, listOfScores) {
	users.innerHTML = "";
	for(var name in listOfUsers) {
		var userLineOfHTML = '<div>' + listOfUsers[name] + ' - '+ listOfScores[name] +'</div>';
		users.innerHTML += userLineOfHTML;
	}
});

// envoie du message sendchat au serveur
function sendMessage() {
    var message = data.value;
    if(message != "") {
        data.value = "";       // on efface l'input
        socket.emit('sendchat', message);
    }
}

// position du joueur
socket.on('sendUpdatePlayerTank', function (username, tank) {
	game.updatePlayerTank(username, tank);   // appel fonction jeu.js
});

// nouveau missile tiré
socket.on('sendAddMissile', function (newMissile) {
	game.addNewMissile(newMissile);   // appel fonction jeu.js
});
// remove missile
socket.on('sendKillMissile', function (i) {
	game.killMissile(i);   // appel fonction jeu.js
});

// gestion liste joueurs avec les deconnexions
socket.on('updatePlayers', function (listOfplayers) {
	game.updatePlayers(listOfplayers);   // appel fonction jeu.js
});

// obtention du pseudo
function getPseudo() {
    do {
        usernameAsk = prompt("Votre pseudo ?");	            // stocke le nom du joueur
        if (usernameAsk === null) {
        	usernameAsk = "Anonymous";
        };
        //usernameAsk = getUserName();
        regex = new RegExp('^[a-z0-9A-Zéèêàâîô]{3,17}$');   // pseudo de 3 à 17 caractères autorisés
        res = regex.test(usernameAsk);
    }
    while(res !== true);
}

// start game
socket.on('startClientGame', function (listOfNames) {
	console.log('Start THE GAME');
	game.start(usernameAsk, listOfNames);
	startGameBtn.disabled = true;
});

// stop game
socket.on('stopClientGame', function () {
	game.stop();
	startGameBtn.disabled = false;
});