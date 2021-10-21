var nodes = [];
var nodeSet = new Set();


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}

var height = 500;
var width = 765;

d3.csv("./data.csv", function(d) {
        return {
          source: d['id1'],
          target: d['id2'],
          value: d['lines']
        } 
    })
  .then((data) => {
    const links = data  
        links.forEach( d => {
          if(!nodeSet.has(d.source)){
            nodeSet.add(d.source)
            nodes.push({id: d.source})
          }
          if(!nodeSet.has(d.target)){
            nodeSet.add(d.target)
            nodes.push({id: d.target})
          }
        });

        
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select("#svg-wrapper")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
	.attr("stroke", "#999")
	.attr("stroke-opacity", 0.6)
	.selectAll("line")
	.data(links)
	.join("line")
	.attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 6)
      .attr("fill", function(d){
        return scale(d.id)
      })
      

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

})