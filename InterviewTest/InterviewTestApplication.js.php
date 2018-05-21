/**
 * The InterviewTest application.
 * @class
 * @extends StackApplication
 * @param {DOMObject} container - The HTML object in which the application should place its views.
 */
var InterviewTestApplication = function(container) {
	StackApplication.call(this, container);
	
	let interviewees = <?php require(__DIR__ . "/interviewees.json"); ?>;
	
	let selectionView = new IntervieweeSelectionView({
		interviewees: interviewees
	});
	
	let introView = new VideoMessageView({
		videoURL: "intro.mp4",
		continuePrompt: "Go On",
		nextView: selectionView
	});
	
	this.show(introView);
}
extend(StackApplication, InterviewTestApplication);