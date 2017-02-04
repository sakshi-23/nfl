var widthScreen = '100%'
var heightScreen = '100%'
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 1200 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;


d3.json('data/data.json', function(data) {

    var team="pit"

    var svg1 = d3.select("#teamChart1")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width)
    .append("svg")
        .attr("class", "firstSvg")
        .attr("width", width)//width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "circleGroup")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    createChart(data,team,svg1)



});

parseDate = d3.time.format("%Y-%m-%d").parse


function createChart(allData,team,svg) {
    var data =allData.games[team];
    data = data.filter(function(v) {
            return v.year > 1966;
        });
    data.sort(function(a,b) {
        return d3.descending(a.year, b.year) || d3.ascending(a.index, b.index);
    });
    var positionsObject={}
    var objectLength=[];
    var radius = 8;
    dis = ( width)/45
     data.forEach(function(d) {
        d.year =+ d.year,
        d.week =+ d.week,
        d.team_score =+d.team_score,
        d.oppn_score =+d.oppn_score,
        d.date = parseDate(d.date)
    })



    // Set the ranges
    var x = d3.scale.linear().range([0, width])

    var yLoc = d3.scale.linear()
        .range([height, 0])
        .domain([1966, 2016])


    var y = d3.time.scale()
    .range([height, 0]);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(50)
    y.domain([new Date(1966,1,1), new Date(2016,1,1)]);

// Add the scatterplot
    var circle = svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
       .attr("class", function(d) {
            return ""
        })
        .attr("r", radius)
        .attr("title", function(d) {return d.year+" "+d.game_name})
        .attr("cx", function(d,i) {
            if (d.game_name=="Wild Card")
                return 17*dis
            if (d.game_name=="Division")
                return 18*dis
            if (d.game_name=="Conf. Champ.")
                return 19*dis
            if (d.game_name=="SuperBowl")
                return 20*dis
             return (d.week-1)*dis
         })
        .attr("cy", function(d) {
            return yLoc(d.year);
         })


    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .style("fill", "gray");

    //ADD label for X-axis
//    var arr = [1,2,3,4,5,6,7];
    var xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-5,-15)")
    for (var i = 0; i <21; i++) {
        xTicks.append("text")
            .text(function(f){
              if (i==17)
                    return "WC"
                if (i==18)
                    return "DS"
                if (i==19)
                    return "CC"
                if (i==20)
                    return "SB"
            return 'W' + (i+1)
            })
            .attr("x", function() {

                return i*dis;
            })
            .append("svg:title")
            .text( function() {
                if (i==17)
                    return "Wild Card"
                if (i==18)
                    return "Division"
                if (i==19)
                    return "Conf. Champ"
                if (i==20)
                    return "SuperBowl"
                return "Week "+(i+1);
            })
    }
}



