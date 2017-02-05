d3.json("data/superbowl-winners.json",function(error,json){

  var width = 1200,
    height = 170,
    padding = 10, // separation between nodes
    minRadius = 15,
    maxRadius = 20;

  var radiusScale = d3.scale.linear().domain([0,6]).range([minRadius,maxRadius]);
  var n = 32, // total number of nodes
    m = 4; // number of distinct clusters

  // var color = d3.scale.category10()
  //     .domain(d3.range(m));

  var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangePoints([-250, width+300], 1);
  var labels= ["0 wins","1-2 wins","3-4 wins", "5-6 wins"]
// for (row in labels){
    d3.selectAll("#row svg")
    .selectAll("text")
    .data(labels)
    .enter()
    .append("text")
    .text(function(d){return d})
    .attr("x",function(d,i) {return x(i)*0.7+30})
    .attr("y",20)



  function getGroup(count){
    if(count==0){
      return 0;
    }else if(count==1 || count==2){
      return 1;
    }else if(count==3 || count==4){
      return 2;
    }else{
      return 3;
    }
  }
  var nodes = json.map(function(d) {
      var i = getGroup(d.count);
      var v = (i + 1) / m * -Math.log(Math.random());
      return {
        radius: radiusScale(d.count),
        color: teamColorMap[d.teamId],
        cx:  x(i),
        cy: height / 2,
        teamId:d.teamId,
        group:i
      };
    });

  var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      // .gravity(0)
      // .charge(0)
      .on("tick", tick)
      .start();

  var svg = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height);

  var node = svg.selectAll("g.node")
      .data(nodes);

drag = force.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);




function dragstarted(d) {
        // force.stop();
        d3.event.sourceEvent.stopPropagation();
    }

    function dragged(d) {

//         if (d.group<2){
//                $('#team1')
//                .val(d.teamId)
//                .trigger('change');
//
//            }
//            else{
//                $('#team2')
//                .val(d.teamId)
//                .trigger('change');
//            }

//    console.log (d3.event.x,d3.event.y)
       if(d3.event.y > 165 && d3.event.x<550){
        $("#teamChart2").removeClass("border-team")
           $("#teamChart1").addClass("border-team")
           $("#teamChart1").removeClass("showrightBorder")
            addToteam1=true
            addToteam2=false
       }

       else if (d3.event.y > 165 && d3.event.x>550){
             $("#teamChart1").removeClass("border-team")
            $("#teamChart2").addClass("border-team")
            $("#teamChart1").removeClass("showrightBorder")
            addToteam2=true
             addToteam1=false

       }
       else {
        addToteam1=false;
        addToteam2=false;
         $("#teamChart1").removeClass("border-team")
         $("#teamChart2").removeClass("border-team")
         $("#teamChart1").addClass("showrightBorder")
       }

        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {

         if(addToteam1){
            $('#team1')
                .val(d.teamId)
                .trigger('change');
                addToteam1=false
       }
       if(addToteam2){
            $('#team2')
                .val(d.teamId)
                .trigger('change');
       }
        $("#teamChart1").addClass("showrightBorder")
        $("#teamChart1").removeClass("border-team")
         $("#teamChart2").removeClass("border-team")

         addToteam1=false;
         addToteam2=false;
        // force.resume();
    }

  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .call(drag)




  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return d.radius })
      .style("opacity", "0")


  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return "logos/"+d.teamId+".png";})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)
        .style("cursor","pointer")

  // var circle = svg.selectAll("circle")
  //     .data(nodes)
  //   .enter().append("circle")
  //     .attr("r", function(d) { return d.radius; })
  //     .style("fill", function(d) { return "#eeeeee"; });
  //     // .call(force.drag);

  //   circle.append("svg:image")
  //       .attr("xlink:href",  function(d) { console.log(d.teamId);return "logos/"+d.teamId+".png";})
  //       .attr("x", function(d) { return -25;})
  //       .attr("y", function(d) { return -25;})
  //       .attr("height", 50)
  //       .attr("width", 50);

  function tick(e) {
    nodeEnter
        .each(gravity(.2 * e.alpha))
        .each(collide(.6))
        // .attr("cx", function(d) { return d.x; })
        // .attr("cy", function(d) { return d.y; });

    nodeEnter.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  // Move nodes toward cluster focus.
  function gravity(alpha) {
    return function(d) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx - d.x) * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
      var r = d.radius + maxRadius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = (d.x - quad.point.x)*0.7,
              y = (d.y - quad.point.y )*1.2,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
})