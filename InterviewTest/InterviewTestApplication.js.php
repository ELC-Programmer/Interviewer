/**
 * The InterviewTest application.
 * @class
 * @extends StackApplication
 * @param {DOMObject} container - The HTML object in which the application should place its views.
 */
var InterviewTestApplication = function(container, toStyle) {
	StackApplication.call(this, container);
	
	let interviewees = <?php require(__DIR__ . "/interviewees.json"); ?>;
	let styleSettings = <?php require(__DIR__ . "/palette.json"); ?>;
	
	let selectionView = new IntervieweeSelectionView({
		interviewees: interviewees
	});
	
	let introView = new VideoMessageView({
		videoURL: "videos/intro.mp4",
		continuePrompt: "Start Interviewing!",
		nextView: selectionView
	});
	
	new Styling(styleSettings).apply(); //apply init styling to site

	this.show(introView);
}
extend(StackApplication, InterviewTestApplication);