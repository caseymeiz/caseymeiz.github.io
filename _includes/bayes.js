
//https://mathworld.wolfram.com/Circle-CircleIntersection.html

//https://mathworld.wolfram.com/CircularSegment.html
//https://www.mathsisfun.com/geometry/circle-sector-segment.html
//http://paulbourke.net/geometry/circlesphere/

let slider_a = d3.select("#a").on("input", update)
let slider_ab = d3.select("#ab").on("input", update)
let slider_b = d3.select("#b").on("input", update)

let chart = eulerDiagram()

update()
d3.select("#test svg")
    .attr("style", "background-color:#FBE7C6")
    .attr("stroke", "#BBB")
    .attr("stroke-width", 0)
d3.selectAll(".set-a").attr("fill", "#B4F8C8")
d3.selectAll(".set-b").attr("fill", "#FFAEBC")
d3.selectAll(".set-a-and-b").attr("fill", "#A0E7E5")

function update() {
    let data =  {
        "a": {"probability": parseFloat(slider_a.node().value)},    
        "b": {"probability": parseFloat(slider_b.node().value)},
        "a_and_b": {"probability": parseFloat(slider_ab.node().value)}
    }
    d3.select("#a-value").text(`P(A) = ${slider_a.node().value}`)
    d3.select("#b-value").text(`P(B) = ${slider_b.node().value}`)
    d3.select("#ab-value").text(`P(A and B) = ${slider_ab.node().value}`)

    let [valid, error_msg] = is_valid(data)
    d3.select("#error").text(error_msg)
    if (!valid) {
        return
    }

    let venn = eulerData(data)
    d3.select("#test").datum(venn).call(chart)
}