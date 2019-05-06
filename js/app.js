var margin = {
		top: 70,
		right: 20,
		bottom: 40,
		left: 60
	},
	width = 800 - margin.left - margin.right,
	height = 640 - margin.top - margin.bottom;

var timeFormat = d3.timeFormat("%M:%S");

// Graph
var svg = d3
	.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

// Tooltip
var div = d3
	.select("#chart-area")
	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip")
	.style("opacity", 0);

// Scales
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, margin.top]);

var yAxisScale = d3.scaleLinear().range([height, margin.top]);

//  Labels
var xLabel = svg
	.append("text")
	.attr("class", "x-axis-label")
	.attr("x", width / 2)
	.attr("y", height + 50)
	.style("text-anchor", "center")
	.attr("font-size", "26px")
	.text("Year");
var yLabel = svg
	.append("text")
	.attr("class", "y-axis-label")
	.attr("x", -350)
	.attr("y", 18)
	.style("text-anchor", "center")
	.attr("font-size", "22px")
	.attr("transform", "rotate(-90)")
	.text("Time in Minutes");
var title = svg
	.append("text")
	.attr("id", "title")
	.attr("x", 165)
	.attr("y", 25)
	.style("text-anchor", "center")
	.attr("font-size", "28px")
	.text("Doping in Professional Bicycle Racing");
var subtitle = svg
	.append("text")
	.attr("id", "subtitle")
	.attr("x", 255)
	.attr("y", 50)
	.style("text-anchor", "center")
	.attr("font-size", "20px")
	.text("35 Fastest times up Alpe d'Huez");

d3.json(
	"https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(data => {
	console.log(data);

	// Add Domains
	xScale.domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year)]);

	yScale.domain([
		d3.min(data, d => d.Seconds - 10),
		d3.max(data, d => d.Seconds + 10)
	]);

	yAxisScale.domain([
		d3.min(data, d => (d.Seconds - 10) * 1000),
		d3.max(data, d => (d.Seconds + 10) * 1000)
	]);

	// X Axis
	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	svg
		.append("g")
		.attr("transform", `translate(${margin.left}, ${height})`)
		.attr("id", "x-axis")
		.call(xAxis);

	// Y Axis
	var yAxis = d3.axisLeft(yAxisScale).tickFormat(timeFormat);
	svg
		.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("id", "y-axis")
		.call(yAxis);

	// Plot data
	var circles = svg
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", d => xScale(d.Year) + margin.left)
		.attr("cy", d => yScale(d.Seconds))
		.attr("r", 8)
		.attr("class", "dot")
		.attr("data-xvalue", d => d.Year)
		.attr("data-yvalue", d => timeFormat(yScale(d.Seconds))) // !
		.attr("fill", d => (d.Doping === "" ? "#FF7F0E" : "#1F77B4"))
		// Tooltip
		.on("mouseover", function(d) {
			div
				.transition()
				.duration(200)
				.style("opacity", 0.9);

			div
				.html(
					` ${d.Name} <strong style="color: red"}>[${
						d.Nationality
					}]</strong> <br>
          <strong>Year:</strong> ${d.Year} <br>
          <strong>Time:</strong> ${d.Time} <br>
          <em>${d.Doping}</em>`
				)
				.style("left", `${d3.event.pageX - 90}px`)
				.style("top", `${d3.event.pageY - 100}px`)
				.attr("data-year", d.Year);
		})
		.on("mouseout", function(d) {
			div
				.transition()
				// .duration(500)
				.style("opacity", 0);
		});

	// Legend
	var legend = svg.append("g").attr("id", "legend");

	legend
		.append("text")
		.attr("x", width)
		.attr("y", height - 62)
		.attr("font-size", 12)
		.style("text-anchor", "end")
		.text("No doping allegations");
	legend
		.append("text")
		.attr("x", width)
		.attr("y", height - 40)
		.attr("font-size", 12)
		.style("text-anchor", "end")
		.text("Riders with doping allegations");
	// Legend Rect (amber)
	legend
		.append("rect")
		.attr("x", width + 10)
		.attr("y", height - 75)
		.attr("width", 18)
		.attr("height", 18)
		.attr("fill", "#FF7F0E");
	// Legend Rect (blue)
	legend
		.append("rect")
		.attr("x", width + 10)
		.attr("y", height - 55)
		.attr("width", 18)
		.attr("height", 18)
		.attr("fill", "#1F77B4");
});
