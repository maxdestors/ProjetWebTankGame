/**
 * Created by Romain on 18/02/2015.
 */

var Jeu = function()
{
	var canvas, ctx, w, h;

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

    // sprites
    var frame = 0;

	/**
	 *  INITIALISATION
	 */
	var init = function (newuserName)
	{
		console.log("initialisation ok");
		userName = newuserName;
		//tmp
		//tank = new Tank();
		//tank.init();

		// Le canvas
		canvas = document.querySelector("#tankCanvas");
		w = canvas.width;
		h = canvas.height;
		ctx = canvas.getContext('2d');

        // charge les sons
        soundMiss = new Audio("sound/missile.wav");
        soundNewPlayer = new Audio("sound/welcome.wav");

		// affiche FPS pour debug
		showFPS();

		// Les écouteurs
        canvas.addEventListener("mousedown", traiteMouseDown);
        canvas.addEventListener("mousemove", traiteMouseMove);
        document.addEventListener('keydown', traiteKeyDown, false);
        document.addEventListener('keyup', traiteKeyUp, false);

		prevTime = new Date().getTime();
		requestAnimationFrame(mainLoop);
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
        frame++;
        if (frame >= 8) {
            frame = 0;
        }
		requestAnimationFrame(mainLoop);
	}

	/**
	 * Traitement souris
	 * @param evt
	 */
	function traiteMouseDown(evt) {
        soundMiss.play();                                                   // TODO new missile sound
        var missile = allPlayers[userName].tank.fire();
		socket.emit('sendNewMissile', missile.getMembers());
        allMissiles.push(missile);
        //console.log("mousedown");
    }
	function traiteMouseMove(evt) {
		mousePos = getMousePos(canvas, evt);
		allPlayers[userName].tank.rotateWeapon(mousePos.x, mousePos.y);
		sendUpdateUserTank();
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
        //
        //
        //
        //
		if (evt.keyCode === 81) {
			if (!allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsRotatingLeft(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 90) {
			if (!allPlayers[userName].tank.getIsMovingForward()) {
				allPlayers[userName].tank.setIsMovingForward(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 68) {
			if (!allPlayers[userName].tank.getIsRotatingRight()) {
				allPlayers[userName].tank.setIsRotatingRight(true);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 83) {
			if (!allPlayers[userName].tank.getIsMovingBackward()) {
				allPlayers[userName].tank.setIsMovingBackward(true);
				sendUpdateUserTank();
			}
		}
	}
	function traiteKeyUp(evt) {
		//console.log("keyUp"+evt.keyCode);
		if (evt.keyCode === 81) {
			if (allPlayers[userName].tank.getIsRotatingLeft()) {
				allPlayers[userName].tank.setIsRotatingLeft(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 90) {
			if (allPlayers[userName].tank.getIsMovingForward()) {
				allPlayers[userName].tank.setIsMovingForward(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 68) {
			if (allPlayers[userName].tank.getIsRotatingRight()) {
				allPlayers[userName].tank.setIsRotatingRight(false);
				sendUpdateUserTank();
			}
		}
		if (evt.keyCode === 83) {
			if (allPlayers[userName].tank.getIsMovingBackward()) {
				allPlayers[userName].tank.setIsMovingBackward(false);
				sendUpdateUserTank();
			}
		}
	}

	function sendUpdateUserTank () {
		socket.emit('sendUpdateUserTank', allPlayers[userName].tank.getMembers());
	}


	/**
	 * MAJ des positions de chaque tank
	 * 
	 */
	function updatePlayerTank (name, tank) {			  // SERT A client.JS
		if (userName == name) {
			console.log('name');
		}
		allPlayers[name].tank.updateTank(tank);
	};

	/**
	 * ajout d'un nouveau missile
	 * 
	 */
	function addNewMissile (newMissile) {
		var miss = new Missile();
		miss.updateMissile(newMissile);
		allMissiles.push(miss);
        soundMiss.play();                                                   // TODO new missile sound
	};

	/**
	 * MAJ du tableau des joueurs (connexion et deconnexion)
	 * @param listOfPlayers
	 */
	function updatePlayers (listOfPlayers) {
		allPlayers = listOfPlayers;
		for (var name in allPlayers) {
			if(allPlayers[name].tank == null) {
				allPlayers[name].tank = new Tank();
				allPlayers[name].tank.init(100, 100, 0, 'black');
			}
		}
	};

    // TODO new player sound
    function soundPlayer () {
        soundNewPlayer.play();
    }

	/**
	 * Dessine le tank du joueur
	 * @param tank
	 */
	function drawTank(userTank) {
		userTank.tank.draw(ctx, frame);
    }

	/**
	 * Dessine tous les joueurs
	 */
	function drawAllPlayers() {
		for (var name in allPlayers) {
			drawTank(allPlayers[name]);
		}
	}

	/**
	 * bouge le tank du joueur
	 * @param tank
	 */
	function moveTank(userTank) {
        userTank.tank.move(deltaTime/1000);
	}

	/**
	 * Bouge tous les joueurs
	 */
	function moveAllPlayers() {
		for (var name in allPlayers) {
			moveTank(allPlayers[name]);
		}
	}

	/**
	 * Bouge tous les missiles
	 */
	function moveAllMissiles() {
		allMissiles.forEach(function(missile) { 
			missile.move(deltaTime/1000);
		});
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
		diffTime = newTime - lastTime;
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
		updatePlayers: updatePlayers,
        soundPlayer: soundPlayer,
		updatePlayerTank: updatePlayerTank,
		addNewMissile: addNewMissile
	};
};