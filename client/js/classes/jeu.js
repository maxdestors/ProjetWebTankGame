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

	// deltatime
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

		for (var name in allPlayers) {
			delete allPlayers[name];
		}

		for (var i = allMissiles.length - 1; i >= 0; i--) {
			killMissile(i);
		}

		// ici on set les couleur et x , y du tank qu'on passe en parame a init()
		var cptColor = 0;
		var color;
		for (var name in listOfplayers) {
			allPlayers[name] = new Player();
            soundPlayer();
			switch (cptColor) {
				case 0:
					color = '#2e6b93';
					break;
				case 1:
					color = '#56af15';
					break;
				case 2:
					color = '#ec6a11';
					break;
				case 3:
					color = '#891adc';
					break;
				default:
					color = 'grey';
					break;
				}
			allPlayers[name].init(name, listOfplayers[name], 100, 100, 0, color)
			cptColor++;
		}

		sendNewMove('isRotatingLeft', 'false');


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


		hideFPS();

		// Les écouteurs
		removeEvents();
		clearCanvas();

		console.log('game stopped');
	};

	function removeEvents () {
		canvas.removeEventListener("mousedown", traiteMouseDown);
		canvas.removeEventListener("mousemove", traiteMouseMove);
		document.removeEventListener('keydown', traiteKeyDown, false);
		document.removeEventListener('keyup', traiteKeyUp, false);
	}

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

			checkCollision();

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
		var missile = allPlayers[userName].fireTank();
        if(missile !== false) {
            soundMiss.play();
            socket.emit('sendNewMissile', missile.getMembers());
            allMissiles.push(missile);
        }
	}
	function traiteMouseMove(evt) {
		mousePos = getMousePos(canvas, evt);
		allPlayers[userName].rotateWeaponTank(mousePos.x, mousePos.y);
		sendNewMove('mousePos', {'x' : mousePos.x,
								 'y' : mousePos.y} );
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
				sendNewMove('isRotatingLeft', 'true');
				// appliquer les moves ici a chaque fois pour plus de fluidité
			}
		}
		if (evt.keyCode === 90) {
			if (!allPlayers[userName].getIsMovingForwardTank()) {
				sendNewMove('isMovingForward', 'true');
			}
		}
		if (evt.keyCode === 68) {
			if (!allPlayers[userName].getIsRotatingRightTank()) {
				sendNewMove('isRotatingRight', 'true');
			}
		}
		if (evt.keyCode === 83) {
			if (!allPlayers[userName].getIsMovingBackwardTank()) {
				sendNewMove('isMovingBackward', 'true');
			}
		}
	}
	function traiteKeyUp(evt) {
		//console.log("keyUp"+evt.keyCode);
		if (evt.keyCode === 81) {
			if (allPlayers[userName].getIsRotatingLeftTank()) {
				sendNewMove('isRotatingLeft', 'false');
			}
		}
		if (evt.keyCode === 90) {
			if (allPlayers[userName].getIsMovingForwardTank()) {
				sendNewMove('isMovingForward', 'false');
			}
		}
		if (evt.keyCode === 68) {
			if (allPlayers[userName].getIsRotatingRightTank()) {
				sendNewMove('isRotatingRight', 'false');
			}
		}
		if (evt.keyCode === 83) {
			if (allPlayers[userName].getIsMovingBackwardTank()) {
				sendNewMove('isMovingBackward', 'false');
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
	 */
	function updatePlayerTank (name, tank) {			  // sert a client.JS
		allPlayers[name].updateTank(tank);
	}

	/**
	 * ajout d'un nouveau missile
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
		soundMiss.play();
	}

	function checkCollision() {
		var xyTank;
		var xyrMissile;
		for (var name in allPlayers) {
			if (!allPlayers[name].isTankDestroyed()) {

				for (var i = allMissiles.length - 1; i >= 0; i--) {
					
					xyTank = allPlayers[name].getXYTank();
					xyrMissile = allMissiles[i].getXYR();

					if (circRectsOverlap(xyTank.x-xyTank.w/2, xyTank.y-xyTank.h/2, xyTank.w, xyTank.h, xyrMissile.x, xyrMissile.y, xyrMissile.r) ) {
						//faire la vie du tank
						allPlayers[name].hitTank()
						if (allPlayers[name].isTankDestroyed()) {
							if (name === userName) {
								removeEvents();
								// dans clear canvas ajouter un "voile" (fond noir avec transparence) sur le canvas
								// if (allPlayers[userName].isTankDestroyed()) {
							}
							afterDeath();
						}
						killMissile(i);
					}
				}
			}
			
		}
	}

	function afterDeath () {
		// does it left more than 1 player alive
		var cptStillAlive = 0;
		var winnerName;
		for (var name in allPlayers) {
			if (!allPlayers[name].isTankDestroyed()) {
				cptStillAlive++;
				winnerName = name;
			}
		}
		if (cptStillAlive == 1) {
			console.log('Winner : ' + winnerName);
			alert('Winner : ' + winnerName);
			//send winnerName
			if (winnerName === userName) {
				socket.emit('imTheWinner');
			}
			stop();
			document.querySelector("#startGameBtn").disabled = false;
			//send stop
		}
		else if(cptStillAlive < 1) {
			// send no winner
			console.log('No Winner');
			alert('No Winner');
			stop();
			document.querySelector("#startGameBtn").disabled = false;
		}
	}

	// Teste collisions entre cercles
	function circleCollide(x1, y1, r1, x2, y2, r2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));  
	}
	// Collisions between rectangle
	function rectsOverlap(x0, y0, w0, h0, x2, y2, w2, h2) {
		if ((x0 > (x2 + w2)) || ((x0 + w0) < x2))
		    return false;

		if ((y0 > (y2 + h2)) || ((y0 + h0) < y2))
		    return false;
		return true;
	}
	// Collisions between rectangle and circle
	function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
		var testX=cx; 
		var testY=cy; 

		if (testX < x0) testX=x0; 
		if (testX > (x0+w0)) testX=(x0+w0); 
		if (testY < y0) testY=y0; 
		if (testY > (y0+h0)) testY=(y0+h0); 

		return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))<r*r); 
	}


	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
	}

    /**
     * Son pour nouveau joueur
     */
	function soundPlayer () {
		soundNewPlayer.play();
	}

	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			if (!allPlayers[name].isTankDestroyed()) {
				allPlayers[name].drawTank(ctx, name);
			}
		}
	}

	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			if (!allPlayers[name].isTankDestroyed()) {
				allPlayers[name].moveTank(deltaTime/1000);
			}
		}
	}

	/**
	 * Bouge tous les missiles et supprime
	 */
	function moveAllMissiles() {
		for (var i = allMissiles.length - 1; i >= 0; i--) {
			if (!allMissiles[i].move(deltaTime/1000)) {
				killMissile(i);
			}
		};
	}

	var killMissile = function(i) {
		allMissiles.splice(i, 1);
	}

	/**
	 * Dessine tous les missiles
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

    /**
     * Affichage des FPS
     */
	function showFPS() {
		fpsContainer = document.createElement('div');
		document.querySelector('#fpsSpan').appendChild(fpsContainer);
	}

	function hideFPS() {
		document.querySelector('#fpsSpan').innerHTML = '';
	}

    /**
     * Gestion delta time
     */
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
		addNewMissile: addNewMissile,
		killMissile: killMissile
	};
};