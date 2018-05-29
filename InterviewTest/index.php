<link href="https://fonts.googleapis.com/css?family=Tajawal|Merriweather" rel="stylesheet">

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

<style>
	.navbar{
		background-color:#545E75;
		color:white;
		width:100%;
		position:relative;
		top:0;
		left:0;
	}
	#app-title{
		font-size:1.5em;
		position:absolute;
		left:0;
		right:0;
		top:0;
		text-align:center;
	}
	#application{
		overflow:scroll;
	}
	#brand{
		width:358px;
		height:28.7px;
		padding:3px;
		position:relative;
		top:0;
		left:0;
		cursor:pointer;
	}
</style>
<link rel="stylesheet" type="text/css" href="styleSheet.css">
	<div class="navbar">
		<div id="app-title" class="titles"></div>
		<img id="brand" src='./../assets/ELC_Logo2.png'>
	</div>
	<div id="application"></div>
