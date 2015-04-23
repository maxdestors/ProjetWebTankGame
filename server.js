// utilisation du framework express
var express = require('express');

// variables pour les différents modules requis
var app = express()
	, http = require('http')
	, ent = require('ent')                      // encode les caracteres speciaux, equivalent à htmlentities
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

// port et lancement du serveur, process.env.PORT pour heroku
var port = process.env.PORT || 28080;
server.listen(port);

// indication d'ou sont les fichiers locaux
app.use(express.static(__dirname + '/client/'));

// on route vers la page d'index
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

// pseudo des personnes connectées au chat
var usernames = {};
var userScores = {};
var listOfPlayers = {};
var roomsName = ['Room n°1','Room n°2','Room n°3'];

// list des rooms instanciées depuis la liste des noms de Rooms
var rooms = {};
for (var roomName in roomsName) {
	var tmpRoom = new Room();
	tmpRoom.init(roomsName[roomName]);
	rooms[roomsName[roomName]] = tmpRoom;
}
console.log(rooms);


/**
 *  Connexion et traitement des messages
 */
io.sockets.on('connection', function (socket)
{
    /**
     *   Pour le jeu :
     */

    // modification des positions
	socket.on('sendNewMove', function (newMovement, state) {
		var newTank = rooms[socket.room].newMove(socket.username, newMovement, state);

		if (newTank !== false) {
			// pourquoi ca ne marche pas ?????
			// socket.in(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
			socket.broadcast.to(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
			socket.emit('sendUpdatePlayerTank', socket.username, newTank);
		}
	});

    // client a emis updateUserTank, ecoute et renvoie au client pour executer updatePlayerTank
	socket.on('sendUpdateUserTank', function (newTank) {
		socket.in(socket.room).emit('sendUpdatePlayerTank', socket.username, newTank);
	});

	// envoie du nouveau missile
	socket.on('sendNewMissile', function (newMissile) {
		rooms[socket.room].addNewMissile(newMissile);
		socket.in(socket.room).emit('sendAddMissile', newMissile);
    });



	// start game
	socket.on('startGame', function () {

		if (rooms[socket.room].getIsGameRunning()) {
			return;
		}
		/* START THE GAME */
		console.log("startGame : " + socket.username);

		rooms[socket.room].startGame();

		var test = rooms[socket.room].getPlayers();
		var listName = {};
		for(var keyName in test) {
			listName[keyName] = test[keyName];
		}
		// en plus aller chercher la list des tanks
		io.sockets.in(socket.room).emit('startClientGame', listName);
	});

	// winner point
	socket.on('imTheWinner', function () {
		userScores[socket.username]++;
		console.log(socket.username + " score : " + userScores[socket.username]);
		io.sockets.in(socket.room).emit('updateusers', usernames , userScores);

	});

	/**
	*   Pour le chat :
	*/

	// client a emis sendchat, on ecoute et renvoie au client pour executer 
	socket.on('sendchat', function (data) {
		console.log(socket.username + " a ecrit : " + ent.encode(data));
		io.sockets.in(socket.room).emit('updatechat', socket.username, ent.encode(data));
	});

	// un nouveau utilisateur ce connect
	socket.on('adduser', function(username)
	{
		if (!username) {
			return;
		}
		console.log("connect : " + username);
		socket.username = username;                              // sorte de session pour stocker username
		usernames[username] = ent.encode(username);  // ajout du nom du client a la liste global
		userScores[username] = 0;

		socket.room = roomsName[0];                              // room 1 par défaut
		socket.join(roomsName[0]);

		rooms[roomsName[0]].addPlayer(username);

        // info au client qu'il s'est connecté
		socket.emit('updatechat', 'SERVER', 'vous êtes connecté à la '+roomsName[0]+'.');
        // info a tous les clients sauf le client courant que qqun s'est connecté
		socket.broadcast.to(roomsName[0]).emit('updatechat', 'SERVER', username + "s'est connecté à cette Room");

        // on demande a chaque client de mettre a jour la liste des clients sur sa page
        io.sockets.emit('updateusers', usernames, userScores);

		socket.emit('updaterooms', roomsName, roomsName[0]); // maj des roomsName
	});

	// changement de salle
	socket.on('switchRoom', function(newroom){
		console.log("switchRoom : " + socket.username + " from " + socket.room + " to " + newroom);
		//retire le joueur de la room 
		rooms[socket.room].removePlayer(socket.username);
		socket.leave(socket.room);
		socket.join(newroom);
		//on le met dans celle choisie
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

	// deconnexion du client
	socket.on('disconnect', function()
	{
        if(!socket.username) {
            return;
        }
		console.log("disconnect : " + socket.username);
		// on stop le game
		socket.broadcast.to(socket.room).emit('stopClientGame');
		socket.emit('stopClientGame');
		rooms[socket.room].stopGame();
		rooms[socket.room].removePlayer(socket.username);

		delete usernames[socket.username];                  // supprrime le nom de la liste
		delete userScores[socket.username];                  // supprrime le nom de la liste
		io.sockets.emit('updateusers', usernames, userScores);          // maj de la liste des joueurs dans le chat
		delete listOfPlayers[socket.username];              // suppression du joueur
		io.sockets.emit('updatePlayers',listOfPlayers);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + " s'est déconnecté");   // on dit à tout le monde quel joueur a quitté
		socket.leave(socket.room);
	});
});