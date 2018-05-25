<script>
	<?php
		require_once(__DIR__ . '/../include.js');
		require_once(__DIR__ . '/InterviewTestApplication.js.php');
	?>
	
	$(function() {		
		let application = new InterviewTestApplication($("#application"));
		
		window.application = application;
	});
</script>
<link rel="stylesheet" type="text/css" href="styleSheet.css">
<div id="all-container">
	<h1 id="app-title" style="text-align:center">Application Title</h1>

	<div id="application"></div>
<div>