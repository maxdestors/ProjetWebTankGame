
// UTILISATION DU FRAMEWORK EXPRESS
var express = require('express');

// VARIABLES POUR LES MODULES REQUIS
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(28080);      // LANCEMENT SERVER SUR LE PORT 8080

// INDICATION D'OU SONT LES FICHIERS LOCAUX
app.use(express.static(__dirname + '/view/'));

// ON ROUTE VERS PAGE D'INDEX
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/view/index.html');
});

// PSEUDO DES PERSONNES CONNECTES AU CHAT
var usernames = {};
var listOfPlayers = {};
var rooms = ['room1','room2','room3'];

// CONNEXION ET TRAITEMENT DES MESSAGES
io.sockets.on('connection', function (socket)
{
    socket.on('sendchat', function (data) {                           // CLIENT A EMIS SENDCHAT, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATECHAT
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('sendpos', function (newPos) {                          // CLIENT A EMIS SENDPOS, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATEPOS
        socket.broadcast.emit('updatepos', socket.username, newPos);
    });

    socket.on('adduser', function(username)                           // CLIENT A EMIS ADDUSER, ON ECOUTE ET RENVOIE AU CLIENT POUR EXECUTER UPDATEPOS
    {
        socket.username = username;      // sorte de session pour stocker username
        usernames[username] = username;  // ajout du nom du client a la liste global

        socket.room = 'room1';           // room 1 par défaut
        socket.join('room1');

        socket.emit('updatechat', 'SERVER', 'you have connected to room1');  // info au client qu'il s'est connecté
        socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');  // info a tous les clients sauf le client courant que qqun s'est connecté
        io.sockets.emit('updateusers', usernames);  // on demande a chaque client de mettre a jour la liste des clients sur sa page

        socket.emit('updaterooms', rooms, 'room1'); // maj des rooms

        var player = {'x':0, 'y':0, 'v':0}          // transmission des coordonnées
        listOfPlayers[username] = player;
        io.sockets.emit('updatePlayers',listOfPlayers);
    });

    // CHANGEMENT DE SALLE
    socket.on('switchRoom', function(newroom){
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
        // sent message to OLD room
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
        // update socket session room title
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
    });

    // DECONNEXION DU CLIENT
    socket.on('disconnect', function()
    {
        delete usernames[socket.username];              // supprrime le nom de la liste
        io.sockets.emit('updateusers', usernames);      // maj de la liste des joueurs dans le chat
        delete listOfPlayers[socket.username];		    // suppression du joueur
        io.sockets.emit('updatePlayers',listOfPlayers);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');  // on dit à tout le monde quel joueur a quitté
        socket.leave(socket.room);
    });
});