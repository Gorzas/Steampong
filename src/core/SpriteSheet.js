/**
 * SpriteSheet
 * 
 * It handles the spritesheet of the game, creating the new sprites and
 * retrieveng theirs data if they are needed.
 * 
 * @class SpriteSheet
 * @constructor
 */
SpriteSheet = Class.extend({
    /**
     * Base image where the class is going to retrieve every sprite
     * of the game
     * 
     * @property img
     * @type Image
     */
    img: null,
    /**
     * Collection of sprites with the JSON data of the textures.
     * 
     * @property sprites
     * @type Array
     */
    sprites:[],
    /**
     * Cretes new SpriteSheet
     * 
     * @method init
     */
    init: function() {
        
    },
    /**
     * Loads a JSON file with the sprite image data. 
     * 
     * @method load
     * @param {File} jsonFile Has the data of the image project
     * @param {Function} callback Callback function to be called when the JSON file
     * is loaded
     */        
    load: function(jsonFile, callback) {
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", jsonFile, true);
        
        xhr.onload = function() {
            var parsedJSON;
            
            try {
                parsedJSON = JSON.parse(this.responseText);
            } catch(e) {
                alert("Spritesheet JSON file it's not in this directory");
            }
            
            gSpriteSheet.parseSprites(parsedJSON, callback);
        };
        
        xhr.send();        
        
    },
    /**
     * Reads parsed JSON and creates a colletion with all the posibilities
     * needed
     * 
     * @method parseSprites
     * @param {Object} parsed Parsed JSON
     * @param {function} callback Function to be called when all it's loaded
     * 
     */        
    parseSprites: function(parsed, callback) {
        var imageLoaded = false,    // image with the spritesheet map
            spritesLoaded = false,  // sprites added to the class
            img = new Image();
            
        img.onload = function() {
            imageLoaded = true;
            
            if (spritesLoaded) {
                callback();
            }
        };
        img.src = parsed.meta.image;   
        this.img = img; 
        
        for (var key in parsed.frames) {
            var elem = parsed.frames[key],
                sprite = {
                    x: elem.frame.x,
                    y: elem.frame.y,
                    w: elem.frame.w,
                    h: elem.frame.h,
                    cx: -elem.frame.w * 0.5,
                    cy: -elem.frame.h * 0.5
                };
                
            if (elem.trimmed) {
                sprite.cx = elem.spriteSourceSize.x - (elem.sourceSize.w * 0.5);
                sprite.cy = elem.spriteSourceSize.y - (elem.sourceSize.h * 0.5);
            }
            
            gSpriteSheet.sprites[key] = sprite;            
        }
        
        spritesLoaded = true;
        if (imageLoaded) {
            callback();
        }

    }
});

var gSpriteSheet = new SpriteSheet();