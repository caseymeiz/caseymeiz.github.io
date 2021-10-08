
config = {}
config.width = parseInt(document.querySelector(".post-content").clientWidth)
config.choices = ["a", "b", "c", "d"]



class Node {
    constructor(choices, selected, children) {
        this.choices = choices || []
        this.selected = selected || []
        this.children = children || []
    }
    get name() {
        return this.selected.join("")
    }
}

function dfs(root, f) {
    f(root)
    root.children.forEach(node => dfs(node, f));
    return root
}
function next_pers(node) {
    node.choices.forEach((c, i) => {
        let next = new Node(node.choices.slice(), node.selected.slice())
        next.choices.splice(i, 1)
        next.selected.push(c)
        node.children.push(next)
    })
}

data = dfs(new Node(config.choices), next_pers)

let k_perm = []
dfs(data, (n) => {
    if (n.selected.length == 3) {
        k_perm.push(n)
    }
})
let comb_rep_groups = d3.group(k_perm, (d) => {
    let copy = d.selected.slice()
    copy.sort()
    return copy.join("")
})
let comb_reps = Array.from(comb_rep_groups.keys())


other_data = dfs(new Node(["a", "b", "c", "d", "e"]), next_pers)


let perm_5 = []
dfs(other_data, (n) => {
    if (n.selected.length == 3) {
        perm_5.push(n)
    }
})
let comb_5_rep_groups = d3.group(perm_5, (d) => {
    let copy = d.selected.slice()
    copy.sort()
    return copy.join("")
})
let comb5_reps = Array.from(comb_5_rep_groups.keys())

let color = d3.scaleOrdinal()
              .domain(comb_reps)
              .range(d3.schemeCategory10)



let hierarchy = d3.hierarchy(data)
hierarchy.dx = 10;
hierarchy.dy = config.width / (hierarchy.height + 1)

let tree = d3.tree().nodeSize([hierarchy.dx, hierarchy.dy])(hierarchy)

let [x_min, x_max] = d3.extent(tree, d => d.x)

let svg = d3
    .select("#vis")
    .append("svg")
    .attr("viewBox", [0, 0, config.width, (x_max - x_min + tree.dx * 2)])


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
    .attr("r", 5)

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke", "white");






let table = d3.select("#comb4").append("table")
let thead = table.append("thead")
let tbody = table.append("tbody")


thead.append("tr")
     .selectAll("th")
     .data(["Representative", "Permutations"])
     .join("th")
     .text(d=>d)


let rows = tbody.selectAll("tr")
     .data(comb_reps)
     .join("tr")

rows.append("td")
    .text(d => d)
rows.append("td")
    .text(d => "("+comb_rep_groups.get(d).map(x => x.name).join(")(") + ")")





let table5 = d3.select("#comb5").append("table")
let thead5 = table5.append("thead")
let tbody5 = table5.append("tbody")


thead5.append("tr")
     .selectAll("th")
     .data(["Representative", "Permutations"])
     .join("th")
     .text(d=>d)


let rows5 = tbody5.selectAll("tr")
     .data(comb5_reps)
     .join("tr")

rows5.append("td")
    .text(d => d)
rows5.append("td")
    .text(d => "("+comb_5_rep_groups.get(d).map(x => x.name).join(")(") + ")")

