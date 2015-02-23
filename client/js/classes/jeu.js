/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	var mousePos;
	var allPlayers = {};

	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	/**
	 * INITIALISATION
	 */
	var init = function ()
	{
		console.log("initialisation ok");
		canvas = document.querySelector("#tankCanvas");
		w = canvas.width;
		h = canvas.height;
		ctx = canvas.getContext('2d');
		// affiche FPS
		showFPS();
		// Les écouteurs
		canvas.addEventListener("mousedown", traiteMouseDown);
		canvas.addEventListener("mousemove", traiteMouseMove);
		requestAnimationFrame(mainLoop);
	};

	/**
	 * ANIMATION MAINLOOP
	 */
	function mainLoop(time)
	{
		measureFPS(time);
		if (username != undefined) {
			clearCanvas();
			drawAllPlayers();
		}
		requestAnimationFrame(mainLoop);
	}

	/**
	 * Traitement souris
	 * @param evt
	 */
	function traiteMouseDown(evt) {
		//console.log("mousedown");
	}

	function traiteMouseMove(evt) {
		mousePos = getMousePos(canvas, evt);
		allPlayers[username].x = mousePos.x;
		allPlayers[username].y = mousePos.y;
		var pos = {'user': username, 'pos': mousePos}
		socket.emit('sendpos', pos);				   // ENVOIE DES COORDONNES
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	/**
	 * MAJ des positions de chaque joueur
	 * @param newPos
	 */
	function updatePlayerNewPos (newPos) {			  // SERT A CHAT.JS
		allPlayers[newPos.user].x = newPos.pos.x;
		allPlayers[newPos.user].y = newPos.pos.y;
	};

	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
	};

	/**
	 * Dessine le tank du joueur
	 * @param player
	 */
	function drawPlayer(player) {
		ctx.fillStyle = 'black';
		ctx.fillRect(player.x, player.y, 30, 30)
	}

	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			drawPlayer(allPlayers[name]);
		}
	}

	/**
	 * FPS
	 * @param newTime
	 */
	var measureFPS = function(newTime){
		// test for the very first invocation
		if(lastTime === undefined) {
			lastTime = newTime;
			return;
		}
		//calculate the difference between last & current frame
		var diffTime = newTime - lastTime;
		if (diffTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			lastTime = newTime;
		}
		fpsContainer.innerHTML = 'FPS: ' + fps;
		frameCount++;
	};

	function showFPS() {
		fpsContainer = document.createElement('div');
		fpsContainer.setAttribute('style', 'color: red');
		document.body.appendChild(fpsContainer);
	}

	/**
	 * Nettoie canvas, efface l'ecran
	 */
	function clearCanvas() {
		ctx.clearRect(0, 0, w, h);
	}

	// methodes publiques
	return {
		init: init,
		updatePlayers: updatePlayers,
		updatePlayerNewPos: updatePlayerNewPos
	};
};