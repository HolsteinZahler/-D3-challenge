var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("viewBox" ,"0 0 960 500")
//  .attr("width", svgWidth)
//  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis, wsize) {
  // create scales
  var minX=d3.min(data, d => d[chosenXAxis]);
  var maxX=d3.max(data, d => d[chosenXAxis]);
  let LinearScale = d3.scaleLinear()
    .domain([minX-0.2*(maxX-minX),maxX+0.2*(maxX-minX)])
    .range([0, wsize]);

/*
  console.log(`max x`);
  console.log(d3.max(data, d => d[chosenXAxis]));
  console.log(`min x`);
  console.log(d3.min(data, d => d[chosenXAxis]));
*/
  return LinearScale;
  }
function yScale(data, chosenYAxis, hsize) {
  // create scales
  var minY=d3.min(data, d => d[chosenYAxis]);
  var maxY=d3.max(data, d => d[chosenYAxis]);
  let LinearScale = d3.scaleLinear()
    .domain([minY-0.2*(maxY-minY),maxY+0.2*(maxY-minY)])
    .range([hsize, 0]);


  console.log(`scale function sees`);
  console.log(chosenYAxis);
  console.log(`yscale rendered y`);
  console.log(LinearScale(20));
  return LinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));


  console.log(chosenXAxis);
  console.log(`rendered x`);
  console.log(newXScale(20));

  return circlesGroup;
}

function renderCirclesY(circlesGroup, chosenYAxis, data, hsize) {

  var minY=d3.min(data, d => d[chosenYAxis]);
  var maxY=d3.max(data, d => d[chosenYAxis]);
  let newYScale = d3.scaleLinear()
    .domain([minY-0.2*(maxY-minY),maxY+0.2*(maxY-minY)])
    .range([hsize, 0]);



  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  console.log(chosenYAxis);
  console.log(`renderCirclesY rendered y`);
  console.log(newYScale(20));
  return circlesGroup;
}

function renderCirclesTextX(circlesText, newXScale, chosenXAxis) {

  circlesText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis])+90)

  return circlesText;
}
//circlesText, xLinearScale, chosenXAxis, chosenYAxis, censusData, height
function renderCirclesTextY(circlesText, newXScale, chosenXAxis, chosenYAxis, data, hsize) {

  var minY=d3.min(data, d => d[chosenYAxis]);
  var maxY=d3.max(data, d => d[chosenYAxis]);
  let newYScale = d3.scaleLinear()
    .domain([minY-0.2*(maxY-minY),maxY+0.2*(maxY-minY)])
    .range([hsize, 0]);

  circlesText.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis])+90)
    .attr("y", d => newYScale(d[chosenYAxis])+25);

  return circlesText;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis ==="age") {
    xlabel = "Age:"
  }
  else {
    xlabel = "Income:";
  }

  var ylabel;

  if (chosenYAxis === "obesity") {
    ylabel = "Obesity:";
  }
  else if (chosenYAxis ==="smokes") {
    ylabel = "Smokes:"
  }
  else {
    ylabel = "Lacks Healthcare:";
  }

  var toolTip = d3.tip().attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(censusData) {
    toolTip.show(censusData);
  })
    // onmouseout event
    .on("mouseout", function(censusData, index) {
      toolTip.hide(censusData);
    });

  return circlesGroup;
}



d3.csv("assets/data/data.csv").then(function(censusData) {
  censusData.forEach(function(data) {
        data.poverty = parseFloat(data.poverty);
        data.age = parseFloat(data.age);
        data.income = parseFloat(data.income);
        data.obesity = parseFloat(data.obesity);
        data.smokes = parseFloat(data.smokes);
        data.healthcare = parseFloat(data.healthcare);
  });


  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis, width);
  // yLinearScale function above csv import
  var yLinearScale = yScale(censusData, chosenYAxis, height);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 15)
  .attr("fill", "blue")
  .attr("opacity", ".5")
  .style("stroke", "black");

  var getCirclesText = svg.append("g").selectAll("text")
  .data(censusData)
  .enter()
  .append("text");
  var circlesText = getCirclesText
  .attr("x", d => xLinearScale(d[chosenXAxis])+90)
  .attr("y", d => yLinearScale(d[chosenYAxis])+25)
  .text( function (d) { return d["abbr"]; })
  .attr("font-family", "sans-serif")
  .attr("font-size", "14px")
  .attr("fill", "red");


  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");
  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");


  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-10, ${height / 2})`);

  var obesityLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y",-60)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");
  var smokesLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("active", true)
    .text("Smokes (%)");
  var lacksHealthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -20)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
        console.log(`chose y axis`);
        console.log(chosenYAxis);

        // functions here found above csv import
        // updates x scale for new data
        ylinearScale = 0

        ylinearScale = yScale(censusData, chosenYAxis, height);

        console.log(`ylinearScale rendered y`);
        console.log(yLinearScale(20));
        

        // updates x axis with transition
        yAxis = renderYAxis(ylinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesY(circlesGroup, chosenYAxis, censusData, height);
        circlesText = renderCirclesTextY(circlesText, xLinearScale, chosenXAxis, chosenYAxis, censusData, height);
        
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          lacksHealthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes"){
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          lacksHealthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          lacksHealthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(`chose x axis`)
        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis, width);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
        circlesText = renderCirclesTextX(circlesText, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
  });


  });