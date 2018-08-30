var svg = d3.select(".circle_tooltip").append("svg")
.attr("width", 400)
.attr("height", 150);

var x0=0, y0=55;
var x1=40, y1=30;
var x2=80, y2=55;

svg.append('circle').attr('class','dash_circle').attr('cx',250).attr('cy',70).attr('r',52).attr('fill','none');
svg.append('circle').attr('class','dash_circle').attr('cx',250).attr('cy',96).attr('r',26).attr('fill','none');
svg.append('circle').attr('class','dash_circle').attr('cx',250).attr('cy',96).attr('r',10).attr('fill','none');

svg.append('text').attr('x',0).attr('y',50).text('1000 tweets');
svg.append('text').attr('x',0).attr('y',86).text('100 tweets');
svg.append('text').attr('x',0).attr('y',106).text('10 tweets');

svg.append('line').attr('x1',100).attr('y1',50).attr('x2',200).attr('y2',50).attr('class','dash_line');
svg.append('line').attr('x1',100).attr('y1',86).attr('x2',225).attr('y2',86).attr('class','dash_line');
svg.append('line').attr('x1',100).attr('y1',106).attr('x2',250).attr('y2',106).attr('class','dash_line');