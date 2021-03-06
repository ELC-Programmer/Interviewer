
/**
 * Creates and displays an Organization Chart.
 * @class
 */
OrgChart = function(){
	this.alreadyBuilt = 0;
}

/**
 * This function is called to initialize the tree when the tree is first shown.
 */
OrgChart.prototype.initTree = function(callback, event){
	$('<div id="orgChartContainer"></div>').appendTo('body').click(window.orgChart.hideChart);
	$('<div id="orgChart"></div>').appendTo('#orgChartContainer');
	$("#orgChart").append($("<div>").load("../OrgChart.html"));
	//prevent clicks on orgChart window from dismissing window
	$("#orgChart").css("border","1px solid black").click(function(event){event.stopPropagation();}); 
	$('<div class="floaterExitButton"></div>').appendTo('#orgChart').click(window.orgChart.hideChart);
	$.ajax({
	  dataType: "json",
	  url: "org_chart.json",
	  success:function(data){
		  	window.orgChart.ChartMaker("#orgGraph",data);
		  	window.orgChart.alreadyBuilt = 2;	
		  	if(callback && event) callback(event);
		  	else if(callback) callback();
	   },
	   error: function(){alert('Invalid JSON or org_chart file missing.')}
	});
}

/**
 * This function is called to display the chart. 
 * If this is the first time the tree is requested, this function will first call initTree to set up the tree and then fill in the tree with the requested info.
 */
OrgChart.prototype.showChart = function(event){
	//stop click event from propagating up and moving viewer to next screen
	event.stopPropagation(); 
	//check if tree is built, if not then build it
	if(window.orgChart.alreadyBuilt == 0){
		window.orgChart.alreadyBuilt = 1; //make sure we don't come back here while building the chart
		window.orgChart.initTree(window.orgChart.showChart, event); 
		return;
	}

	if(window.orgChart.alreadyBuilt == 1) return; //wait for builder to finish building

	//get and set selected person's position, name, and image
	$("#chosenPerson > #name").html(event.data['name']);
	$("#chosenPerson > #pos").html(event.data['pos']);
	$("#chosenPerson > #personImage").css("background-image","url("+event.data['img']+")");

	 //empty previous circle if colored in
	if(window.orgChart.currentlySelectedNode)
		d3.select(window.orgChart.currentlySelectedNode).select('circle').style("fill", "fff");

	//somehow another (really fast) asynchronous click got here while alreadyBuilt=1 was being set by the first click on showChart
	//we need to make sure that we're checking for this condition, because this potentially breaks the orgchart 
	if(d3.select("#orgChart svg").selectAll("g.node")[0] == undefined){
		console.log('Quick double click on orgChart.show occurred.');
		$("#orgChartContainer").remove();
		window.orgChart.alreadyBuilt = 1; 
		window.orgChart.initTree(window.orgChart.showChart, event); 
		return;
	}
	//find person's position on orgChart
	window.orgChart.currentlySelectedNode = d3.select("#orgChart svg").selectAll("g.node")[0].filter(function(d,i){ return d.textContent === event.data['pos']})[0];
	d3.select(window.orgChart.currentlySelectedNode).select('circle').style("fill", "red"); //set the fill of person's node to red

	//display orgChart
	$("#orgChartContainer").fadeIn();
}

/**
 * This function is called to hide the chart
 */
OrgChart.prototype.hideChart = function(){
	$("#orgChartContainer").fadeOut();
	d3.select(window.orgChart.currentlySelectedNode).select('circle').style("fill", "fff");
	window.orgChart.currentlySelectedNode = null
}

/**
 * This function is called to create the graph nodes, links, and layout
 */
OrgChart.prototype.ChartMaker = function(container, data){
	// false=vertical, true=horizontal
	let orientation = false;
	// ************** Generate the tree diagram	 *****************
	var margin = {top: 40, right: 30, bottom: 20, left: 30},
		width = $(container).width() - margin.right - margin.left,
		height = $(container).height() - margin.top - margin.bottom;
		
	var i = 0, duration = 750, root;

	var tree = d3.layout.tree().size([width, height]).separation(function(a, b) { return (a.parent == b.parent ? 1 : 2); });

	var horizontalTree = function(d){ return [d.y, d.x] },
		verticalTree = function(d){ return [d.x, d.y] },
		verticalTransition = function(d) { return "translate(" + d.y + "," + d.x + ")"; },
		horizontalTransition = function(d) { return "translate(" + d.x + "," + d.y + ")"; };
	var diagonal = d3.svg.diagonal().projection(orientation ? horizontalTree : verticalTree);

	var svg = d3.select(container).append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom)
	  			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = data[0];
	root.x0 = width / 2;
	root.y0 = 0;
	  
	update(root);

	// d3.select(self.frameElement).style("height", "500px");

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 180; });

		// Update the nodes…
		var node = svg.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); }).attr("margin",10);

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g").attr("class", "node")
						  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; }); 
						  // .on("click", click);

		nodeEnter.append("circle")
				.attr("r", 1e-6)
				// .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		// nodeEnter.append("text")
		// 			.attr("y", -15)//function(d) { return d.children || d._children ? -13 : 13; })
		// 			.attr("dy", ".2em")
		// 			.attr("text-anchor", "middle")//function(d) { return d.children || d._children ? "end" : "start"; })
		// 			.text(function(d) { return d.name; })
					.style("fill-opacity", 1);
		nodeEnter.append("foreignObject")
				    .attr("width", 70)
				    .attr("height", 20).attr("x", 15).attr("y",-15)//function(d) { return d.children || d._children ? -13 : 13; })
					.attr("dy", ".2em")
					.attr("text-anchor", "bottom")//function(d) { return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.name; })

		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr("transform", orientation ? verticalTransition : horizontalTransition);

		nodeUpdate.select("circle").attr("r", 10).style("cursor","default");//.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })

		nodeUpdate.select("foreignObject").style("fill-opacity", 1).style("cursor","default");

		// Transition exiting nodes to the parent's new position.
		// var nodeExit = node.exit().transition().duration(duration)
		// 					.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		// 					.remove();

		// nodeExit.select("circle").attr("r", 1e-6);

		// nodeExit.select("text").style("fill-opacity", 1e-6);

		// Update the links…
		var link = svg.selectAll("path.link").data(links, function(d) { return d.target.id; });

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			});

		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			}).remove();

		// Stash the old positions for transition.
		// nodes.forEach(function(d) {
		// 	d.x0 = d.x;
		// 	d.y0 = d.y;
		// });
	}

	// Toggle children on click? Probably better not to include this
	// function click(d) {
	//   if (d.children) {
	// 	d._children = d.children;
	// 	d.children = null;
	//   } else {
	// 	d.children = d._children;
	// 	d._children = null;
	//   }
	//   update(d);
	// }
}