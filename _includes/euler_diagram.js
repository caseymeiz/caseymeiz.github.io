

let _config =  {
    "a": {
        "probability": .3
    },    
    "b": {
        "probability": .2
    },
    "a_and_b": {
        "probability": .1
    }
}

function circle_intersection(c1, c2) {
    let d = distance(c1.origin, c2.origin)
    let a = (d**2 + c1.radius**2 - c2.radius**2)/(2*d)
    let h = Math.sqrt(c1.radius**2 - a**2)
    let x = c1.origin.x + a*(c2.origin.x - c1.origin.x)/d
    let y = c1.origin.y + a*(c2.origin.y - c1.origin.y)/d
    if (isNaN(d) || isNaN(a) || isNaN(h)){
        console.error("err")
    }
    return [
        new Point(x + h*(c2.origin.y - c1.origin.y)/d, y + h*(c2.origin.x - c1.origin.x)/d),
        new Point(x - h*(c2.origin.y - c1.origin.y)/d, y - h*(c2.origin.x - c1.origin.x)/d)
    ]
}


function circle_intersection_area(c1, c2) {
    let d = distance(c1.origin, c2.origin)
    if (d >= c1.radius + c2.radius) {
        return 0
    }
    if (d <= Math.abs(c1.radius - c2.radius)) {
        if (c1.radius < c2.radius) {
            return Math.PI*c1.radius**2
        }
        return Math.PI*c2.radius**2
    }

    let chord = circle_intersection(c1, c2)
    if (chord.length !== 2) {
        return 0
    }
    let c1_segment = circle_segment_area(c1, chord)
    let c2_segment = circle_segment_area(c2, chord)
    return c1_segment + c2_segment
}

function circle_segment_area(circle, chord) {
    let d = distance(chord[1], chord[0])
    let theta = 2*Math.asin((d/2)/circle.radius)
    let sector = (theta*circle.radius**2)/2
    let h = Math.sqrt(circle.radius**2 - (d/2)**2)
    let triangle = 0.5 * d * h
    if (isNaN(sector - triangle)){
        console.error("err")
    }
    return sector - triangle
}

function search(r0, r1, goal_area) {
    let epsilon = 0.0001
    let left = 0
    let right = r0 + r1
    let current_area
    for (let i = 0; i<1000; i++)  {
        current = left + (right - left) / 2
        let a = new Circle(new Point(-(current/2), 0), r0)
        let b = new Circle(new Point(current/2, 0), r1)
        current_area = circle_intersection_area(a, b)
        if (Math.abs(current_area - goal_area) <= epsilon) {
            return current
        }
        if (current_area > goal_area) {
            left = current
        } else {
            right = current
        }
    }
    console.error(`Was not able to find location 
    distance:${current} 
    goal:${goal_area} 
    area: ${current_area}`)
    return current
}

function intersection_exists(c1, c2) {
    let d = distance(c1.origin, c2.origin)

    if (d >= c1.radius + c2.radius || d <= Math.abs(c1.radius - c2.radius)) {
        return false
    }
    return true
}


function eulerDiagram(data = _config) {
    let a = new Circle()
    let b = new Circle()

    a.radius = Math.sqrt(data.a.probability/Math.PI)
    b.radius = Math.sqrt(data.b.probability/Math.PI)

    let d = search(a.radius, b.radius, data.a_and_b.probability)

    a.origin = new Point(-d/2, 0)
    b.origin = new Point(d/2, 0)

    data.a.origin = a.origin
    data.a.radius = a.radius
    
    data.b.origin = b.origin
    data.b.radius = b.radius


    data.a_and_b.chord = intersection_exists(data.a, data.b) ?  circle_intersection(data.a, data.b) :[]
    return data 
}


