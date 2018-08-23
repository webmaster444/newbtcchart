  var margin = {top: 20, right: 40, bottom: 10, left: 40},
  width = 960,
  height = 120 - margin.top - margin.bottom;
  var prevPeriod = "1y";
  var cuPeriod;
  var widget_back = '#2C2D37';
  var svg = d3.select("#slider").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  
  var x0=0, y0=55;
  var x1=40, y1=30;
  var x2=80, y2=55;

  var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragmove)
    .on("end",dragend)

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
  }

  function dragend(){
    if(cuPeriod ==prevPeriod){
      console.log('no update');
    }else{
      prevPeriod = cuPeriod;
      updateChartData(cuPeriod);
    }
  }
  var radius = 10;

    function dragmove() {      
      slider.select('.start_period').classed('hide',false);
      slider.select('.end_period').classed('hide',false);
      x0 = d3.event.x - 40;
      if(x0 < 0){
        x0 = 0;
        x1 = 40;
        x2 = 80;        
        slider.select('.start_period').classed('hide',true);
      }else{
        x1 = d3.event.x;            
        x2 = d3.event.x + 40;      
      }

      if(x2 > width){
        x2 = width;
        x1 = x2- 40;
        x0 = x2 - 80;        
        slider.select('.end_period').classed('hide',true);
      }
      y0 = 55;      
      bCurve.attr("d", "M "+ x0+","+y0 +" Q "+ x1+","+y1 +" "+ x2+","+y2);
      d3.select('.white_line').attr('x1',x0).attr('y1',y0).attr('x2',x2).attr('y2',y0);
      slider.select('.label_circle').attr('cx',x1);      
      slider.select('.label_text').attr('x',x1);      

      updatePeriod(x1);
    };

  var slider = svg.append('g').attr('class','slider').attr('transform','translate('+margin.left + ',' + margin.top + ')');
  slider.append('line').attr("x1", 0).attr('y1',y0).attr("x2", width).attr('y2',y0).attr('stroke','blue').attr('stroke-width','2px');
  slider.append('line').attr('class','white_line').attr('x1',x0).attr('y1',y0).attr('x2',x2).attr('y2',y2).attr('stroke',widget_back).attr('stroke-width','2px');
  slider.append('circle').attr('cx',0).attr('cy',y0).attr('r',2);
  slider.append('circle').attr('cx',width).attr('cy',y0).attr('r',2);
  slider.append('text').attr('x',0).attr('y',y0 - 30).text('Slider to adjust');
  slider.append('text').attr('x',0).attr('y',y0 + 30).text('1 year').attr('class','start_period hide');
  slider.append('text').attr('x',width).attr('y',y0 + 30).text('1 week').attr('class','end_period').attr('text-anchor','end');
  var bCurve = slider.append("path")
  .attr("d", "M "+ x0+","+y0 +" Q "+x1 +','+y1 + ' '+x2+','+y2)
  .attr("stroke", "blue")
  .attr("stroke-width", "2px")
  .attr("fill", widget_back).call(drag);

  slider.append('text').attr('class','label_text').attr('x',x1).attr('y',y0 + 10).text('1 year').attr('text-anchor','middle').style('font-size','13px').call(drag);
  slider.append('circle').attr('class','label_circle').attr('cx',x1).attr('cy',y1 + 50).attr('r',8).attr('fill','green').call(drag);

  function updatePeriod(x0){
    var svgWidth = width + margin.left + margin.right; 
    var period;
    //check slider positions divide by 6
    var yPeriod = svgWidth/6;  // 1y
    var m6Period = svgWidth/3; // 6m
    var m2Period = svgWidth / 2; //2m
    var m1Period = m6Period * 2; //1m
    var w2Period = m1Period + yPeriod; //2w
    var w1Period = svgWidth //1w

    if(x0 <= yPeriod){
      period = "1y";
    }else if(x0 > yPeriod && x0<=m6Period){
      period = "6m";
    }else if(x0 > m6Period && x0<=m2Period){
      period = "2m";
    }else if(x0 > m2Period && x0 <=m1Period){
      period = "1m";
    }else if(x0 > m1Period && x0 <=w2Period){
      period = "2w";
    }else if(x0 > w2Period && x0 <= w1Period){
      period = "1w";
    }
    
    switch(period){
      case "1y":
        cuPeriod = '1y';
        $('.label_text').text('1 year');
        $('#period_span').text('1 year');
        break;
      case "6m":
        cuPeriod = '6m';
        $('.label_text').text('6 months');
        $('#period_span').text('6 months');
        break;
      case "2m":
        cuPeriod = '2m';
        $('.label_text').text('2 months');
        $('#period_span').text('2 months');
        break;
      case "1m":
        cuPeriod = '1m';
        $('.label_text').text('1 month');
        $('#period_span').text('1 month');
        break;
      case "2w":
        cuPeriod = '2w';
        $('.label_text').text('2 weeks');
        $('#period_span').text('2 weeks');
        break;
      case "1w":
        cuPeriod = '1w';
        $('.label_text').text('1 week');
        $('#period_span').text('1 week');
        break;
    }
  }