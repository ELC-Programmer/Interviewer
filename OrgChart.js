
/**
 * The OrgChart Class.
 * @class
 * @param options: a dictionary of options, to allow for visual customizations (to be implemented)
 */
OrgChart = function(options){
	//this could be done much more easily using php 
	//  but the standard php call sample from interviewtestapplication.js (commented below) 
	//  wouldn't work for some reason :(
	this.initTree();
	let that = this;
	$.ajax({
	  dataType: "json",
	  url: "org_chart.json",
	  success: function(result1){
	  	$.ajax({
		  dataType: "json",
		  url: "interviewees.json",
		  success: function(result2){
		  	that.buildGraph(result1,result2);	
		  }
		})
	   },
	   error: function(){alert('Invalid JSON or org_chart.json missing.')}
	});

	// let hierarchy = php require(__DIR__ . "/org_chart.json");
	// let interviewees = php require(__DIR__ . "/interviewees.json");
	// this.buildGraph(hierarchy,interviewees);
}

//create the div to hold the graph
OrgChart.prototype.initTree = function(){
	$('<div id="orgChart"></div>').appendTo('body');
	$('<div class="floaterExitButton"></div>').appendTo('#orgChart').click(this.hide);
}
OrgChart.prototype.buildGraph = function(hierarchy, interviewees){
	//recursively build the nodes in the tree
	// iterate("0",null);
	// function iterate(id,parent){
	// 	for(var i=0; i<hierarchy[id]["children"].length; i++){
	// 		iterate(hierarchy[id]["children"][i],name);
	// 	}
	// }
	this.ChartMaker("#orgChart",hierarchy);
}
OrgChart.prototype.show = function(){
	$("#orgChart").show();
}
OrgChart.prototype.hide = function(){
	$("#orgChart").hide();
}

OrgChart.prototype.ChartMaker = function(container, data){
	// ************** Generate the tree diagram	 *****************
	var margin = {top: 20, right: 120, bottom: 20, left: 120},
		width = $(container).width() - margin.right - margin.left,
		height = $(container).height() - margin.top - margin.bottom;
		
	var i = 0, duration = 750, root;

	var tree = d3.layout.tree().size([height, width]);

	var horizontalTree = function(d){ return [d.y, d.x] },
		verticalTree = function(d){ return [d.x, d.y] };
	var diagonal = d3.svg.diagonal().projection(horizontalTree);

	var svg = d3.select(container).append("svg").attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom)
	  			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = data[0];
	root.x0 = height / 2;
	root.y0 = 0;
	  
	update(root);

	d3.select(self.frameElement).style("height", "500px");

	function update(source) {

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 180; });

		// Update the nodes…
		var node = svg.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g").attr("class", "node")
						  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
						  .on("click", click);

		nodeEnter.append("circle")
				.attr("r", 1e-6)
				.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeEnter.append("text")
					.attr("y", -20)//function(d) { return d.children || d._children ? -13 : 13; })
					.attr("dy", ".35em")
					.attr("text-anchor", "middle")//function(d) { return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.name; })
					.style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
								.duration(duration).attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		nodeUpdate.select("circle").attr("r", 10)
					.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		nodeUpdate.select("text").style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition().duration(duration)
							.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
							.remove();

		nodeExit.select("circle").attr("r", 1e-6);

		nodeExit.select("text").style("fill-opacity", 1e-6);

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
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
		d._children = d.children;
		d.children = null;
	  } else {
		d.children = d._children;
		d._children = null;
	  }
	  update(d);
	}
}