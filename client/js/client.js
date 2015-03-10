/**
 * Created by Romain on 18/02/2015.
 */

do
{   // TODO rom
	var username = prompt("Votre pseudo ?");	     // STOCKE NOM DU JOUEUR
    var regex = new RegExp('^[a-z0-9A-Z]{3,18}$');   // Pseudo de 3 à 18 caractères
    var res = regex.test(username);
}
while(res !== true);

// var game = new JEU();

var conversation, data, datasend, users;	     // VARIABLES USEFUL
var game;
var socket = io.connect();

/**
 * ONLOAD : AU CHARGEMENT DE LA PAGE
 */
window.addEventListener("load", function ()
{
	conversation = document.querySelector("#conversation");
	data = document.querySelector("#data");
	datasend = document.querySelector("#datasend");
	users = document.querySelector("#users"); 

	game = new Jeu();
	game.init(username);

	// BOUTON ENVOYER
	datasend.addEventListener("click", function (evt) {
		sendMessage();
	});

	// TEST APPUI ENTER + TEST SI DANS INPUT
	data.addEventListener("keypress", function (evt) {
		// if pressed ENTER, then send
		if(evt.keyCode === 13) {
			this.focus();
			sendMessage();
		}
	});
});

/**
 *  CONNEXION SERVER ET DEMANDE PSEUDO
 */
socket.on('connect', function(){	  // call the server-side function 'adduser' and send one parameter (value of prompt)
	socket.emit('adduser', username);
});

/**
 * UPDATE TCHAT
 */
socket.on('updatechat', function (username, data) {
	var chatMessage = "<div><b>" + username + ":</b> " + data + "</br></div>";
	conversation.innerHTML += chatMessage;
});

/**
 * SERVEUR EMET UPDATE ROOM
 */
socket.on('updaterooms', function (rooms, current_room) {
	var rms = document.querySelector("#rooms");
	rms.innerHTML = null;
	for (var i = 0; i < rooms.length; i++) {
		if(rooms[i] === current_room){
			rms.innerHTML += '<div style="color:#37B76D">- ' + rooms[i] + '</div>';
		}
		else {
			rms.innerHTML += '<div>- <a href="#" onclick="switchRoom(\'' + rooms[i] + '\')">' + rooms[i] + '</a></div>';
		}
	}
});

/**
 * CHANGEMENT DE SALLE
 * @param room
 */
function switchRoom(room){
	socket.emit('switchRoom', room);
}

/**
 * UPDATE LISTE AVEC LE NOUVEAU JOUEURs
 */
socket.on('updateusers', function (listOfUsers) {
	users.innerHTML = "";
	for(var name in listOfUsers) {
		var userLineOfHTML = '<div>- ' + name + '</div>';
		users.innerHTML += userLineOfHTML;
	}
    game.soundPlayer(listOfUsers);                              // TODO SOUND
});

/**
 * ENVOIE DU MESSAGE SENDCHAT AU SERVER
 */
function sendMessage() {
    var message = data.value;
    if(message != "") {        // TODO rom
        data.value = "";       // on efface l'input
        socket.emit('sendchat', message);
    }
}

/**
 * POSITION DU JOUEUR
 */
socket.on('sendUpdatePlayerTank', function (username, tank) {
	game.updatePlayerTank(username, tank);   // appel fonction jeu.js
});

/**
 * Nouveau missile tiré
 */
socket.on('sendAddMissile', function (newMissile) {
	game.addNewMissile(newMissile);   // appel fonction jeu.js
});

/**
 * GESTION LISTE JOUEUR AVEC LES DECONNEXIONS
 */
socket.on('updatePlayers', function (listOfplayers) {
	game.updatePlayers(listOfplayers);   // appel fonction jeu.js
});