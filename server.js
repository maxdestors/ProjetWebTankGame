
// UTILISATION DU FRAMEWORK EXPRESS
var express = require('express');

// VARIABLES POUR LES MODULES REQUIS
var app = express()
	, http = require('http')
	, ent = require('ent')// encode les caracteres speciaux, equivalent à htmlentities
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(28080);     // LANCEMENT SERVER SUR LE PORT 8080

// INDICATION D'OU SONT LES FICHIERS LOCAUX
app.use(express.static(__dirname + '/client/'));

// ON ROUTE VERS PAGE D'INDEX
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

// PSEUDO DES PERSONNES CONNECTES AU CHAT
var usernames = {};
var listOfPlayers = {};
var rooms = ['Room n°1','Room n°2','Room n°3'];

// CONNEXION ET TRAITEMENT DES MESSAGES
io.sockets.on('connection', function (socket)
{

	/**
	*  GAME
	*/
	
	// CLIENT A EMIS updateUserTank, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER updatePlayerTank
	socket.on('sendUpdateUserTank', function (newTank) {
		socket.broadcast.emit('sendUpdatePlayerTank', socket.username, newTank);
	});
	// envoie du nouveau missile
	socket.on('sendNewMissile', function (newMissile) {
		socket.broadcast.emit('sendAddMissile', newMissile);
    });



	/**
	*  CHAT
	*/

	// CLIENT A EMIS SENDCHAT, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATECHAT
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, ent.encode(data));
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

		socket.room = 'Room n°1';          // room 1 par défaut
		socket.join('Room n°1');

		socket.emit('updatechat', 'SERVER', 'vous êtes connecté à la Room n°1.');  // info au client qu'il s'est connecté
		socket.broadcast.to('Room n°1').emit('updatechat', 'SERVER', username + "s'est connecté à cette Room");  // info a tous les clients sauf le client courant que qqun s'est connecté
		io.sockets.emit('updateusers', usernames);     // on demande a chaque client de mettre a jour la liste des clients sur sa page

		socket.emit('updaterooms', rooms, 'Room n°1'); // maj des rooms

		listOfPlayers[username] = {'tank':null};
		io.sockets.emit('updatePlayers',listOfPlayers);
	});

	// CHANGEMENT DE SALLE
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'vous êtes connecté à la salle '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' a quitté la salle.');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' a rejoint la salle');
		socket.emit('updaterooms', rooms, newroom);
	});

	// DECONNEXION DU CLIENT
	socket.on('disconnect', function()
	{
		delete usernames[socket.username];            // supprrime le nom de la liste
		io.sockets.emit('updateusers', usernames);    // maj de la liste des joueurs dans le chat
		delete listOfPlayers[socket.username];          // suppression du joueur
		io.sockets.emit('updatePlayers',listOfPlayers);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + " s'est déconnecté");  // on dit à tout le monde quel joueur a quitté
		socket.leave(socket.room);
	});
});