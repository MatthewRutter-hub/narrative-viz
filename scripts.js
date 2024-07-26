async function init() {
    console.log('Init function called');
    try {
        // Load the CSV data
        const data = await d3.csv('https://flunky.github.io/cars2017.csv');
        console.log('Data loaded:', data);
        originalData = data; // Store the original data

        // Event listeners for scene buttons
        document.getElementById('toScene1').addEventListener('click', () => {
            renderScene1(data);
        });
        document.getElementById('toScene2').addEventListener('click', () => {
            renderScene2(data);
        });

        // Event listeners for cylinder filter buttons
        document.getElementById('cylAll').addEventListener('click', () => {
            renderScatterPlot(data, true);
        });
        document.getElementById('cyl0').addEventListener('click', () => {
            filterByCylinders(0);
        });
        document.getElementById('cyl4').addEventListener('click', () => {
            filterByCylinders(4);
        });
        document.getElementById('cyl6').addEventListener('click', () => {
            filterByCylinders(6);
        });
        document.getElementById('cyl8').addEventListener('click', () => {
            filterByCylinders(8);
        });



        // Initialize with Scene 1
        renderScene1(data);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderScene1(data) {
    renderScatterPlot(data, false);
}

function renderScene2(data) {
    renderScatterPlot(data, true);
}

function renderScatterPlot(data, colorByFuel) {
    var svg = d3.select("svg");
    svg.selectAll("*").remove(); // Clear the SVG content

    var margin = 100,
        width = svg.attr("width") - 2 * margin,
        height = svg.attr("height") - 2 * margin;   

    var x = d3.scaleLog()
              .domain([10, 150])
              .range([0, width]);

    var y = d3.scaleLog()
              .domain([10, 150])
              .range([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + margin + "," + margin + ")");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var colorScale = d3.scaleOrdinal()
                       .domain(["Gasoline", "Diesel", "Electricity"])
                       .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.AverageCityMPG))
        .attr("cy", d => y(d.AverageHighwayMPG))
        .attr("r", d => 5 + (+d.EngineCylinders)/1.4)
        .attr("fill", d => colorByFuel ? colorScale(d.Fuel) : "black")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html("Make: " + d.Make)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
            d3.selectAll("circle")
                   .filter(cd => cd.Make === d.Make)
                   .classed("highlighted", true);       
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
            d3.selectAll("circle")
                   .classed("highlighted", false);
        })
        .append("title")
        .text(d => `City MPG: ${d.AverageCityMPG}\nHighway MPG: ${d.AverageHighwayMPG}\nCylinders: ${d.EngineCylinders}`);

    var xAxis = d3.axisBottom(x)
                  .tickValues([10, 20, 50, 100])
                  .tickFormat(d3.format("~s"));

    var yAxis = d3.axisLeft(y)
                  .tickValues([10, 20, 50, 100])
                  .tickFormat(d3.format("~s"));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("y", margin - 20)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .text("Average City MPG");
    
    // Add the Y Axis
    g.append("g")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -height / 2)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("stroke", "black")
        .text("Average Highway MPG");
}

function filterByCylinders(cylinders) {
    const filteredData = originalData.filter(d => +d.EngineCylinders === cylinders);
    renderScatterPlot(filteredData, true);
}

// Initialize the visualization
window.addEventListener('load', init);
