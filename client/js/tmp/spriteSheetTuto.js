window.onload = function() {
    var tank;
    var tankImage;
    var canvas;

    function gameLoop ()
    {
        window.requestAnimationFrame(gameLoop);
        tank.update();
        tank.render();
    }

    function drawSprite (obj)
    {
        var spriteObj = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = obj.ticksPerFrame || 0,
            numberOfFrames = obj.numberOfFrames || 1;

        spriteObj.context = obj.context;
        spriteObj.width = obj.width;
        spriteObj.height = obj.height;
        spriteObj.image = obj.image;

        spriteObj.update = function ()
        {
            tickCount += 1;
            if (tickCount > ticksPerFrame)
            {
                tickCount = 0;
                if (frameIndex < numberOfFrames - 1) {  // on check l'indice de l'img actuelle
                    frameIndex += 1;                    // frame suivante
                } else {
                    frameIndex = 0;
                }
            }
        };

        spriteObj.render = function ()
        {
            spriteObj.context.clearRect(0, 0, spriteObj.width, spriteObj.height);    // nettoie le canvas
            spriteObj.context.drawImage(                                   // dessine l'animation
                spriteObj.image,
                frameIndex * spriteObj.width / numberOfFrames,
                0,
                spriteObj.width / numberOfFrames,
                spriteObj.height,
                0,
                0,
                spriteObj.width / numberOfFrames,
                spriteObj.height);
        };

        return spriteObj;
    }

    // Get canvas
    canvas = document.querySelector("#mycanvasbis");
    var ctx = canvas.getContext('2d');

    // Create sprite sheet
    tankImage = new Image();

    // Create sprite
    tank = drawSprite({
        context: ctx,
        width: 232,
        height: 24,
        image: tankImage,
        numberOfFrames: 8,
        ticksPerFrame: 4
    });

    // Load sprite sheet
    tankImage.addEventListener("load", gameLoop);
    tankImage.src = "img/green_tank.png";
};

