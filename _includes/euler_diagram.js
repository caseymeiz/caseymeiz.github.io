

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

function circle_intersection_points(c1, c2) {
    let d = distance(c1.origin, c2.origin)
    let x = (d**2 - c2.radius**2 + c1.radius**2)/(2*d)
    let a = (1/d) * Math.sqrt(
        (-d + c2.radius - c1.radius) *
        (-d - c2.radius + c1.radius) *
        (-d + c2.radius + c1.radius) *
        ( d + c2.radius + c1.radius))
    let y = a/2
    return [
        new Point(x - (d/2),  y),
        new Point(x - (d/2), -y)
    ]
}


function circle_intersection_area(c1, c2) {
    let d = distance(c1.origin, c2.origin)
    if (d >= c1.radius + c2.radius) {
        return 0
    }
    if (d < Math.abs(c1.radius - c2.radius)) {
        if (c1.radius < c2.radius) {
            return Math.PI*c1.radius**2
        }
        return Math.PI*c2.radius**2
    }

    let chord = circle_intersection_points(c1, c2)
    if (chord.length !== 2) {
        return 0
    }
    let c1_segment = circle_segment_area(c1, chord)
    let c2_segment = circle_segment_area(c2, chord)
    return c1_segment + c2_segment
}

function is_major(circle, chord) {
    if ((circle.origin.x > 0 && chord[0].x > circle.origin.x) || 
        (circle.origin.x < 0 && chord[0].x < circle.origin.x)) {
        return true
    }
    return false
}

function circle_segment_area(circle, chord) {
    let d = distance(chord[1], chord[0])
    let theta = 2*Math.asin((d/2)/circle.radius)
    let sector = (theta*circle.radius**2)/2
    let h = Math.sqrt(circle.radius**2 - (d/2)**2)
    let triangle = 0.5 * d * h
    if (is_major(circle, chord)) {
        sector = Math.PI*circle.radius**2 - sector
        return sector + triangle
    }
    return sector - triangle
}

function search(r0, r1, goal_area) {
    let epsilon = 0.0001
    let left = 0
    let right = r0 + r1
    let current_area
    for (let i = 0; i<50; i++)  {
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

function circle_intersection_exists(c1, c2) {
    let d = distance(c1.origin, c2.origin)

    if (d >= c1.radius + c2.radius || d < Math.abs(c1.radius - c2.radius)) {
        return false
    }
    return true
}

function is_valid(data) {
    if (1 < data.a.probability + data.b.probability) {
        return [false, `error: P(A) + P(B) is more than 1.`]
    }
    if (data.a.probability < data.a_and_b.probability) {
        return [false, `error: P(A and B) is larger  P(A)`]
    }
    if (data.b.probability < data.a_and_b.probability) {
        return [false, `error: P(A and B) is larger  P(B)`]
    }
    return [true, ""]
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

    if (d <= Math.abs(a.radius - b.radius)) {
        if (a.radius > b.radius) {
            data.a_and_b.chord = [new Point(b.origin.x, b.radius), new Point(b.origin.x, -b.radius)]
            data.a_and_b.a_major = true
            data.a_and_b.b_major = true
            data.a_and_b.radius = b.radius
        } else {
            data.a_and_b.chord = [new Point(a.origin.x, a.radius), new Point(a.origin.x, -a.radius)]
            data.a_and_b.a_major = true
            data.a_and_b.b_major = true
            data.a_and_b.radius = a.radius        
        }
    } else if (d >= a.radius + b.radius) {
        data.a_and_b.chord = [new Point(0, 1), new Point(0, -1)]
        data.a_and_b.a_major = true
        data.a_and_b.b_major = true
        data.a_and_b.radius = 1
    } else {
        data.a_and_b.chord = circle_intersection_points(data.a, data.b)
        data.a_and_b.a_major = is_major(a, data.a_and_b.chord)
        data.a_and_b.b_major = is_major(b, data.a_and_b.chord)
    }

    return data 
}


