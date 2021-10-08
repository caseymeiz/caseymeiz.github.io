
config = {}
config.width = 600
config.choices = [1,2,3,4]



class Node {
    constructor(choices, selected, children) {
        this.choices = choices || []
        this.selected = selected || []
        this.children = children || []
    }
    get name() {
        return this.selected.join(" ")
    }
}

function dfs(root, f) {
    f(root)
    root.children.forEach(node => dfs(node, f));
    return root
}
data = dfs(new Node(config.choices), (node) => {
    node.choices.forEach((c, i) => {
        let next = new Node(node.choices.slice(), node.selected.slice())
        next.choices.splice(i, 1)
        next.selected.push(c)
        node.children.push(next)
    })
})





let hierarchy = d3.hierarchy(data)
hierarchy.dx = 10;
hierarchy.dy = config.width / (hierarchy.height + 1)

let tree = d3.tree().nodeSize([hierarchy.dx, hierarchy.dy])(hierarchy)

let [x_min, x_max] = d3.extent(tree, d => d.x)

let svg = d3
    .select("#vis")
    .append("svg")
    .attr("style", "background-color:#EEE")
    .attr("viewBox", [0, 0, config.width, x_max - x_min + tree.dx * 2])


let g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
    .attr("transform", `translate(${tree.dy / 3},${tree.dx - x_min})`);


let links = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(tree.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))

let node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(tree.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`)

node.append("circle")
    .attr("r", 3)

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke", "white");







