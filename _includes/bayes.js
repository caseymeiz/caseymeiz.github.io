
//https://mathworld.wolfram.com/Circle-CircleIntersection.html

//https://mathworld.wolfram.com/CircularSegment.html
//https://www.mathsisfun.com/geometry/circle-sector-segment.html
//http://paulbourke.net/geometry/circlesphere/


let data = { "a": { "probability": 0.3 }, "b": { "probability": 0.07 }, "a_and_b": { "probability": 0.05 } }
let venn = eulerData(data)
d3.selectAll("#p-of-a-and-b").datum(venn)
    .call(eulerDiagram())
d3.selectAll("#p-of-a-intersect-b").datum(venn)
    .call(eulerDiagram().hide_a(true).hide_b(true))
d3.select("#p-of-a-given-b").datum(venn)
    .call(eulerDiagram().hide_a(true).hide_universe(true).center("b"))
d3.select("#p-of-b-given-a").datum(venn)
    .call(eulerDiagram().hide_b(true).hide_universe(true).center("a"))

