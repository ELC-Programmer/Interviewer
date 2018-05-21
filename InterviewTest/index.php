<script>
	<?php
		require_once(__DIR__ . '/../_lib/Interviewer/include.js.php');
		require_once(__DIR__ . '/InterviewTestApplication.js.php');
	?>
	
	$(function() {		
		let application = new InterviewTestApplication($("#application"));
		
		window.application = application;
	});
</script>

<h1>This is outside the stack application!</h1>
<div id="application" style="border: 1px solid black; background-color: yellow"></div>