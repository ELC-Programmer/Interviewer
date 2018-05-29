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
	this.miscellaneousStuff();
 }
 Styling.prototype.miscellaneousStuff = function()
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
 	"text":undefined
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