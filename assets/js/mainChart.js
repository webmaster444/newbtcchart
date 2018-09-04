var url = 'https://decryptz.com/api/v1/charts/d3-tmp?period=1y&symbol=btc&key=JnW39hF43pkbqBo';
var timeFormat = d3.timeFormat("%d");
var dateTimeFormat = d3.timeFormat("%d %b,%y");
var timeFormatMonthOnly = d3.timeFormat("%b");
var monthDay = d3.timeFormat("%b %d");
var data;
var x, y;
var siFormat = function(d) {
    return monthDay(d);
};

var divTooltip = d3.select(".widget").append("div").attr("class", "toolTip");

var ttlCircleScale = d3.scaleLinear();
var circleScale = d3.scaleLinear();
var margin = {
        top: 20,
        right: 40,
        bottom: 50,
        left: 40
    },
    width = 960,
    height = 650 - margin.top - margin.bottom,
    widget_back = '#2C2D37';
d3.json(url, function(error, jsondata) {

    jsondata.forEach(function(d) {
        d.date = Date.parse(d.dt);
        d.dateDisp = timeFormat(Date.parse(d.dt));
        d.sumv = +(d.pv + d.nv);
    });

    data = jsondata;
    drawChart(data);
});

function drawChart(data) {
    if (!$('#circle_toggle').prop('checked')) {
        var svg = d3.select("#mainchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x = d3.scaleBand().range([0, width]).padding(0.1);
        var formatSuffixDecimal2 = d3.format(",.2f");

        y = d3.scaleLinear().range([height, margin.top]);
        var y1 = d3.scaleLinear().range([height, margin.top]); // y - axis for line chart

        x.domain(data.map(function(d) {
            return d.date;
        }));

        circleScale.domain(d3.extent(data, function(d) {
            return d.sumv
        })).range([x.bandwidth() / 4, x.bandwidth() / 2 * 1.2]);

        ttlCircleScale.domain(d3.extent(data, function(d) {
            return d.tv
        })).range([x.bandwidth() / 4, x.bandwidth() / 2 * 1.2]);

        var yMin = d3.min(data.map(function(d) {
            return d.tv - 1000
        }));
        var yMax = d3.max(data.map(function(d) {
            return d.tv + 1000
        }));

        var y1Min = d3.min(data.map(function(d) {
            return d.pr - 50
        }));
        var y1Max = d3.max(data.map(function(d) {
            return d.pr + 50
        }));

        var interpolate = d3.line()
            .x(d => d.dateDisp)
            .y(d => d.pr)
            .curve(d3.curveBasis);

        y.domain([0, yMax]);
        y1.domain([y1Min, y1Max]);

        var xAxis = d3.axisBottom(x).ticks(10).tickSizeOuter(0).tickFormat(siFormat);
        var yAxis = d3.axisLeft(y1).ticks(5).tickSize(0);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append('text').attr('x', -40).attr('y', 30).text('Price,$').attr('fill', '#4C3FC4');
        svg.selectAll("rect.path_rect")
            .data(data).enter()
            .append("rect")
            .attr('rx',10)
            .attr('class',function(d,i){
                return 'path_rect rect_'+i;
            })            
            .attr("width", x.bandwidth())
            .attr('x', function(d) {
                return x(d.date)
            })
            .attr("y", function(d) {
                return y(0);
            })
            .on("mousemove", function(d,i) {
                divTooltip.style("display", "inline-block");
                var x = d3.event.pageX,
                    y = d3.event.pageY
                var elements = document.querySelectorAll(':hover');
                l = elements.length
                l = l - 1
                elementData = elements[l].__data__;
                var index = $(elements[l].parentNode).index();
                divTooltip.html("<table><tr><td>" + siFormat(Date.parse(d.dt)) + "</td><td><img src='assets/price.png' width='15px' alt='Price'>" + d.pr + "<br/><span class='tooltip-label'>| Price</span></td><td><div style='width:15px;display:inline-block;border-radius:1px;background:#24D17A;height:15px;'></div>" + (d.pv / d.sumv * 100).toFixed(2) + "%<br/><span class='tooltip-label'>| Positive</span></td></tr><tr><td></td><td><img src='assets/barchart.png' width='15px' alt='Price'>" + d.tv + "<br><span class='tooltip-label'>| Total Tweet<br/> Volume</span></td><td><div style='width:15px;display:inline-block;border-radius:1px;background:#b02d42;height:15px;'></div>" + (d.nv / d.sumv * 100).toFixed(2) + "%<br><span class='tooltip-label'>|Negative</span></td></table>");
                d3.selectAll('rect.rect_'+i).classed('hover_rect',true);
            }).on('mouseout', function(d,i) {
                divTooltip.style("display", "none");
                d3.selectAll('rect.rect_'+i).classed('hover_rect',false);
            })            

            .transition()
            .duration(2000)
            .attr("y", function(d) {
                return y(d.tv);
            })
            .attr("height", function(d) {
                return height - y(d.tv);
            })

        svg.selectAll("rect.no_round_rect")
            .data(data).enter()
            .append("rect")            
            .attr('class',function(d,i){
                return 'no_round_rect rect_'+i;
            })            
            .attr("width", x.bandwidth())
            .attr('x', function(d) {
                return x(d.date)
            })
            .attr("y", function(d) {
                return y(0);
            })
            .on("mousemove", function(d,i) {
                divTooltip.style("display", "inline-block");
                var x = d3.event.pageX,
                    y = d3.event.pageY
                var elements = document.querySelectorAll(':hover');
                l = elements.length
                l = l - 1
                elementData = elements[l].__data__;
                var index = $(elements[l].parentNode).index();
                divTooltip.html("<table><tr><td>" + siFormat(Date.parse(d.dt)) + "</td><td><img src='assets/price.png' width='15px' alt='Price'>" + d.pr + "<br/><span class='tooltip-label'>| Price</span></td><td><div style='width:15px;display:inline-block;border-radius:1px;background:#24D17A;height:15px;'></div>" + (d.pv / d.sumv * 100).toFixed(2) + "%<br/><span class='tooltip-label'>| Positive</span></td></tr><tr><td></td><td><img src='assets/barchart.png' width='15px' alt='Price'>" + d.tv + "<br><span class='tooltip-label'>| Total Tweet<br/> Volume</span></td><td><div style='width:15px;display:inline-block;border-radius:1px;background:#b02d42;height:15px;'></div>" + (d.nv / d.sumv * 100).toFixed(2) + "%<br><span class='tooltip-label'>|Negative</span></td></table>");
                d3.selectAll('rect.rect_'+i).classed('hover_rect',true);
            }).on('mouseout', function(d,i) {
                divTooltip.style("display", "none");
                d3.selectAll('rect.rect_'+i).classed('hover_rect',false);
            })            

            .transition()
            .duration(2000)
            .attr("y", function(d) {
                return y(d.tv) + 10;
            })
            .attr("height", function(d) {
                return height - y(d.tv) - 10;
            })

        var defs = svg.append("defs");

        var gradients = defs.selectAll('linearGradient').data(data).enter().append('linearGradient').attr('id', function(d, i) {
                return "circleGradient_" + i;
            }).attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        gradients.append("stop")
            .attr('class', 'start')
            .attr("offset", '0%')
            .attr("stop-color", "#24D17A")
            .attr("stop-opacity", 1);

        gradients.append("stop")
            .attr('class', 'start')
            .attr("offset", function(d) {
                var percent = d.pv / d.sumv * 100;
                return percent + '%';
            })
            .attr("stop-color", "#7A7658")
            .attr("stop-opacity", 1);

        gradients.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#BE2F3E")
            .attr("stop-opacity", 1);

        var circles = svg.selectAll('circle').data(data).enter().append("circle")
            .attr('class', 'sum')
            .attr('cx', function(d) {
                return x(d.date) + x.bandwidth() / 2;
            })
            .attr('cy', (d) => y1(d.pr))
            .attr("fill", function(d, i) {
                return "url('#circleGradient_" + i + "')";
            })
            .attr('r', 0)
            .transition()
            .duration(2000)
            .attr('r', (d) => circleScale(d.sumv));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .style("stroke", function() {
                return '#4D40CB'
            })
            .attr("d", d3.line()
                .curve(d3.curveCardinal)
                .x(function(d) {
                    return x(d.date) + x.bandwidth() / 2;
                })
                .y(function(d) {
                    return y1(d.pr);
                })
            ).call(transition);

        var dotCircles = svg.selectAll('circle.dot').data(data).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return x(d.date) + x.bandwidth() / 2;
            })
            .attr('cy', (d) => y1(d.pr))
            .attr('r', 0)
            .transition()
            .duration(2000)
            .attr('r', 2)
            .attr("fill", "#9D93D3");

    } else {
        console.log($('#circle_toggle').prop('checked'));
        var svg = d3.select("#mainchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x = d3.scaleBand().range([0, width]).padding(0.1);
        var formatSuffixDecimal2 = d3.format(",.2f");

        y = d3.scaleLinear().range([height, margin.top]);
        var y1 = d3.scaleLinear().range([height, margin.top]); // y - axis for line chart

        x.domain(data.map(function(d) {
            return d.date;
        }));

        circleScale.domain(d3.extent(data, function(d) {
            return d.sumv
        })).range([x.bandwidth() / 4, x.bandwidth() / 2 * 1.2]);

        ttlCircleScale.domain(d3.extent(data, function(d) {
            return d.tv
        })).range([x.bandwidth() / 4, x.bandwidth() / 2 * 1.2]);

        var yMin = d3.min(data.map(function(d) {
            return d.tv - 1000
        }));
        var yMax = d3.max(data.map(function(d) {
            return d.tv + 1000
        }));

        var y1Min = d3.min(data.map(function(d) {
            return d.pr - 50
        }));
        var y1Max = d3.max(data.map(function(d) {
            return d.pr + 50
        }));

        var interpolate = d3.line()
            .x(d => d.dateDisp)
            .y(d => d.pr)
            .curve(d3.curveBasis);

        y.domain([0, yMax]);
        y1.domain([y1Min, y1Max]);

        var xAxis = d3.axisBottom(x).ticks(10).tickSizeOuter(0).tickFormat(siFormat);
        var yAxis = d3.axisLeft(y1).ticks(5).tickSize(0);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append('text').attr('x', -40).attr('y', 30).text('Price,$').attr('fill', '#4C3FC4');

        var circles = svg.selectAll('circle').data(data).enter().append("circle")
            .attr('class', 'sum')
            .attr('cx', function(d) {
                return x(d.date) + x.bandwidth() / 2;
            })
            .attr('cy', (d) => y1(d.pr))
            .attr('r', 0)
            .attr('fill', '#1f89dc')
            .transition()
            .duration(2000)
            .attr('r', (d) => ttlCircleScale(d.tv));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .style("stroke", function() {
                return '#4D40CB'
            })
            .attr("d", d3.line()
                .curve(d3.curveCardinal)
                .x(function(d) {
                    return x(d.date) + x.bandwidth() / 2;
                })
                .y(function(d) {
                    return y1(d.pr);
                })
            ).call(transition);

        var dotCircles = svg.selectAll('circle.dot').data(data).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return x(d.date) + x.bandwidth() / 2;
            })
            .attr('cy', (d) => y1(d.pr))
            .attr('r', 0)
            .transition()
            .duration(2000)
            .attr('r', 2)
            .attr("fill", "#9D93D3");
    }
}

function updateCircles(toggle) {
    if (toggle) {
        d3.select('#mainchart').selectAll('circle.sum').transition().duration(2000).attr('r', function(d) {
            return ttlCircleScale(d.tv)
        }).style('fill', '#1F89DC');

        d3.select('#mainchart').selectAll('rect').transition().duration(2000).attr('y', (d) => y(0)).attr('height', 0);
    } else {
        d3.select('#mainchart').selectAll('circle.sum').transition().duration(2000).attr('r', function(d) {
            return circleScale(d.sumv)
        }).style('fill', '');

        d3.select('#mainchart').selectAll('rect').transition().duration(2000).attr("y", function(d) {
                return y(d.tv);
            })
            .attr("height", function(d) {
                console.log(y(d.tv));
                console.log(height);
                return height - y(d.tv);
            })
    }
}

function updateChartData(newPeriod) {
    url = 'https://decryptz.com/api/v1/charts/d3-tmp?period=' + newPeriod + '&symbol=btc&key=JnW39hF43pkbqBo';
    d3.json(url, function(error, jsondata) {

        jsondata.forEach(function(d) {
            d.date = Date.parse(d.dt);
            d.dateDisp = timeFormat(Date.parse(d.dt));
            d.sumv = +(d.pv + d.nv);
        });

        data = jsondata;

        $('#period_date').html(dateTimeFormat(Date.parse(data[0].dt)) + " - " + dateTimeFormat(Date.parse(data[data.length - 1].dt)))

        // $("#mainchart")
        if (!$('#mainchart').is(':empty')) {
            $("#mainchart").empty();
        }

        drawChart(data);
    })
}

$(function() {
    $('#circle_toggle').change(function() {
        var cT = this.checked;
        if (!cT) {
            $('#tweet_span').removeClass('active');
            $('#sentiment_span').addClass('active');
        } else {
            $('#tweet_span').addClass('active');
            $('#sentiment_span').removeClass('active');
        }
        updateCircles(cT);
    })
})

function transition(path) {
    path.transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) {
        return i(t);
    };
}

function rightRoundedRect(x, y, w, h, r) {
    var retval;
    retval  = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2*r);
    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
    retval += "v" + (h - 2*r);    
    retval += "v" + r; retval += "h" + -r;
    retval += "h" + (2*r - w);    
    retval += "h" + -r; retval += "v" + -r;
    retval += "v" + (2*r - h);
    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;     
    retval += "z";
    return retval;
}