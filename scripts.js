async function init() {
    console.log('Init function called');
    try {
        // Load the CSV data
        const data = await d3.csv('https://flunky.github.io/cars2017.csv');
        console.log('Data loaded:', data);
        originalData = data;
        fuel = false;

        // Event listeners for scene buttons
        document.getElementById('toScene1').addEventListener('click', () => {
            renderScene1(data);
            fuel = false;
        });
        document.getElementById('toScene2').addEventListener('click', () => {
            renderScene2(data);
            fuel = true;
        });

        // Event listeners for cylinder filter buttons
        document.getElementById('cylAll').addEventListener('click', () => {
            renderScatterPlot(data, fuel);
            d3.selectAll(".annotation0").style("display", "block");
        });
        document.getElementById('cyl0').addEventListener('click', () => {
            filterByCylinders(0);
            d3.selectAll(".annotation2").style("display", "block");
        });
        document.getElementById('cyl4').addEventListener('click', () => {
            filterByCylinders(4);
        });
        document.getElementById('cyl6').addEventListener('click', () => {
            filterByCylinders(6);
        });
        document.getElementById('cyl8').addEventListener('click', () => {
            filterByCylinders(8);
            d3.selectAll(".annotation1").style("display", "block");
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
    svg.selectAll("*").remove();

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
        .attr("fill", d => colorByFuel ? colorScale(d.Fuel) : "grey")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html("Make: " + d.Make)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
            d3.selectAll("circle")
                   .filter(cd => cd.Make === d.Make)
                   .classed("highlighted", true)  
                   .each(function() {
                        this.parentNode.appendChild(this);
                   });     
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

    addAnnotation(g, x, y, 0, 36, 33, "See which cars have the same make as this");
    addAnnotation(g, x, y, 1, 13, 18, "Efficency seems to correlate with cylinders, having more gives you a less efficent car");
    d3.selectAll(".annotation1").style("display", "none");
    addAnnotation(g, x, y, 2, 100, 92, "Outliers being electric");
    d3.selectAll(".annotation2").style("display", "none");
}

function filterByCylinders(cylinders) {
    const filteredData = originalData.filter(d => +d.EngineCylinders === cylinders);
    renderScatterPlot(filteredData, fuel);
    d3.selectAll(".annotation0").style("display", "none");
}

function addAnnotation(g, xScale, yScale, num, x, y, label) {
    const annotationData = {
        AverageCityMPG: x,
        AverageHighwayMPG: y,
        text: label
    };
    const annotation = g.append("g")
        .attr("class", "annotation" + num)
        .style("display", "block");

    annotation.append("line")
     .attr("x1", xScale(annotationData.AverageCityMPG) + 3)
     .attr("y1", yScale(annotationData.AverageHighwayMPG) + 3)
     .attr("x2", xScale(annotationData.AverageCityMPG) + 50)
     .attr("y2", yScale(annotationData.AverageHighwayMPG) + 50)
     .attr("stroke", "black")
     .attr("stroke-width", 1);

    annotation.append("text")
     .attr("x", xScale(annotationData.AverageCityMPG) + 55)
     .attr("y", yScale(annotationData.AverageHighwayMPG) + 58)
     .attr("text-anchor", "start")
     .attr("font-size", "12px")
     .attr("fill", "black")
     .text(annotationData.text);
}
