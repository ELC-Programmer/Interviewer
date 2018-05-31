/**
 * Provides initial styling to body
 * @class
 * @param {Object.<string, *> palette - a palette of colors for different elements of the site }
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

 Styling.prototype.miscellaneous = function()
 {
 	$("#brand").click(function() {
 			window.location.href = "https://www.marshall.usc.edu/programs/experiential-learning-center";
 		});
 }

 Styling.prototype.palette = 
 {
 	"title":undefined,
 	"background":undefined,
 	"foreground":undefined,
 	"text":undefined,
 }

Styling.prototype.apply = function()
{

	//body
	$("body").css("background-color",this.palette.background);

	//title
	$("#app-title").html("<a style='text-decoration: none; color:white' href='.'>"+
								this.palette.title
								+"</a>");

 	// $("#app-title").click(function() {
 	// 		window.location.reload();
 	// 	});
	//application container
	$("#application").css("background-color",this.palette.foreground);

}

Styling.prototype.transition = function(clickedButton, callback, transition){
	if(transition == "cover"){
		//make copy of clicked button 
		let offsetTop = $(clickedButton).offset().top;
		let offsetLeft = $(clickedButton).offset().left;
		let newButton = $(clickedButton).clone();
		newButton.css("margin",0).css("position","fixed").css("top",offsetTop).css("left",offsetLeft);
		newButton.html();
		//prepend to dom 
		$("#application").prepend(newButton);
		$(newButton).attr("value","");
		//enlarge dimensions of button to cover screen somehow unequally based on current position
		$(newButton).animate({width:"100vw", height:"100vh", top:0, left:0}, 500, function(){
			callback();
			//transition button size to zero 
			$(this).animate({width:0, height:0, padding:0, top:offsetTop, left:offsetLeft}, 500, function(){
				$(this).remove(); //remove from dom
			});
		});
	}
	else if(transition == "slideRight"){

	}
	else if(transition == "slideLeft"){

	}
}