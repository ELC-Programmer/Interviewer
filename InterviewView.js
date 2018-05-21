/**
 * A view where the user conducts a virtual interview.
 * @class
 * @extends StackView
 * @param {Object.<string, *>} options - An object of keyed options for initializing the view.
 */
function InterviewView(options) {
	StackView.call(this, options);
}
extend(StackView, InterviewView);

/**
 * @property {Object.<string, *>} options - An object of keyed options for the view. Which keys have meaning must be specified individually by subclasses.
 * @property {Interviewee} options.interviewee - The interviewee.
 * @override
 */
InterviewView.prototype.options = {
	interviewee: undefined
};

/**
 * @property {(boolean|string)} HTMLSource - The HTML source for this view.
 * @override
 */
InterviewView.prototype.HTMLSource = <?php StackViewSource() ?>;

/**
 * This function is called when the view is first shown.
 * @override
 */
InterviewView.prototype.onAddToApplication = function()
{
	let scope = this;
	let interviewee = this.options.interviewee;

	let pt = this.DOMObject.find(".question-prototype");

	// Setup the question click handler
	pt.find(".question-button").click(function() {
		let id = $(this).parents(".question").attr("question-id");
		let question = interviewee.questions[id];
		
		if (question.active !== false)
		{
			question.active = false; // TODO: visualize this
			
			// Play the response video
			scope.DOMObject.find(".video").text(interviewee.videoDirectory + question.responseVideo); // TODO
			
			// TODO: start the clock, if necessary
		}
	});
	
	// Make empty copies of the prototype
	for (let i in interviewee.questions)
	{
		let question = interviewee.questions[i];
		
		let obj = pt.clone(true)
					.removeClass("question-prototype")
					.addClass("question")
					.attr("question-id", i);
		obj.appendTo(pt.parent());
	}
	
	// Hide the prototype
	pt.hide();
	
	// Back Button
	this.DOMObject.find(".back").click(function() {
		scope.application.pop(interviewee);
	});
}

/**
 * This function is called whenever the view was previously not shown, but now is shown.
 * @override
 */
InterviewView.prototype.onShow = function()
{
	let scope = this;
	let interviewee = this.options.interviewee;
	
	// Header
	this.DOMObject.find(".name").text(interviewee.name);
	this.DOMObject.find(".title").text(interviewee.title);
	
	// Questions
	this.DOMObject.find(".question").each(function() {
		let id = $(this).attr("question-id");
		let question = interviewee.questions[id];
		
		$(this).find(".question-prompt").text(question.prompt);
		
		// TODO?
		$(this).toggleClass("inactive", question.active === false);
	});
	
	// Clock
	// TODO
	this.updateTimeRemaining();
}

/**
 * Update the time remaining that is displayed to the user, as well as the time's up display.
 */
InterviewView.prototype.updateTimeRemaining = function()
{
	this.DOMObject.find(".time").text(formatTime(this.options.interviewee.timeRemaining));
	
	// TODO: Time's up!
}

/**
 * @property {number} clockID - The interval ID of the clock running every second, or false if the clock is not running.
 */
InterviewView.prototype.clockID = false;

/**
 * Start the clock.
 */
InterviewView.prototype.startClock = function()
{
	if (this.clockID === false)
	{
		this.clockID = setInterval(this.tickClock, 1000);
	}
}

/**
 * Tick the clock forward by one second.
 */
InterviewView.prototype.tickClock = function()
{
	if (this.options.interviewee.timeRemaining > 0)
	{
		this.options.interviewee.timeRemaining -= 1;
	}
	else
	{ // stop the clock
		this.stopClock();
		// TODO: set time's up!
	}
	
	this.updateTimeRemaining();
}

/**
 * Stop the clock.
 */
InterviewView.prototype.stopClock = function()
{
	if (this.clockID !== false)
	{
		clearInterval(this.clockID);
		this.clockID = false;
	}
}
