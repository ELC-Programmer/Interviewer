/**
 * A view that presents a single video message, then prompts the user to continue.
 * @class
 * @extends StackView
 * @param {Object.<string, *>} options - An object of keyed options for initializing the view.
 */
var VideoMessageView = function(options) {
	StackView.call(this, options);
}
extend(StackView, VideoMessageView);

/**
 * @property {Object.<string, *>} options - An object of keyed options for the view. Which keys have meaning must be specified individually by subclasses.
 * @property {string} options.videoURL - The URL of the video to play.
 * @property {boolean} [options.canSkip=false] - If true, the user can continue before the video finishes.
 * @property {string} [options.continuePrompt="Continue"] - The prompt to display to the user when the video ends.
 * @property {StackView} [options.nextView=false] - The view to push when the user chooses to continue. If false, the view pops on continue.
 * @override
 */
VideoMessageView.prototype.options = {
	videoURL: undefined,
	canSkip: false,
	continuePrompt: "Continue",
	nextView: false
};

/**
 * @property {(boolean|string)} HTMLSource - The HTML source for this view.
 * @override
 */
VideoMessageView.prototype.HTMLSource = <?php StackViewSource() ?>;

/**
 * This function is called when the view is first shown.
 * @override
 */
VideoMessageView.prototype.onAddToApplication = function()
{
	let scope = this;
	
	this.DOMObject.find(".video").text(this.options.videoURL); // TODO
	
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
