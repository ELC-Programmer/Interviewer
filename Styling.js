/**
 * 
 * @class
 * @param {Object.<string, *> palette - options for customizing different elements of the site }
 **/
 var Styling = function(palette)
 {
 	for (let key in palette)
 	{
 		this.palette[key] = palette[key]
 	}
 	for (let key in this.palette)
	{
		if (this.palette[key] === undefined)
		{
			console.log("Missing required parameter: " + key);
		}
	}
	this.miscellaneous();
 }

/**
 * Perform miscalleneous styling:
 * 	1. Set location on brand icon on top left
 **/
 Styling.prototype.miscellaneous = function()
 {
 	$("#brand").click(function() {
 			window.location.href = "https://www.marshall.usc.edu/programs/experiential-learning-center";
 		});
 }

/**
 * @typedef {Object} Styling~Palette
 * @property {string} palette.title - the title of the application
 * @property {string} palette.background - the background color of the application
 * @property {string} palette.foreground - the foreground color of the application
 * @property {string} palette.text - the standard text color
 **/
 /**
 * @property {Styling~Palette} palette - An object of keyed options for the class.
 */
 Styling.prototype.palette = 
 {
 	"title":undefined,
 	"background":undefined,
 	"foreground":undefined,
 	"text":undefined,
 }

/**
 * Provides initial styling to body
 **/
Styling.prototype.apply = function()
{
	//body
	$("body").css("background-color",this.palette.background);
	//title
	$("#app-title").html("<a style='text-decoration: none; color:white' href='.'>"+this.palette.title+"</a>");
	//application container
	$("#application").css("background-color",this.palette.foreground);

}

/**
 * Provides aesthetic transitions
 * @param {DOM object or array} the DOM object(s) to design the transition effect around
 * @param {function} a callback function to execute once the effect is done
 * @param {string} the transition to use 
 **/
Styling.prototype.transition = function(target, callback, transition){
	if(transition == "cover"){
		let offsetTop = $(target).offset().top;
		let offsetLeft = $(target).offset().left;
		let targetCopy = $(target).clone(); //make copy of clicked button 
		targetCopy.css("margin",0).css("position","fixed").css("top",offsetTop).css("left",offsetLeft);
		targetCopy.html();
		targetCopy.empty();
		//prepend to dom 
		$("#application").prepend(targetCopy);
		$(targetCopy).attr("value","");
		//enlarge dimensions of button to cover screen based on current position
		$(targetCopy).animate({width:"100vw", height:"100vh", top:0, left:0}, 500, function(){
			if(callback) callback();
			$(this).animate({width:0, height:0, padding:0, top:offsetTop, left:offsetLeft}, 500, function(){
				$(this).remove(); //remove from dom <- remove this into a callback 
			});
		});
	}
	else if(transition == "slideLeft" || transition == "slideRight"){
		// animate both divs at the same time by setting queue value to false 
		direction = .95;
		if(transition == "slideLeft") direction *= -1;
		duration = 750;
		$(target[0]).animate({left:direction*$(window).width()}, {duration:duration, queue:false, complete: function(){
				$(target[0]).css("left", "0");
				if(callback) callback();
				$(target[1]).hide().fadeIn();
			}
		});
	}
}

/**
 * Allows user to check if a file exists. If it exists, successCallback is executed, else errorCallback is executed. 
 * @param {string} the url of the file
 * @param {function} callback to execute if file does not exist
 * @param {function} callback to execute if file does exist
 **/
Styling.prototype.checkIfFileExists = function(url, errorCallback, successCallback){
	$.ajax({
	    type: 'HEAD',
	    url: url,
	    success: function(){
	    	if(successCallback) 
	    		successCallback();
	    },
	    error: function() {
	    	if(errorCallback)
	    		errorCallback();
	    }
	});
}