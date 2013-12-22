//Width and height for the drawing window
var w = 1500,
    h = 900,
    pad = h/8,
    xTicks = 5,
    yTicks = 5; //Set rough # of ticks

// Load data from the same dir 
d3.json("./rcolors.json", function(error, json){
    var dataset = json;

    var minDat = d3.min(d3.values(dataset)),
        minx = 0,
        maxx = 20,
        miny = 0,
        maxy = 33,
        xScale = d3.scale.linear().domain([minx, maxx]).range([pad, w-pad]),
        yScale = d3.scale.linear().domain([miny, maxy]).range([h-pad, pad]),
        ptSize=7,
        ptInc=18;


    //Create a SVG element
    var svg = d3.select("body").append("svg")
                .attr("width", w)
                .attr("height", h);

    // Create a title
        svg.append("text")
                .attr("class", "title")
                .attr("x", w/2)
                .attr("y", pad*2/3)
                .text("~ R colors ~");

    // Create circle generator
    var pts = svg.selectAll("circle").data(dataset).enter()
                .append("circle");

    // Add points as circles: values are stored in d[0], d[1] (x and y, resp)
        pts.attr("cx", function(d) {return xScale(d.x);})
               .attr("cy", function(d) {return yScale(d.y);})
               .attr("r", ptSize)
               .attr("fill", function(d){return d3.rgb(d.hex);})
               .attr("stroke", "grey")

               // On mouseover, add tooltips and change the point size
               .on("mouseover", function(d) {

                    // Increase the point size
                    d3.select(this)
                        .transition().duration(500).ease("elastic").attr("r", ptInc);

                    var xPosition = xScale(d.x)+pad/3;
                    var yPosition = yScale(d.y)-pad/5;

                    //Update the tooltip position and value
                    d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px")
                        .select("#value1").text(d.col + " - " + d.hex);
               
                    //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                    })

                // On mouseout, remove the tooltip and resize the point to its original value
                .on("mouseout", function() {
                    d3.select(this)
                        .transition().duration(750).ease("bounce").attr("r", ptSize);
                    d3.select("#tooltip").classed("hidden", true);
                   });

});
