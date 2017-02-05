
var teams;

$(function(){
var widthScreen = '100%'
var heightScreen = '100%'
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 600 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;
var rowclicked=false,yearprev=false;
var data;


d3.json('data/teams2.json', function(data) {
    teams=data;
    var items = Object.keys(teams).map(function(key) {
        return [key, teams[key].name, teams[key].id];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
        if( first[2].localeCompare(second[2])==0){
            return first[1].localeCompare(second[1])
        }
        return first[2].localeCompare(second[2])
    });

    $('#team1').append('<option disabled>AFC</option>');
    $('#team2').append('<option disabled>AFC</option>')
    var fl=false;
    for (var i in items){
        t=items[i]
        if(t[2]=="NFC" && fl==false){
            $('#team1').append('<option disabled>NFC</option>');
            $('#team2').append('<option disabled>NFC</option>');
            fl=true;
        }

        $('#team1').append($('<option>', {value:t[0], text:t[1]}));
        $('#team2').append($('<option>', {value:t[0], text:t[1]}));
    }

}
);

$("#team1").on("change",function(){

    createChart(data,$(this).val(),"#teamChart1")
    highlightTeam();
    $("#teamChart1 .heading").attr("src","logos/"+$(this).val()+".png")


})

$("#team2").on("change",function(){

    createChart(data,$(this).val(),"#teamChart2")
    highlightTeam();
     $("#teamChart2 .heading").attr("src","logos/"+$(this).val()+".png")


})

function highlightTeam(){
    val1 = $("#team1").val();
    val2= $("#team2").val();

    unselectAll()


    d3.selectAll(".node")
    .style("opacity",function(d){
        if ([val1,val2].indexOf(d.teamId)==-1){
            return 0.2
        }
        else
            return 1
    })
}

function unselectAll(){
    d3.selectAll(".circleGroup circle")
              .classed("unhighlight",false)
      d3.selectAll(".circleGroup circle")
      .classed("highlight",false)


     d3.selectAll(".circleGroup circle")
              .classed("unclicked",false)
      d3.selectAll(".circleGroup circle")
      .classed("unclicked",false)

     d3.selectAll(".circleGroup circle")
              .classed("LogoClicked",false)
      d3.selectAll(".circleGroup circle")
      .classed("unLogoClicked",false)

       d3.selectAll(".highlight")
        .classed("highlight",false)

      d3.selectAll(".black")
        .classed("black",false)

}

d3.json('data/allGames.json', function(dt) {


    data=dt;
//    createChart(data,"pit","#teamChart1")
//    createChart(data,"pit","#teamChart2")

    $('#team1')
    .val('atl')
    .trigger('change');
    $('#team2')
    .val('nwe')
    .trigger('change');

});

parseDate = d3.time.format("%Y-%m-%d").parse

function createChart(allData,team,selector) {

    d3.select(selector).select("svg").remove();
//    d3.select(selector+" .heading").html(teams[team])

    var svg = d3.select(selector)
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

    var tooltip = d3.select(".tooltip")
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
    dis = (width)/25

    if(typeof data[0].date.getMonth !== 'function'){

           data.forEach(function(d) {
        d.year =+ d.year,
        d.week =+ d.week,
        d.team_score =+d.team_score,
        d.oppn_score =+d.oppn_score,
        d.date = parseDate(d.date)
    })
    }





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

    var line = svg.append("line")
                       .attr("class", "line")
                       .attr("x1", 355)
                        .attr("y1", -10)
                       .attr("x2", 355)
                       .attr("y2", height-18);

    var circle = svg.selectAll("dot")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) {
            score=0
            if (allData.results[d.oppn])
                score = allData.results[d.oppn][d.year].won/(parseInt(allData.results[d.oppn][d.year].won)+parseInt(allData.results[d.oppn][d.year].lost))
            score = parseInt(score/0.51)
            if(d.won_flag)
                return "win"+score
            return "lost"+score
        })
        //.attr("r", function(d){
        //    return 5*Math.abs(d.team_score-d.oppn_score)/(d.oppn_score+d.team_score)+5
        //})
        .attr("width",20)
        .attr("height",20)
        //.style("stroke", function(d) {if (d.home_flag) return "black"})
        .attr("x", function(d,i) {
            if (d.game_name=="Wild Card")
                return 18*dis-8
            if (d.game_name=="Division")
                return 19*dis-8
            if (d.game_name=="Conf. Champ.")
                return 20*dis-8
            if (d.game_name=="SuperBowl")
                return 21*dis-8

            return (d.week-1)*dis-8
         })
        .attr("y", function(d) {
            return yLoc(d.year)-5;
         })
         .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);

              tooltip.html(function(){
                   score = allData.results[d.oppn][d.year].won
                   total = (parseInt(allData.results[d.oppn][d.year].won)+parseInt(allData.results[d.oppn][d.year].lost))
                   won = d["won_flag"]?" (W) ":" (L)"
                    str = "Vs "+teams[d["oppn"]].name + "<br/>"+
                  "Score: "+d["team_score"]+"-" +d["oppn_score"] +won+"<br/>"+
                  "Opposition League score: "+score+"/" +total +"<br/>"
                    return str
              })
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 70) + "px")
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });




    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .attr("transform", "translate(-5,0)")
        .style("fill", "gray")
        .on("mouseover",function(d){
           mousein(d);
        })
        .on("mouseout",function(d){
            mouseout();
        })
        .on("click",clicked)

    function clicked(){
        rowclicked =false;
        mouseout();
        var year = $(d3.event.target).text()
         $("text").removeClass("black")
        if (yearprev==year){
            yearprev=""
             d3.selectAll(".circleGroup circle")
              .classed("unclicked",false)

               d3.selectAll(".circleGroup circle")
              .classed("clicked",false)
            return;

        }

        $(d3.event.target).addClass("black")

        d3.selectAll(".circleGroup circle")
              .classed("unclicked",function(node){
                if(year!=node.year){
                    return true

                }
                return false
              })


            d3.selectAll(".circleGroup circle")
              .classed("clicked",function(node){
                if(year==node.year && yearprev!=node.year){
                    return true

                }
                return false
              })

         yearprev =$(d3.event.target).text();
         rowclicked=true;

    }

    function mousein(){
         var year = $(d3.event.target).text()
            d3.selectAll(".circleGroup circle")
                .classed("unhighlight",function(node){
                if(year!=node.year){
                    return true

                }
                return false
              })

             d3.selectAll(".circleGroup circle")
                .classed("highlight",function(node){
                if(year==node.year){
                    return true

                }
                return false
              })

    }

    function mouseout(){
            d3.selectAll(".circleGroup circle")
              .classed("unhighlight",false)
              d3.selectAll(".circleGroup circle")
              .classed("highlight",false)

    }

    //ADD label for X-axis
//    var arr = [1,2,3,4,5,6,7];
    var xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-5,-15)")

    var text = svg.append("g")
        .attr("class", "")
        .attr("transform", "translate(375,-30)")
        .append("text")
        .text("Playoffs")
    for (var i = 0; i <22; i++) {
        xTicks.append("text")
            .text(function(f){
              if (i==18)
                    return "WC"
                if (i==19)
                    return "DS"
                if (i==20)
                    return "CC"
                if (i==21)
                    return "SB"
            return  (i+1)
            })
            .attr("x", function() {
                return i*dis;
            })
            .append("svg:title")
            .text( function() {
                if (i==18)
                    return "Wild Card"
                if (i==19)
                    return "Division"
                if (i==20)
                    return "Conf. Champ"
                if (i==21)
                    return "SuperBowl"
                return "Week "+(i+1);
            })
    }
}



});