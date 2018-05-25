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
	$("#app-title").html(this.palette.title);

	//application container
	$("#application").css("background-color",this.palette.foreground);

}