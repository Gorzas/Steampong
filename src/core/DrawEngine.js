/**
 * DrawEngine
 * 
 * Has three main tasks:
 *      -. update the canvas clearing it first
 *      -. allow to draw images in the canvas
 *      -. allow to draw text and customing it as you wish
 * 
 * @tclass DrawEngine
 * @constructor
 */
DrawEngine = Class.extend({
    /**
     * Context of the canvas. Need in order to draw any image in the canvas
     * 
     * @property ctx
     * @type CanvasRenderingContext2D
     */
    ctx: null,    
    /**
     * Default font for the text written in the Canvas.
     * 
     * @property font
     * @type Object
     */
    font: {
        align: 'center',
        size: '40px',
        style: 'bold',
        family: 'Helvetica, Arial, sans-serif'
    },
    /**
     * Constructor of a new DrawEngine.
     * 
     * @method init
     * @param {CanvasRenderingContext2D} ctx Allows to draw in the canvas.
     */
    init: function(ctx) {
        this.ctx = ctx;
    },
    /**
     * Actually, draws an image in the canvas.
     * 
     * @method drawImage
     * @param {String} Name of the sprite
     * @param {int|float} position x in the canvas
     * @param {int|float} position y in the canvas
     * @param {int} width of the destination image
     * @param {int} height of the destination image
     * 
     */
    drawImage: function(sprite, x, y, w, h) {
        this.ctx.drawImage(
                gSpriteSheet.img, 
                gSpriteSheet.sprites[sprite].x, 
                gSpriteSheet.sprites[sprite].y, 
                gSpriteSheet.sprites[sprite].w, 
                gSpriteSheet.sprites[sprite].h, 
                Math.floor(x - (w >> 1)), 
                Math.floor(y - (h >> 1)), 
                w, 
                h
        );
    }, 
    /**
     * Draws any text in a position in the canvas.
     * 
     * @method drawText
     * @param {int|float} x Position x in the canvas
     * @param {int|float} y Position y in the canvas
     * @param {String} text Text to write in the canvas
     * @param {String} textFont Font-family of the new text
     *      
     */
    drawText: function(x, y, text, textFont) {
        var font = this.font;

        // if user prefers another scheme different than default
        if (textFont) {
            font = textFont;
        }

        this.ctx.textAlign = font.align;
        this.ctx.font = font.style + ' ' + font.size + ' ' + font.family;
        this.ctx.fillStyle = "";
        this.ctx.fillText(text, x, y);
    },
    /**
     * Clears the canvas
     * 
     * @method clear
     */        
    clear: function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
});