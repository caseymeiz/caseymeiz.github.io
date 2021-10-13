

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Circle {
    constructor(origin, radius) {
        this.origin = origin
        this.radius = radius
    }
}


function sample(arr, size) {
    return arr.map( c => [c, Math.random()]).sort((a,b) => a[1] < b[1]? -1:1).slice(0, size).map(d => d[0])
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}




