var svg = d3.select(".circle_tooltip").append("svg")
.attr('width','220').attr('height',150);

var x0=0, y0=55;
var x1=40, y1=30;
var x2=80, y2=55;

svg.append('circle').attr('class','dash_circle').attr('cx',160).attr('cy',70).attr('r',32).attr('fill','none');
svg.append('circle').attr('class','dash_circle').attr('cx',160).attr('cy',86).attr('r',16).attr('fill','none');
svg.append('circle').attr('class','dash_circle').attr('cx',160).attr('cy',86).attr('r',8).attr('fill','none');

svg.append('text').attr('x',0).attr('y',50).attr('class','large_circle_txt').text('1000 tweets');
svg.append('text').attr('x',0).attr('y',71).attr('class','medium_circle_txt').text('100 tweets');
svg.append('text').attr('x',0).attr('y',91).attr('class','small_circle_txt').text('10 tweets');

svg.append('line').attr('x1',80).attr('y1',50).attr('x2',120).attr('y2',50).attr('class','dash_line');
svg.append('line').attr('x1',80).attr('y1',71).attr('x2',145).attr('y2',71).attr('class','dash_line');
svg.append('line').attr('x1',80).attr('y1',91).attr('x2',160).attr('y2',91).attr('class','dash_line');