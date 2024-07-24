async function init() {
    console.log('Init function called');
    try {
        // Load the CSV data
        const data = await d3.csv('https://flunky.github.io/cars2017.csv');
        console.log('Data loaded:', data);
        
        // Make scatterplot
        var svg = d3.select("svg"),
            margin = 100,
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
        
        g.selectAll("circle")
         .data(data)
         .enter().append("circle")
         .attr("cx", d => x(d.AverageCityMPG))
         .attr("cy", d => y(d.AverageHighwayMPG))
         .attr("r", function(d){return 2 + (+d.EngineCylinders);})
         .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html("Make: " + d.Make)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .append("title")
            .text(d => `City MPG: ${d.AverageCityMPG}\nHighway MPG: ${d.AverageHighwayMPG}\nCylinders: ${d.EngineCylinders}`);
    
        var xAxis = d3.axisBottom(x)
                    .tickValues([10, 20, 50, 100])
                    .tickFormat(d3.format("~s"));
    
        var yAxis = d3.axisLeft(y)
                      .tickValues([10, 20, 50, 100])
                      .tickFormat(d3.format("~s") );

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

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

document.getElementById('toScene1').addEventListener('click', () => {
    window.location.href = 'index.html';
 });
document.getElementById('toScene2').addEventListener('click', () => {
    window.location.href = 'scene2.html';
});
document.getElementById('toScene3').addEventListener('click', () => {
   window.location.href = 'scene3.html';
});
