/**
 * A view that presents a single video message, then prompts the user to continue.
 * @class
 * @extends StackView
 * @param {VideoMessageView~Options} options - An object of keyed options for initializing the view.
 */
var VideoMessageView = function(options) {
	StackView.call(this, options);
}
extend(StackView, VideoMessageView);

/**
 * @typedef {Object} VideoMessageView~Options
 * @property {string} options.videoURL - The URL of the video to play.
 * @property {boolean} [options.canSkip=false] - If true, the user can continue before the video finishes.
 * @property {string} [options.continuePrompt="Continue"] - The prompt to display to the user when the video ends.
 * @property {StackView} [options.nextView=false] - The view to push when the user chooses to continue. If false, the view pops on continue.
 */
/**
 * @property {VideoMessageView~Options} options - An object of keyed options for the view.
 */
VideoMessageView.prototype.options = {
	videoURL: undefined,
	canSkip: false,
	continuePrompt: "Continue",
	nextView: false,
	autoplay: false
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
VideoMessageView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
VideoMessageView.prototype.onAddToApplication = function()
{
	let scope = this;
	
	// this.DOMObject.find(".video").text(this.options.videoURL); // TODO
	this.DOMObject.find(".video-element").html('<source src="'+this.options.videoURL+'" type="video/mp4"></source>');
	if(this.options.autoplay)
	{
		this.DOMObject.find(".video-element").attr("autoplay","autoplay");
	}
	
	this.DOMObject.find(".continue")
		.attr("value", this.options.continuePrompt)
		.click(function() {
			if (scope.options.nextView)
			{
				scope.application.push(scope.options.nextView);
			}
			else
			{
				scope.application.pop();
			}
		});
}
