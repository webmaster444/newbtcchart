  var margin = {top: 20, right: 40, bottom: 10, left: 40},
  width = 960,
  height = 120 - margin.top - margin.bottom;
  var prevPeriod = "1y";
  var cuPeriod = '1y';
  var xPos; // Slide mid point position  
  if(theme_version=='dark'){
    var lineColor = '#B0B0B4';  
    var slideTxtColor = 'white';
    var widget_back = '#2C2D37';
  }else if(theme_version =='light'){
    var lineColor = '#340667';
    var slideTxtColor = '#190430';
    var widget_back = 'white';
  }
  
  var svg = d3.select("#slider").append("svg")
  .attr('viewBox','0 0 '+ (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))  
  .attr("preserveAspectRatio", "xMinYMin meet")
  
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
    updatePeriod(xPos);
    transitionToItsPlace(cuPeriod);
  }
  var radius = 10;

    function dragmove() {
      slider.select('.start_period').classed('hide',false);
      slider.select('.end_period').classed('hide',false);
      xPos = d3.event.x - 40;
      if(xPos < 0){
        xPos = 0;                
        slider.select('.start_period').classed('hide',true);
      }else if(xPos+80>width){
        xPos = width - 80;                   
        slider.select('.end_period').classed('hide',true);
      }      
      y0 = 55;      
      d3.selectAll('.slider_g').attr('transform','translate('+xPos+',0)');              
    };

  var slider = svg.append('g').attr('class','slider').attr('transform','translate('+margin.left + ',' + margin.top + ')');
  slider.append('line').attr("x1", 0).attr('class','main_line').attr('y1',y0).attr("x2", width).attr('y2',y0).attr('stroke',lineColor).attr('stroke-width','2px').on('mousedown',function(d){                                
    var xPos = d3.mouse(this)[0] - 40;
    if(xPos+80 >width){
      xPos = width - 80;
      slider.select('.end_period').classed('hide',true);
    }else if(xPos - 40 < 0){
      xPos = 0;
      slider.select('.start_period').classed('hide',true);
    }
    d3.selectAll('.slider_g').transition().duration(2000).attr('transform','translate('+xPos+',0)');
    updatePeriod(xPos,true);                    
  });  
  slider.append('circle').attr('cx',0).attr('cy',y0).attr('r',2).attr('fill',lineColor);
  slider.append('circle').attr('cx',width).attr('cy',y0).attr('r',2).attr('fill',lineColor);
  slider.append('line').attr('x1',0).attr('class','trans_line').attr('y1',75).attr('x2',width).attr('y2',75).attr('stroke',widget_back).attr('stroke-width','20px').on('mousedown',function(d){
    var xPos = d3.mouse(this)[0] - 40;
    if(xPos+80 >width){
      xPos = width - 80;
      slider.select('.end_period').classed('hide',true);
    }else if(xPos - 40 < 0){
      xPos = 0;
      slider.select('.start_period').classed('hide',true);
    }
    d3.selectAll('.slider_g').transition().duration(2000).attr('transform','translate('+xPos+',0)');
    updatePeriod(xPos,true);  
  });
  slider.append('text').attr('x',0).attr('y',y0 - 30).text('Slider to adjust').attr('fill',slideTxtColor).attr('class','font_bold').style('opacity','.6').style('font-size','12px');
  slider.append('text').attr('x',0).attr('y',y0 + 30).text('1 year').attr('class','start_period hide').attr('fill','#97979C');
  slider.append('text').attr('x',width).attr('y',y0 + 30).text('1 week').attr('class','end_period').attr('fill','#97979C').attr('text-anchor','end');
  var slider_g = slider.append('g').attr('class','slider_g').attr('transform','translate(0,0)').call(drag);
  slider_g.append('line').attr('class','white_line').attr('x1',x0).attr('y1',y0).attr('x2',x2).attr('y2',y2).attr('stroke',widget_back).attr('stroke-width','3px');
  var bCurve = slider_g.append("path")
  // .attr("d", "M "+ x0+","+y0 +" Q "+x1 +','+y1 + ' '+x2+','+y2)
  .attr("d", "M 0,55 H 5 Q 40,30 75,55 H 80")
  .attr("stroke", lineColor)
  .attr("stroke-width", "2px")
  .attr("fill", widget_back)
  // .call(drag);

  slider_g.append('text').attr('class','label_text').attr('x',x1).attr('y',y0 + 10).attr('fill',slideTxtColor).text('1 year').attr('text-anchor','middle').style('font-size','13px')
  // .call(drag);
  slider_g.append('circle').attr('class','label_circle').attr('cx',x1).attr('cy',y1 + 50).attr('r',8).attr('fill','#24D17A')
  // .call(drag);  

  function updatePeriod(x0,tr=false){
    console.log(cuPeriod);
    var svgWidth = width + margin.left + margin.right; 
    var period;
    //check slider positions divide by 6
    var yPeriod = svgWidth/5;  // 1y
    var m6Period = yPeriod * 2; // 6m    
    var m1Period = yPeriod * 3; //1m
    var w2Period = yPeriod *4; //2w
    var w1Period = svgWidth //1w

    if(x0 <= yPeriod){
      period = "1y";
    }else if(x0 > yPeriod && x0<=m6Period){
      period = "6m";
    }else if(x0 > m6Period && x0 <=m1Period){
      period = "1m";
    }else if(x0 > m1Period && x0 <=w2Period){
      period = "2w";
    }else if(x0 > w2Period && x0 <= w1Period){
      period = "1w";
    }

    if(period==cuPeriod){
console.log('asdfds');

    var compareXPos = 0;
    switch(cuPeriod){
      case "1y":
        compareXPos = 0;
        break;
      case "6m":
        compareXPos = yPeriod;
        break;
      case "1m":
        compareXPos = m6Period;
        break;
      case "2w":
        compareXPos = m1Period;
        break;
      case "1w":
        compareXPos = w2Period;
        break;      
    }
    if(x0>compareXPos){
      if(cuPeriod =='1y'){
        period = '6m';
      }else if(cuPeriod =='6m'){
        period = '1m';
      }else if(cuPeriod=='1m'){
        period = '2w';
      }else if(cuPeriod =='2w'){
        period = '1w';
      }else if(cuPeriod =='1w'){
        period = '1w';
      }
    }else{
      if(cuPeriod =='1y'){
        period = '1y';
      }else if(cuPeriod =='6m'){
        period = '1y';
      }else if(cuPeriod=='1m'){
        period = '6m';
      }else if(cuPeriod =='2w'){
        period = '1m';
      }else if(cuPeriod =='1w'){
        period = '2w';
      }
    }
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
    
    if(tr){
      transitionToItsPlace(cuPeriod);
    }
    if(cuPeriod ==prevPeriod){      
    }else{
      prevPeriod = cuPeriod;
      updateChartData(cuPeriod);
    }
  }

  function transitionToItsPlace(period){
    var svgWidth = width + margin.left + margin.right; 
    var period;
    //check slider positions divide by 6
    var yPeriod = svgWidth/5;  // 1y
    var m6Period = yPeriod * 2; // 6m    
    var m1Period = yPeriod * 3; //1m
    var w2Period = yPeriod *4; //2w
    var w1Period = svgWidth //1w
    switch(period){
      case "1y":
        xPos = 0;
      break;
      case "6m":
        xPos = yPeriod;
      break;
      case "1m":
        xPos = m6Period;
      break;
      case "2w":
        xPos = m1Period;
      break;
      case "1w":
        xPos = w2Period;
      break;      
    }
    d3.selectAll('.slider_g').transition().duration(2000).attr('transform','translate('+xPos+',0)');
  }