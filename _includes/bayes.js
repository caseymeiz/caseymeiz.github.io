//https://mathworld.wolfram.com/CircularSegment.html
//https://www.mathsisfun.com/geometry/circle-sector-segment.html
//http://paulbourke.net/geometry/circlesphere/

let slider_a = d3.select("#a").on("input", update)
let slider_ab = d3.select("#ab").on("input", update)
let slider_b = d3.select("#b").on("input", update)

let svg = d3.select("#vis").append("svg")
            .attr("width", "50%")
            .attr("style", "background-color:#FBE7C6")
            .attr("viewBox", "0 0 1 1")

let g = svg.append("g")
            .attr("transform","translate(.5, .5)")

let a = g.append("g")
    .attr("fill", "#B4F8C8")
    .attr("stroke-width", 0)
    .attr("stroke", "#BBB")

let b = g.append("g")
    .attr("fill", "#FFAEBC")
    .attr("stroke-width", 0)
    .attr("stroke", "#BBB")

let ab = g.append("g")
    .attr("fill", "#A0E7E5")
    .attr("stroke-width", 0)
    .attr("stroke", "#BBB")


function update() {
    let data =  {
        "a": {
            "probability": parseFloat(slider_a.node().value)
        },    
        "b": {
            "probability": parseFloat(slider_b.node().value)
        },
        "a_and_b": {
            "probability": parseFloat(slider_ab.node().value)
        }
    }

    d3.select("#a-value").text(`P(A) = ${slider_a.node().value}`)
    d3.select("#b-value").text(`P(B) = ${slider_b.node().value}`)
    d3.select("#ab-value").text(`P(A and B) = ${slider_ab.node().value}`)



    let venn = eulerDiagram(data)

    a.selectAll("circle")
     .data([venn])
     .join("circle")
     .attr("cy", d => d.a.origin.y)
     .attr("cx", d => d.a.origin.x)
     .attr("r", d => d.a.radius)
    
    b.selectAll("circle")
     .data([venn])
     .join("circle")
     .attr("cy", d => d.b.origin.y)
     .attr("cx", d => d.b.origin.x)
     .attr("r", d => d.b.radius)
    
    if (venn.a_and_b.chord.length === 2){
        ab.selectAll("path")
        .data([venn])
        .join("path")
        .attr("d", d => `
            M ${d.a_and_b.chord[0].x} ${d.a_and_b.chord[0].y}
            A ${d.a.radius} ${d.a.radius} 0 0 0 ${d.a_and_b.chord[1].x} ${d.a_and_b.chord[1].y}
            M ${d.a_and_b.chord[0].x} ${d.a_and_b.chord[0].y}
            A ${d.b.radius} ${d.b.radius} 0 0 1 ${d.a_and_b.chord[1].x} ${d.a_and_b.chord[1].y}
            `)
    }

}
update()