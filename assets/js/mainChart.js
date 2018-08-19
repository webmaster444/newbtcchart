var url = 'https://decryptz.com/api/v1/charts/d3-tmp?period=1w&symbol=btc&key=JnW39hF43pkbqBo';
var timeFormat = d3.timeFormat("%d");
var timeFormatMonthOnly = d3.timeFormat("%b");
var data;
var siFormat = function(d) {	
    if (d !== "01")
        return d;
    var i = data.findIndex(function(item, i) {
        return item.dateDisp === d
    });
    
    return d + ' ' + timeFormatMonthOnly(data[i].date);
};

d3.json(url, function(error, jsondata) {        

    jsondata.forEach(function(d){
        d.date = Date.parse(d.dt);
        d.dateDisp = timeFormat(Date.parse(d.dt));
        d.sumv = +(d.pv+ d.nv);        
    });

    data = jsondata;
    console.log(data);
    drawChart(data);
});

function drawChart(data){
  	var margin = {top: 20, right: 40, bottom: 50, left: 40},
  	width = 960,
  	height = 650 - margin.top - margin.bottom, widget_back = '#2C2D37';

  	var svg = d3.select("#mainchart").append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.append('g').attr('transform','translate('+margin.left+ ',' + margin.top+')');

  	var x = d3.scaleBand().range([0, width]).padding(0.1);	
	var formatSuffixDecimal2 = d3.format(",.2f");

	var y = d3.scaleLinear().range([height, margin.top]);
	var y1 = d3.scaleLinear().range([height, margin.top]); // y - axis for line chart

	x.domain(data.map(function(d) {
	    return d.dateDisp;
	}));

	var yMin = d3.min(data.map(function(d){return d.tv - 1000}));
	var yMax = d3.max(data.map(function(d){return d.tv + 1000}));

	var y1Min = d3.min(data.map(function(d){return d.pr - 50}));
	var y1Max = d3.max(data.map(function(d){return d.pr + 50}));

	var interpolate = d3.line()
			.x(d => d.dateDisp )
            .y(d => d.pr )
            .curve(d3.curveBasis);

	y.domain([yMin, yMax]);
    y1.domain([y1Min, y1Max]);
	// x1.domain(d3.extent(data, function(d) {
	//     return d.lt;
	// }));

    var xAxis = d3.axisBottom(x).ticks(10).tickSizeOuter(0).tickFormat(siFormat);
    var yAxis = d3.axisLeft(y1).ticks(5).tickSize(0);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append('text').attr('x',-40).attr('y',30).text('Price').attr('fill','#808187');
    svg.selectAll("rect")
        .data(data).enter()
        .append("rect")
        .attr("width", x.bandwidth())
        .attr('x', function(d) {
            return x(d.dateDisp)
        })                        
        .attr("y", function(d) {
            return y(d.tv);            
        })
        .attr('rx','5px')
        // .transition()
        // .duration(2000)
        .attr("height", function(d) {
            return height - y(d.tv);           
        })

    svg.append("path")
      	.datum(data)
      	.attr("class", "line")
      	.style("stroke", function() { return 'red' })      
      	.attr("d", d3.line()
           	.curve(d3.curveCardinal)
           	.x(function(d) { return x(d.dateDisp) + x.bandwidth()/2; })
           	.y(function(d) { return y1(d.pr); })
       	);

    var defs = svg.append("defs");

    var gradients = defs.selectAll('linearGradient').data(data).enter().append('linearGradient').attr('id',function(d,i){    	
    	return "circleGradient_" + i;    	
    }).attr("x1", "0%")
	   .attr("x2", "0%")
	   .attr("y1", "0%")
	   .attr("y2", "100%");

	gradients.append("stop")
	   .attr('class', 'start')
	   .attr("offset", function(d){	   		
	   		var percent = d.pv / d.sumv * 100;
	   		return percent+'%';
	   })
	   .attr("stop-color", "green")
	   .attr("stop-opacity", 1);

	gradients.append("stop")
	   .attr('class', 'end')
	   .attr("offset", "100%")
	   .attr("stop-color", "red")
	   .attr("stop-opacity", 1);

	// var gradient = defs.append("linearGradient")
	//    .attr("id", "svgGradient")
	//    .attr("x1", "0%")
	//    .attr("x2", "0%")
	//    .attr("y1", "0%")
	//    .attr("y2", "100%");

	// gradient.append("stop")
	//    .attr('class', 'start')
	//    .attr("offset", "0%")
	//    .attr("stop-color", "green")
	//    .attr("stop-opacity", 1);

	// gradient.append("stop")
	//    .attr('class', 'end')
	//    .attr("offset", "80%")
	//    .attr("stop-color", "red")
	//    .attr("stop-opacity", 1);

   var line = svg.selectAll('circle').data(data).enter().append("circle")
      .attr('cx',function(d){
      	return x(d.dateDisp)+x.bandwidth()/2;
      })
      .attr('cy',(d)=>y1(d.pr))
      .attr('r',20)              
      // .attr("fill", "url('#svgGradient')");
      .attr("fill", function(d,i){
      	return "url('#circleGradient_" + i +"')";
      });
}