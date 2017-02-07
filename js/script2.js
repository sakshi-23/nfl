
var teams;

$(function(){
var widthScreen = '100%'
var heightScreen = '100%'
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 600 - margin.left - margin.right,
    height = 1220 - margin.top - margin.bottom;
var rowclicked=false,yearprev=false;
var data;
var dateFormat = d3.time.format("%m-%d-%Y");

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
            return v.year > 1965;
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
        .domain([1965, 2016])


    var y = d3.time.scale()
    .range([height, 0]);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .ticks(50);

    y.domain([new Date(1965,1,1), new Date(2016,1,1)]);

// Add the scatterplot

    var line = svg.append("line")
                       .attr("class", "line")
                       .attr("x1", 358)
                        .attr("y1", -10)
                       .attr("x2", 358)
                       .attr("y2", height-18);

    var circle = svg.selectAll("dot")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d) {
            var colorAttr = $('input[name="colorAttr"]:checked').val();
            if(colorAttr=="oppQuality"){
                score=0
                if (allData.results[d.oppn])
                    score = allData.results[d.oppn][d.year].won/(parseInt(allData.results[d.oppn][d.year].won)+parseInt(allData.results[d.oppn][d.year].lost))
                score = parseInt(score/0.51)
                if(d.won_flag){
                    return "win"+score
                }
                else if(d.team_score== d.oppn_score){
                    return "draw"

                }else{
                    return "lost"+score
                }
            }else{
                var scoreDiff = Math.abs(d.team_score- d.oppn_score);
                if(d.won_flag){
                    if(scoreDiff<=10){
                        return "win0";
                    }else{
                        return "win1";
                    }
                }else if(d.team_score== d.oppn_score){
                 return "draw"

                }else{
                    if(scoreDiff<=10){
                        return "lost1";
                    }else{
                        return "lost0";
                    }
                }
            }
        })
        //.attr("r", function(d){
        //    return 5*Math.abs(d.team_score-d.oppn_score)/(d.oppn_score+d.team_score)+5
        //})
        .attr("width",19)
        .attr("height",19)
        //.style("stroke", function(d) {if (d.home_flag) return "black"})
        .style("stroke", function(d) {if (d.game_name=="SuperBowl" && d.won_flag) return "gold"})
        .style("stroke-width", "2px")
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
                   // score = allData.results[d.oppn][d.year].won
                   // score_opp = allData.results[d.oppn][d.year].lost
                   var seasonWins = seasonWinLossMap[d.oppn][d.year]['win']
                   var seasonLossesOrTies = seasonWinLossMap[d.oppn][d.year]['loss/tie']
                   won = d["won_flag"]?" (W) ":" (L)"
                   if (d["team_score"] ==d["oppn_score"])
                        won=" (T)"
                   home =d.home_flag?" (Home)":" (Away)"
                   str ="Date: "+dateFormat(d["date"])+"&nbsp"+home+"<br/>"+
                     "Vs "+teams[d["oppn"]].name + "<br/>"+
                    "Score: "+d["team_score"]+"-" +d["oppn_score"] +won+"<br/>"+
                    "Opponent season record: "+seasonWins+"-" +seasonLossesOrTies +"<br/>"
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
             d3.selectAll(".circleGroup rect")
              .classed("unclicked",false)

               d3.selectAll(".circleGroup rect")
              .classed("clicked",false)
            return;

        }

        $(d3.event.target).addClass("black")

        d3.selectAll(".circleGroup rect")
              .classed("unclicked",function(node){
                if(year!=node.year){
                    return true

                }
                return false
              })


            d3.selectAll(".circleGroup rect")
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
            d3.selectAll(".circleGroup rect")
                .classed("unhighlight",function(node){
                if(year!=node.year){
                    return true

                }
                return false
              })

             d3.selectAll(".circleGroup rect")
                .classed("highlight",function(node){
                if(year==node.year){
                    return true

                }
                return false
              })

    }

    function mouseout(){
            d3.selectAll(".circleGroup rect")
              .classed("unhighlight",false)
              d3.selectAll(".circleGroup rect")
              .classed("highlight",false)

    }

    //ADD label for X-axis
//    var arr = [1,2,3,4,5,6,7];
    var xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-5,-15)")

    var text = svg.append("g")
        .attr("transform", "translate(375,-30)")
        .append("text")
        .attr("class", "playoffLabel")
        .text("Playoffs");

    for (var i = 0; i <22; i++) {
        xTicks.append("text")
            .attr("class",function(){
                if (i==21){
                    return "weekTickText superbowl"
                }else{
                    return "weekTickText"
                }
            })
            .text(function(f){
              if (i==18)
                    return "WC"
                if (i==19)
                    return "DIV"
                if (i==20)
                    return "CONF"
                if (i==21)
                    return "SB"
            return  (i+1)
            })
            .attr("x", function() {
                if(i==20){
                    return i*dis-3;
                }else if(i==21) {
                    return i*dis+2;
                }else{
                    return i*dis;
                }
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

    $('input[type=radio][name=colorAttr]').change(function() {
        var colorAttr = $('input[name="colorAttr"]:checked').val();
                if(colorAttr=="oppQuality"){
                    $("#legend2").hide();
                    $("#legend1").show();}
                 else{
                 $("#legend1").hide();
                    $("#legend2").show();

                 }

        d3.selectAll(".firstSvg rect").attr("class", function(d) {
                var colorAttr = $('input[name="colorAttr"]:checked').val();
                if(colorAttr=="oppQuality"){
                    score=0
                    if (data.results[d.oppn])
                        score = data.results[d.oppn][d.year].won/(parseInt(data.results[d.oppn][d.year].won)+parseInt(data.results[d.oppn][d.year].lost))
                    score = parseInt(score/0.51)
                    if(d.won_flag){
                        return "win"+score
                    }
                    else if(d.team_score== d.oppn_score){

                            return "draw"

                    }else{
                        return "lost"+score
                    }
                }else{
                    var scoreDiff = Math.abs(d.team_score- d.oppn_score);
                    if(d.won_flag){
                        if(scoreDiff<=10){
                            return "win0";
                        }else{
                            return "win1";
                        }
                    }else if(d.team_score== d.oppn_score){
                          return "yetToPlay"

                    }else{
                        if(scoreDiff<=10){
                            return "lost1";
                        }else{
                            return "lost0";
                        }
                    }
                }
            })

    });

});