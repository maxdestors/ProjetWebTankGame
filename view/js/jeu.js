/**
 * Created by Romain on 18/02/2015.
 */


var canvas, ctx, mousePos;
var allPlayers = {};

/**
 * INITIALISATION
 */
function init() {
    console.log("init");
    canvas = document.querySelector("#tankCanvas");
    ctx = canvas.getContext('2d');
    // Les écouteurs
    canvas.addEventListener("mousedown", traiteMouseDown);
    canvas.addEventListener("mousemove", traiteMouseMove);
    anime();
}

/**
 * ANIMATION
 */
function anime() {
    if (username != undefined) {
        // 1 On efface l'écran
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 2 On dessine des objets
        drawAllPlayers();
    }
    // 4 On rappelle la fonction d'animation à 60 im/s
    requestAnimationFrame(anime);
}


/**
 * Traitement souris
 * @param evt
 */
function traiteMouseDown(evt) {
    //console.log("mousedown");
}

function traiteMouseMove(evt) {
    //console.log("mousemove");
    mousePos = getMousePos(canvas, evt);
    allPlayers[username].x = mousePos.x;
    allPlayers[username].y = mousePos.y;
    //console.log("On envoie sendPos");
    var pos = {'user': username, 'pos': mousePos}
    socket.emit('sendpos', pos);                   // ENVOIE DES COORDONNES
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/**
 * MAJ des positions
 * @param newPos
 */
function updatePlayerNewPos(newPos) {              // SERT A CHAT.JS
    allPlayers[newPos.user].x = newPos.pos.x;
    allPlayers[newPos.user].y = newPos.pos.y;
}

/**
 * MAJ du tableau des joueurs (connexion et deconnexion
 * @param listOfPlayers
 */
function updatePlayers(listOfPlayers) {
    allPlayers = listOfPlayers;
}

/**
 * Dessine le tank du joueur
 * @param player
 */
function drawPlayer(player) {
    ctx.fillRect(player.x, player.y, 20, 20)
    ctx.fillStyle = 'blue';
}

/**
 * Dessine tous les joueurs
 */
function drawAllPlayers() {
    for (var name in allPlayers) {
        drawPlayer(allPlayers[name]);
    }
}
