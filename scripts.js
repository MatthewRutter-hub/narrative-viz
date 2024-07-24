async function init() {
    console.log('Init function called');
    try {
        // Load the CSV data
        const data = await d3.csv('https://flunky.github.io/cars2017.csv');
        console.log('Data loaded:', data);
        
        // Make scatterplot
        var svg = d3.select("svg"),
            margin = 50,
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
        
    
        g.selectAll("circle")
         .data(data)
         .enter().append("circle")
         .attr("cx", d => x(d.AverageCityMPG))
         .attr("cy", d => y(d.AverageHighwayMPG))
         .attr("r", function(d){return 2 + (+d.EngineCylinders);});
    
        var xAxis = d3.axisBottom(x)
                    .tickValues([10, 20, 50, 100])
                    .tickFormat(d3.format("~s"));
    
        var yAxis = d3.axisLeft(y)
                      .tickValues([10, 20, 50, 100])
                      .tickFormat(d3.format("~s") );
    
        svg.append("g")
            .attr("transform", "translate(50,50)")
            .call(yAxis);
        var h = height+50
        svg.append("g")
            .attr("transform", "translate(50," + h + ")")
            .call(xAxis);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}
