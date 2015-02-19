/**
 * Created by Romain on 18/02/2015.
 */

do
{   // TODO rom
    var username = prompt("Votre pseudo ?");      // STOCKE NOM DU JOUEUR
}
while(username.length < 4);

var conversation, data, datasend, users;          // VARIABLES USEFUL
var socket = io.connect();

/**
 *  CONNEXION SERVER ET DEMANDE PSEUDO
 */
socket.on('connect', function(){      // call the server-side function 'adduser' and send one parameter (value of prompt)
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
 * POSITION DU JOUEUR
 */
socket.on('updatepos', function (username, newPos) {
    updatePlayerNewPos(newPos);   // appel fonction jeu.js
});

/**
 * SERVEUR EMET UPDATE ROOM
 */
socket.on('updaterooms', function(rooms, current_room) {
    $('#rooms').empty();
    $.each(rooms, function(key, value) {
        if(value == current_room){
            $('#rooms').append('<div style="color:#37B76D">- ' + value + '</div>');
        }
        else {
            $('#rooms').append('<div>- <a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
        }
    });
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
socket.on('updateusers', function(listOfUsers) {
    users.innerHTML = "";
    for(var name in listOfUsers) {
        var userLineOfHTML = '<div>- ' + name + '</div>';
        users.innerHTML += userLineOfHTML;
    }
});

/**
 * GESTION LISTE JOUEUR AVEC LES DECONNEXIONS
 */
socket.on('updatePlayers', function(listOfplayers) {
    updatePlayers(listOfplayers);   // appel fonction jeu.js
});

/**
 * ONLOAD : AU CHARGEMENT DE LA PAGE
 */
window.addEventListener("load", function()
{
    conversation = document.querySelector("#conversation");
    data = document.querySelector("#data");
    datasend = document.querySelector("#datasend");
    users = document.querySelector("#users");

    // BOUTON ENVOYER
    datasend.addEventListener("click", function(evt) {
        sendMessage();
    });

    // TEST APPUI ENTER + TEST SI DANS INPUT
    data.addEventListener("keypress", function(evt) {
        // if pressed ENTER, then send
        if(evt.keyCode == 13) {
            this.focus();
            sendMessage();
        }
    });

    // ENVOIE DU MESSAGE SENDCHAT AU SERVER
    function sendMessage() {
        var message = data.value;
        if(message != "") {   // TODO rom
            data.value = "";  // on efface l'input
            socket.emit('sendchat', message);
        }
    }
});
