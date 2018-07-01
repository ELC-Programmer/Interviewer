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
 * @property {boolean|number} [options.idleAfter=false] - The number of seconds to wait after finishing a video before playing the idle video. If false, never play the idle video.
 * @property {string} [options.helpPrompt="Help"] - The prompt for the help button.
 * @property {boolean|string} [options.helpContent=false] - The HTML of the help dialog. If false, omit the help dialog.
 */
/**
 * @property {InterviewView~Options} options - An object of keyed options for the view.
 */
InterviewView.prototype.options = {
	interviewee: undefined,
	canInterrupt: false,
	canRepeat: false,
	idleAfter: false,
	helpPrompt: "Help",
	helpContent: false
};

/**
 * @property {string} HTMLSource - The HTML source for this view.
 * @override
 */
InterviewView.prototype.HTMLSource = "<?php StackViewSource() ?>";

/**
 * @property {string} styles - A CSS string containing styles for this view.
 * @override
 */
InterviewView.prototype.styles = "<?php FileContents(__DIR__ . '/styles.css') ?>";

/**
 * This function is called when the view is first shown.
 * @override
 */
InterviewView.prototype.onAddToApplication = function()
{
	let scope = this;
	let interviewee = this.options.interviewee;
	if(!this.application.interviewees[this.options.interviewee.name])
		this.application.interviewees[this.options.interviewee.name] = {};

	// Interviewee Portrait
	this.DOMObject.find(".interviewee-portrait").attr("src", interviewee.profileImage);
	
	let pt = this.DOMObject.find(".question-prototype");

	// Setup the question click handler
	pt.find(".question-button").click(function() {
		let id = $(this).parents(".question").attr("question-id");
		let question = interviewee.questions[id];

		if (!interviewee.disabled && !question.disabled)
		{
			//perform setup
			$(".video-prompt").prop("hidden",true);
			$(".video-error").hide();
			$(".interview-video").show();
			
			if(scope.isClockRunning() && scope.currQuestion){	//if we have just switched to a new question
				//if you cannot interrupt this speaker
				if(!scope.options.canInterrupt) return;
				//if the previous video has not finished playing, save the point where it was paused
				scope.application.interviewees[scope.options.interviewee.name][scope.currQuestion.prompt] = scope.DOMObject.find(".interview-video")[0].currentTime; 
			}

			//check if selected video exists, if not, show error message
			window.style.checkIfFileExists(interviewee.videoDirectory + question.responseVideo, function () {
				$(".video-error").show();
				scope.stopClock();
			});
			
			// Play the response video
			let video = scope.DOMObject.find(".interview-video");
			video.attr('src',interviewee.videoDirectory + question.responseVideo);
			if (video[0].currentTime !== undefined);
				video[0].currentTime = scope.application.interviewees[scope.options.interviewee.name][question.prompt];
			scope.currQuestion = question;
			
			// On video end
			scope.DOMObject.find(".interview-video")[0].addEventListener("ended", function() {
				if (scope.currQuestion !== undefined) // this wasn't the idle video
				{
					if (scope.currQuestion.endInterview) {
						interviewee.timeRemaining = 0;
					}
					scope.currQuestion = undefined;
					scope.idleSince = interviewee.timeRemaining;
				}
			});
			
			// Mark the interview as in-progress
			interviewee.began = true;
			scope.updateTimeRemaining();
			
			// Disable the question
			if (!scope.options.canRepeat)
			{
				question.disabled = true;
				$(this).parents(".question").toggleClass("question-disabled", question.disabled == true);
			}

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
		/*
		if(!(i%2)) //add a border between the questions
			$(obj).css("border-bottom","1px solid black"); 
		*/
			
		obj.appendTo(pt.parent());
		if(!this.application.interviewees[this.options.interviewee.name][question.prompt])	//set pausedAt value to 0 (initial) if not already set
			this.application.interviewees[this.options.interviewee.name][question.prompt] = 0; 
	}
	
	// Hide the prototype
	pt.hide();
	
	// Help
	this.helpDialog = this.DOMObject.find("#help-dialog")
		.attr("title", this.options.helpPrompt)
		.html(this.options.helpContent)
		.dialog({
			autoOpen: false,
			resizable: false,
			draggable: false,
			width: "50vw",
			maxHeight: 600,
			classes: {
				"ui-dialog": "help-dialog"
			},
			position: { my: "center top", at: "center bottom", of: this.DOMObject.find(".interview-view-header") }
		});
	this.DOMObject.find(".help-button")
		.attr("value", this.options.helpPrompt)
		.toggle(this.options.helpContent !== false)
		.click(function() {
			scope.helpDialog.dialog("open");
		});
	
	// Back Button
	this.DOMObject.find(".back").click(function() {
		//if this user is not disabled yet, save current video pause point 
		if(scope.options.interviewee.timeRemaining > 0 && scope.currQuestion)
			scope.application.interviewees[scope.options.interviewee.name][scope.currQuestion.prompt] = scope.DOMObject.find(".interview-video")[0].currentTime;
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
	let orgChartAttrs = {"pos":interviewee.title, "img":interviewee.profileImage, "name":interviewee.name}
	
	// Header
	this.DOMObject.find(".name").text(interviewee.name);
	this.DOMObject.find(".title").text(interviewee.title);
	if (window.orgChart)
	{
		this.DOMObject.find(".title").click(orgChartAttrs,window.orgChart.showChart);
	}
	
	// Questions
	this.DOMObject.find(".question").each(function() {
		let id = $(this).attr("question-id");
		let question = interviewee.questions[id];
		
		$(this).find(".question-prompt").text(question.prompt);
		
		$(this).toggleClass("question-disabled", question.disabled == true);
	});
	
	// Clock
	if (interviewee.began) {
		this.startClock();
		this.idleSince = interviewee.timeRemaining;
	}
	this.updateTimeRemaining();
}

/**
 * This function is called whenever the view was previously shown, but now is not anymore.
 */
InterviewView.prototype.onHide = function()
{
	this.stopClock();
	
	this.helpDialog.dialog("close");
}

/**
 * Update the time remaining that is displayed to the user, as well as the time's up display.
 */
InterviewView.prototype.updateTimeRemaining = function()
{
	let interviewee = this.options.interviewee;
		
	this.DOMObject.find(".time").text(formatTime(interviewee.timeRemaining));
	
	this.DOMObject.toggleClass("interview-view-disabled", interviewee.disabled == true);
	this.DOMObject.find(".time-begins-message").toggle(interviewee.began !== true);
	this.DOMObject.find(".interviewee-disabled-message").toggle(interviewee.disabled == true);
	
	// Play the idle video
	if (!interviewee.disabled && this.idleSince && interviewee.idleVideo && this.options.idleAfter !== false && this.idleSince - interviewee.timeRemaining > this.options.idleAfter)
	{
		this.DOMObject.find(".interview-video").show().attr('src', interviewee.videoDirectory + interviewee.idleVideo);
		this.idleSince = false;
	}
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
		$(".question").addClass("question-disabled");
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
