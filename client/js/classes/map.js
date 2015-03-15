/**
 * Created by Romain on 11/03/2015.
 */

var Map = function ()
{
    var ctx;

    var init = function (newctx) {
        ctx = newctx;
    };

    function draw() {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(200, 200, 100, 200);
        ctx.restore();
    }

    return {
        init: init,
        draw: draw
    }
};