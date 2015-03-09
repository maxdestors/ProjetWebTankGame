window.onload = function() {
    var canvas = null;
    var img = null;
    var ctx = null;
    var frame = 0;

    var frameCount = 0;
    var lastTime;
    var fps;


    function init() {
        canvas = document.querySelector('#mycanvas');
        ctx = canvas.getContext('2d');
        img = new Image();
        img.src = 'img/green_tank.png';
        requestAnimationFrame(mainLoop);     // setTimeout(mainLoop, 1000 / 15);
    }

    function mainLoop(time)
    {
        measureFPS(time);
        redraw();
        frame++;
        if (frame >= 8) {
            frame = 0;
        }
        requestAnimationFrame(mainLoop);    // setTimeout(mainLoop, 1000 / 15);
    }

    // REDRAW RIGHT SPRITE
    function redraw() {
        ctx.drawImage(
            img,
            frame * 29,                  // coordonnée x de départ
            0,                           // coordonnée y de départ
            29,                          // largeur du morceau d'image
            24,                          // hauteur du morceau d'image
            canvas.width / 2 - 14,       // x pos par rapport au canvas
            canvas.height / 2 - 14,      // y pos par rapport au canvas
            29,                          // largeur du morceau d'image
            24);                         // hauteur du morceau d'image
    }

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
        frameCount++;
    };

    init();
};