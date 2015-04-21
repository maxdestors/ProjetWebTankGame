/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

	var isGameRunning;

	var mousePos;
	var userName;
	var allPlayers = {};

	// missiles
	var allMissiles = new Array();

	// sounds
	var soundMiss, soundNewPlayer;

	// fps
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;

	//deltatime
	var prevTime;
	var deltaTime;

	/**
	 *  INITIALISATION
	 */
	var init = function ()
	{
		console.log("initialisation ok");

		// Le canvas
		canvas = document.querySelector("#tankCanvas");
		w = canvas.width;
		h = canvas.height;
		ctx = canvas.getContext('2d');


		// charge les sons
		soundMiss = new Audio("sound/missile.wav");
		soundNewPlayer = new Audio("sound/welcome.wav");
	};

	var start = function (newuserName, listOfplayers)
	{
		userName = newuserName;

		console.log('lol');
		console.log(listOfplayers);
		for (var name in listOfplayers) {
			allPlayers[name] = new Player();
			allPlayers[name].init(name, listOfplayers[name])
		}
		console.log(allPlayers);

		// affiche FPS pour debug
		showFPS();

		// Les écouteurs
		canvas.addEventListener("mousedown", traiteMouseDown);
		canvas.addEventListener("mousemove", traiteMouseMove);
		document.addEventListener('keydown', traiteKeyDown, false);
		document.addEventListener('keyup', traiteKeyUp, false);

		prevTime = new Date().getTime();

		isGameRunning = true;
		
		requestAnimationFrame(mainLoop);
	};

	var stop = function ()
	{
		isGameRunning = false;
		console.log('game stopped');
	};


	/**
	 * ANIMATION MAINLOOP
	 */
	function mainLoop(time)
	{
		measureFPS(time);
		manageDeltaTime(time);
		if (userName != undefined) {
			clearCanvas();

			moveAllMissiles();
			drawAllMissiles();

			moveAllPlayers();
			drawAllPlayers();
		}
		if (isGameRunning) {
			requestAnimationFrame(mainLoop);
		}
	}

	/**
	 * Traitement souris
	 * @param evt
	 */
	function traiteMouseDown(evt) {
		soundMiss.play();                                                   // TODO new missile sound
		var missile = allPlayers[userName].fireTank();
		socket.emit('sendNewMissile', missile.getMembers());
		allMissiles.push(missile);
		//console.log("mousedown");
	}
	function traiteMouseMove(evt) {
		mousePos = getMousePos(canvas, evt);
		allPlayers[userName].rotateWeaponTank(mousePos.x, mousePos.y);
		//sendUpdateUserTank();
	}
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	/**
	 * Traitement clavier
	 * @param evt
	 */
	function traiteKeyDown(evt) {
		// console.log("keyDown: "+evt.keyCode);
		// 37   Left arrow    ||  81   Q
		// 38   Up arrow      ||  90   Z
		// 39   Right arrow   ||  68   D
		// 40   Down arrow    ||  83   S
		if (evt.keyCode === 81) {
			if (!allPlayers[userName].getIsRotatingLeftTank()) {
				sendNewMove('isMovingForward', true);
			}
		}
		if (evt.keyCode === 90) {
			if (!allPlayers[userName].getIsMovingForwardTank()) {
				sendNewMove('isMovingBackward', true);
			}
		}
		if (evt.keyCode === 68) {
			if (!allPlayers[userName].getIsRotatingRightTank()) {
				sendNewMove('isRotatingLeft', true);
			}
		}
		if (evt.keyCode === 83) {
			if (!allPlayers[userName].getIsMovingBackwardTank()) {
				sendNewMove('isRotatingRight', true);
			}
		}
	}
	function traiteKeyUp(evt) {
		//console.log("keyUp"+evt.keyCode);
		if (evt.keyCode === 81) {
			if (allPlayers[userName].getIsRotatingLeftTank()) {
				sendNewMove('isMovingForward', false);
			}
		}
		if (evt.keyCode === 90) {
			if (allPlayers[userName].getIsMovingForwardTank()) {
				sendNewMove('isMovingBackward', false);
			}
		}
		if (evt.keyCode === 68) {
			if (allPlayers[userName].getIsRotatingRightTank()) {
				sendNewMove('isRotatingLeft', false);
			}
		}
		if (evt.keyCode === 83) {
			if (allPlayers[userName].getIsMovingBackwardTank()) {
				sendNewMove('isRotatingRight', false);
			}
		}
	}

	function sendNewMove (newMove, state) {
		socket.emit('sendNewMove', newMove, state);
	}

	var newMove = function (name, newMovement, state) {
		return playersName[name].newMove(newMovement, state);
	};



	/**
	 * MAJ des positions de chaque tank
	 * 
	 */
	function updatePlayerTank (name, tank) {			  // SERT A client.JS
		if (userName === name) {
			console.log('name');
		}
		allPlayers[name].updateTank(tank);
	}

	/**
	 * ajout d'un nouveau missile
	 * 
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
		soundMiss.play();                                                   // TODO new missile sound
	}


	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		console.log("allPlayers" + allPlayers);
		/*for (var name in allPlayers) {
			if(allPlayers[name].tank === null) {
				allPlayers[name].tank = new Tank();
				allPlayers[name].tank.init(100, 100, 0, 'black');            // TODO couleur à virer
			}
		}*/
	}

	// TODO new player sound
	function soundPlayer () {
		soundNewPlayer.play();
	}


	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			allPlayers[name].drawTank(ctx);
		}
	}

	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			allPlayers[name].moveTank(deltaTime/1000);
		}
	}

	/**
	 * Bouge tous les missiles et supprime
	 */
	function moveAllMissiles() {
		for (var i = allMissiles.length - 1; i >= 0; i--) {
			if (!allMissiles[i].move(deltaTime/1000)) {
				allMissiles.splice(i, 1);
			}
		};
	}
	/**
	 * dessine tous les missiles
	 */
	function drawAllMissiles() {
		allMissiles.forEach(function(missile) { 
			missile.draw(ctx);
		});
	}

	/**
	 * Mesure des FPS
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
			fpsContainer.innerHTML = 'FPS: ' + fps;
		}
		frameCount++;
	};

	function showFPS() {
		fpsContainer = document.createElement('div');
		fpsContainer.setAttribute('style', 'color: red');
		document.querySelector('#game').appendChild(fpsContainer);
	}

	function manageDeltaTime() {
		var newTime = new Date().getTime();
		deltaTime = newTime - prevTime;
		prevTime = newTime;
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
		start: start,
		stop: stop,
		newMove: newMove,
		updatePlayers: updatePlayers,
		soundPlayer: soundPlayer,
		updatePlayerTank: updatePlayerTank,
		addNewMissile: addNewMissile
	};
};