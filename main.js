/*!
 *
 *   melonJS
 *   http://www.melonjs.org
 *
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
    name: "area01_level_tiles",
    type: "image",
    src: "data/area01_tileset/area01_level_tiles.png"
}, {
    name: "area01",
    type: "tmx",
    src: "data/area01.tmx"
}, {
    name: "gripe_run_right",
    type: "image",
    src: "data/sprite/gripe_run_right.png"
}];


var jsApp	=
{
	/* ---

		Initialize the jsApp

		---			*/
	onload: function()
	{

		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}

		// initialize the "audio"
		me.audio.init("mp3,ogg");

		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);

		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},


	/* ---

		callback when everything is loaded

		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

        me.entityPool.add("mainPlayer", PlayerEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X, "jump", true);
        me.debug.renderHitBox = true;

      // start the game
		me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{
      // stuff to reset on state change
      me.levelDirector.loadLevel("area01")
	},


	/* ---

		 action to perform when game is finished (state change)

		---	*/
	onDestroyEvent: function()
	{

   }

});


/* a player entity */
var PlayerEntity = me.ObjectEntity.extend({
    //constructor
    init : function(x, y, settings){
        this.parent(x,y,settings);

        this.setVelocity(3, 3);
        this.falling = false;

        // disable gravity
        this.gravity = 0;

        this.updateColRect(8, 48, -1, 0);

        //me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH)
    },

    update :  function(){
        if(me.input.isKeyPressed('left')){
            this.flipX(true);
            this.vel.x -= this.accel.x * me.timer.tick;
        }else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;

        }else if (me.input.isKeyPressed('up')) {
            // unflip the sprite
            //this.flipX(false);

            // update the entity velocity
            this.vel.y -= this.accel.y * me.timer.tick;
        }else if (me.input.isKeyPressed('down')) {

            // unflip the sprite
            //this.flipX(false);
            // update the entity velocity
            this.vel.y += this.accel.y * me.timer.tick;
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }


        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;


    }
});

//bootstrap :)
window.onReady(function()
{
	jsApp.onload();
});
