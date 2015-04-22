
// UTILISATION DU FRAMEWORK EXPRESS
var express = require('express');

// VARIABLES POUR LES MODULES REQUIS
var app = express()
	, http = require('http')
	, ent = require('ent')// encode les caracteres speciaux, equivalent à htmlentities
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

var port = process.env.PORT || 28080;

server.listen(port);     // LANCEMENT SERVER SUR LE PORT 28080

// INDICATION D'OU SONT LES FICHIERS LOCAUX
app.use(express.static(__dirname + '/client/'));

// ON ROUTE VERS PAGE D'INDEX
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

//Require classes
var fs = require('fs');

// file is included here:
eval(fs.readFileSync('client/js/classes/tank.js')+'');
eval(fs.readFileSync('client/js/classes/missile.js')+'');
eval(fs.readFileSync('client/js/classes/player.js')+'');

eval(fs.readFileSync('server/classes/jeuServ.js')+'');
eval(fs.readFileSync('server/classes/room.js')+'');




// PSEUDO DES PERSONNES CONNECTES AU CHAT
var usernames = {};
var listOfPlayers = {};
var roomsName = ['Room n°1','Room n°2','Room n°3'];

// list des rooms instancié depuis la liste des noms de Rooms
var rooms = {};
for (var roomName in roomsName) {
	var tmpRoom = new Room();
	tmpRoom.init(roomsName[roomName]);
	rooms[roomsName[roomName]] = tmpRoom;
}
console.log(rooms);



// CONNEXION ET TRAITEMENT DES MESSAGES
io.sockets.on('connection', function (socket)
{

	/**
	*  GAME
	*/
	socket.on('sendNewMove', function (newMovement, state) {
		console.log(newMovement + state);
		console.log(socket.room);
		var newTank = rooms[socket.room].newMove(socket.username, newMovement, state);

		if (newTank !== false) {
			console.log('passs');
			// socket.in(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
			socket.broadcast.to(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
			socket.emit('sendUpdatePlayerTank', socket.username, newTank);
		}
	});


	
	// CLIENT A EMIS updateUserTank, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER updatePlayerTank
	socket.on('sendUpdateUserTank', function (newTank) {
		socket.in(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
	});
	// envoie du nouveau missile
	socket.on('sendNewMissile', function (newMissile) {
		socket.in(socket.room).emit('sendAddMissile', newMissile);
    });



	/**
	*  CHAT
	*/

	// CLIENT A EMIS SENDCHAT, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATECHAT
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, ent.encode(data));
	});

	// Start Game
	socket.on('startGame', function () {
		/* START THE GAME */
		console.log("startGame : ");
		rooms[socket.room].startGame();

		var test = rooms[socket.room].getPlayers();
		var listName = {};
		for(var keyName in test) {
			listName[keyName] = test[keyName];
		}
		io.sockets.in(socket.room).emit('startClientGame', listName);
	});

	/*/ CLIENT A EMIS SENDPOS, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATEPOS
	socket.on('sendpos', function (newPos) {
		socket.broadcast.emit('updatepos', socket.username, newPos);
	});
	//*/


	// CLIENT A EMIS ADDUSER, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATEPOS
	socket.on('adduser', function(username)
	{
		socket.username = ent.encode(username);   // sorte de session pour stocker username
		usernames[username] = username;  // ajout du nom du client a la liste global

		socket.room = roomsName[0];          // room 1 par défaut
		socket.join(roomsName[0]);

	// console.log(username);
		rooms[roomsName[0]].addPlayer(username);
		rooms[roomsName[0]].disp();
		socket.emit('updatechat', 'SERVER', 'vous êtes connecté à la '+roomsName[0]+'.');  // info au client qu'il s'est connecté
		socket.broadcast.to(roomsName[0]).emit('updatechat', 'SERVER', username + "s'est connecté à cette Room");  // info a tous les clients sauf le client courant que qqun s'est connecté
		io.sockets.emit('updateusers', usernames);     // on demande a chaque client de mettre a jour la liste des clients sur sa page

		socket.emit('updaterooms', roomsName, roomsName[0]); // maj des roomsName

		//listOfPlayers[username] = {'tank':null};
		//io.sockets.emit('updatePlayers', rooms[roomsName[0]].getPlayers());
	});

	// CHANGEMENT DE SALLE
	socket.on('switchRoom', function(newroom){
		//retire le joueur de la room 
		rooms[socket.room].removePlayer(socket.username);
		socket.leave(socket.room);
		socket.join(newroom);
		//on le met dans celle choisi
		rooms[newroom].addPlayer(socket.username);

		socket.emit('updatechat', 'SERVER', 'vous êtes connecté à la salle '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' a quitté la salle.');
		// on stop le game
		socket.broadcast.to(socket.room).emit('stopClientGame');
		socket.emit('stopClientGame');
		rooms[socket.room].stopGame();

		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' a rejoint la salle');
		socket.emit('updaterooms', roomsName, newroom);
	});

	// DECONNEXION DU CLIENT
	socket.on('disconnect', function()
	{
		// on stop le game
		socket.broadcast.to(socket.room).emit('stopClientGame');
		socket.emit('stopClientGame');
		rooms[socket.room].stopGame();


		delete usernames[socket.username];            // supprrime le nom de la liste
		io.sockets.emit('updateusers', usernames);    // maj de la liste des joueurs dans le chat
		delete listOfPlayers[socket.username];          // suppression du joueur
		io.sockets.emit('updatePlayers',listOfPlayers);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + " s'est déconnecté");  // on dit à tout le monde quel joueur a quitté
		socket.leave(socket.room);
	});
});