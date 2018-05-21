/**
 * A view that presents a list of interviewees for the user to choose from.
 * @class
 * @extends StackView
 * @param {Object.<string, *>} options - An object of keyed options for initializing the view.
 */
var IntervieweeSelectionView = function(options) {
	StackView.call(this, options);
}
extend(StackView, IntervieweeSelectionView);

/**
 * An interviewee, including their static properties and dynamic state.
 * @typedef {Object} Interviewee
 * @property {string} name - The interviewee's name, as displayed to the user.
 * @property {string} title - The interviewee's title, as displayed to the user.
 * @property {string} profileImage - The relative path to the interviewee's profile image.
 * @property {string} videoDirectory - The relative path of the directory in which to look for the response videos.
 * @property {Object[]} questions - The questions the interviewee can be asked.
 * @property {string} questions[].prompt - The question itself.
 * @property {string} questions[].responseVideo - The relative path to the video of the interviewee's response, relative to videoDirectory.
 * @property {boolean} questions[].active - If false, this question can no longer be asked. If undefined, true is assumed.
 * @property {number} timeRemaining - The time remaining for this interview, in seconds. This value is not set initially for each interviewee. It is used dynamically during the application's execution.
 * @property {boolean} active - If false, this interviewee can no longer be interviewed. If undefined, true is assumed.
 */

/**
 * @property {Object.<string, *>} options - An object of keyed options for the view. Which keys have meaning must be specified individually by subclasses.
 * @property {Interviewee[]} options.interviewees - The interviewees. All the most important data is here.
 * @property {number} [options.interviewTimeLimit=300] - The time limit for an interview, in seconds.
 * @property {function(new:InterviewView, Object.<string, *>)} [options.interviewViewType=InterviewView] - The type of InterviewView to use. Must inherit from InterviewView.
 * @property {Object.<string, *>} [options.interviewViewOptions={}] - The options with which to initialize InterviewViews. 'interviewee' will be set automatically.
 * @override
 */
IntervieweeSelectionView.prototype.options = {
	interviewees: undefined,
	interviewTimeLimit: 300,
	interviewViewType: InterviewView,
	interviewViewOptions: {}
};

/**
 * @property {(boolean|string)} HTMLSource - The HTML source for this view.
 * @override
 */
IntervieweeSelectionView.prototype.HTMLSource = <?php StackViewSource() ?>;

/**
 * This function is called when the view is first shown.
 * @override
 */
IntervieweeSelectionView.prototype.onAddToApplication = function()
{	
	let scope = this;

	let pt = this.DOMObject.find(".interviewee-prototype");

	// Setup the click handler
	pt.find(".button").click(function() {
		let id = $(this).parents(".interviewee").attr("interviewee-id");
		let interviewee = scope.options.interviewees[id];
		
		if (interviewee.active !== false)
		{
			let options = Object.assign({ interviewee: scope.options.interviewees[id] }, scope.options.interviewViewOptions);
			
			// Create and push an InterviewView
			let interviewView = Object.create(scope.options.interviewViewType.prototype);
			scope.options.interviewViewType.call(interviewView, options);
			scope.application.push(interviewView);
		}
	});
	
	// Make empty copies of the prototype
	for (let i in this.options.interviewees)
	{
		let interviewee = this.options.interviewees[i];
		
		let obj = pt.clone(true)
					.removeClass("interviewee-prototype")
					.addClass("interviewee")
					.attr("interviewee-id", i);
		obj.appendTo(pt.parent());
	}
	
	// Hide the prototype
	pt.hide();
	
	// Initialize the interviewees object
	for (let i in this.options.interviewees)
	{
		let interviewee = this.options.interviewees[i];
		
		// Set interview time limit
		if (interviewee.timeRemaining === undefined)
		{
			interviewee.timeRemaining = this.options.interviewTimeLimit;
		}
	}
}

/**
 * This function is called whenever the view was previously not shown, but now is shown.
 * @override
 */
IntervieweeSelectionView.prototype.onShow = function()
{
	let scope = this;
	
	this.DOMObject.find(".interviewee").each(function() {
		let id = $(this).attr("interviewee-id");
		let interviewee = scope.options.interviewees[id];
		
		$(this).find(".name").text(interviewee.name);
		$(this).find(".title").text(interviewee.title);
		$(this).find(".image").attr("src", interviewee.profileImage);
		$(this).find(".time").text(formatTime(interviewee.timeRemaining));
		
		$(this).toggleClass("inactive", interviewee.active === false);
	});
}

/**
 * This function is called (before onShow) when this view is popped back to.
 * @param {*} returnValue - A value of any type that was passed to the pop function of the StackApplication.
 * @override
 */
IntervieweeSelectionView.prototype.onPopTo = function()
{
	// TODO
	// onPopTo:
	// update the particular interviewees JSON description with the returned JSON description
}
