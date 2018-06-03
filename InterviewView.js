/**
 * A view where the user conducts a virtual interview.
 * @class
 * @extends StackView
 * @param {InterviewView~Options} options - An object of keyed options for initializing the view.
 */
function InterviewView(options) {
	StackView.call(this, options);
}
extend(StackView, InterviewView);
 
/**
 * @typedef {Object} InterviewView~Options
 * @property {Interviewee} options.interviewee - The interviewee.
 * @property {boolean} [options.canInterrupt=false] - If true, the user can ask a new question or go back in the middle of a response.
 * @property {boolean} [options.canRepeat=false] - If true, the user can ask the same question more than once.
 */
/**
 * @property {InterviewView~Options} options - An object of keyed options for the view.
 */
InterviewView.prototype.options = {
	interviewee: undefined,
	canInterrupt: false,
	canRepeat: false
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
InterviewView.prototype.HTMLSource = "<?php StackViewSource() ?>";

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
		
		if (!interviewee.disabled && !question.disabled)
		{
			$(".video-prompt").prop("hidden",true);
			$(".interview-video").prop("hidden",false);
			// Disable the question
			if (!scope.options.canRepeat)
			{
				question.disabled = true;
				$(this).toggleClass("question-disabled", question.disabled == true);
			}
			
			// Play the response video
			scope.DOMObject.find(".interview-video").html('<source src="'+interviewee.videoDirectory + question.responseVideo+'" type="video/mp4"></source>')
			// Start the clock, if necessary
			if (!scope.isClockRunning())
			{
				scope.startClock();
			}
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
		if(!(i%2)) //add a border between the questions
			$(obj).css("border-bottom","1px solid black"); 
		obj.appendTo(pt.parent());
	}
	
	// Hide the prototype
	pt.hide();
	
	// Back Button
	this.DOMObject.find(".back").click(function() {

		scope.application.pop(interviewee, "slideRight");
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
		
		$(this).toggleClass("question-disabled", question.disabled == true);
	});
	
	// Clock
	this.updateTimeRemaining();
}

/**
 * This function is called whenever the view was previously shown, but now is not anymore.
 */
InterviewView.prototype.onHide = function()
{
	this.stopClock();
}

/**
 * Update the time remaining that is displayed to the user, as well as the time's up display.
 */
InterviewView.prototype.updateTimeRemaining = function()
{
	let interviewee = this.options.interviewee;
	
	this.DOMObject.find(".time").text(formatTime(interviewee.timeRemaining));
	
	this.DOMObject.toggleClass("interviewee-disabled", interviewee.disabled == true);
	this.DOMObject.find(".interviewee-disabled-message").toggle(interviewee.disabled == true);
}

/**
 * @property {(boolean|number)} clockID - The interval ID of the clock running every second, or false if the clock is not running.
 */
InterviewView.prototype.clockID = false;

/**
 * Check if the clock is running.
 * @return {boolean} - Whether or not the clock is currently running.
 */
InterviewView.prototype.isClockRunning = function()
{
	return (this.clockID !== false);
}

/**
 * Start the clock.
 */
InterviewView.prototype.startClock = function()
{
	if (!this.isClockRunning())
	{
		this.clockID = setInterval(this.tickClock, 1000, this);
	}
}

/**
 * Tick the clock forward by one second.
 */
InterviewView.prototype.tickClock = function(scope)
{
	let interviewee = scope.options.interviewee;
	
	if (interviewee.timeRemaining > 0)
	{
		interviewee.timeRemaining -= 1;
	}
	else
	{ // stop the clock
		scope.stopClock();
		interviewee.disabled = true;
	}
	
	scope.updateTimeRemaining();
}

/**
 * Stop the clock.
 */
InterviewView.prototype.stopClock = function()
{
	if (this.isClockRunning())
	{
		clearInterval(this.clockID);
		this.clockID = false;
	}
}
