var margin = {top: 10, right: 1, bottom: 100, left: 1},
width = 1400 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3.select("#bubble_chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.csv("Reddit_posts.csv", function(data) {

  // Filter a bit the data -> more than 1 million inhabitants

  // Color palette for continents?
  var color = d3.scaleOrdinal()
    .domain(["assault","catfish","phishing","robbed","scam","sexual assault"])
    .range(d3.schemeSet1);

  // Size scale for countries
  var size = d3.scaleLinear()
  .domain([8, 5000])
  .range([ 5, 600]);  // circle will be between 1px and 1000 px wide

  // create a tooltip
  var Tooltip = d3.select("#bubble_chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.Category + '</u>' + "<br>" + d.Count + " posts")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg3.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("r", function(d){ return 2.5*size(d.Count)})
      .attr("cx", width / 8)
      .attr("cy", height / 8)
      .style("fill", function(d){ return color(d.Category)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(2*width).y(height)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.1).radius(function(d){ return 2.4*(size(d.Count)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.01).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})