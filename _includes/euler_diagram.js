

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
    } else if (d < Math.abs(c1.radius - c2.radius)) {
        if (c1.radius < c2.radius) {
            return Math.PI*c1.radius**2
        }
        return Math.PI*c2.radius**2
    }
    let chord = circle_intersection_points(c1, c2)
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
    return current
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

function make_circle_path(circle) {
    return `M ${circle.origin.x} ${circle.origin.y} 
            m ${-circle.radius} 0 
            a ${circle.radius} ${circle.radius} 0 1 0 ${2*circle.radius} 0
            a ${circle.radius} ${circle.radius} 0 1 0 ${-2*circle.radius} 0`
}

function make_lense_path(c1, c2) {
    let chord = circle_intersection_points(c1, c2)
    let c1_major = is_major(c1, chord) ? 1 : 0
    let c2_major = is_major(c2, chord) ? 1 : 0
    return `
        M ${chord[0].x} ${chord[0].y}
        A ${c1.radius} ${c1.radius} 0 ${c1_major} 0 ${chord[1].x} ${chord[1].y}
        M ${chord[0].x} ${chord[0].y}
        A ${c2.radius} ${c2.radius} 0 ${c2_major} 1 ${chord[1].x} ${chord[1].y}
        `
}


function eulerData(data = _config) {
    let a = new Circle()
    let b = new Circle()

    a.radius = Math.sqrt(data.a.probability/Math.PI)
    b.radius = Math.sqrt(data.b.probability/Math.PI)
    let d = search(a.radius, b.radius, data.a_and_b.probability)
    a.origin = new Point(-d/2, 0)
    b.origin = new Point(d/2, 0)

    data.a.path = () => make_circle_path(a)
    data.b.path = () => make_circle_path(b)

    let lens_path = ""
    if (data.a_and_b.probability < 0) {
        // no intersection
        lens_path = ""
    } else if (data.a_and_b.probability < data.a.probability &&
               data.a_and_b.probability < data.b.probability) {
        // partial intersection  
        lens_path = make_lense_path(a, b)
    } else {
        // sub set
        if (data.a.probability >= data.b.probability) {
            lens_path  = make_circle_path(b)
        } else {
            lens_path  = make_circle_path(a)
        }
    }
    data.a_and_b.path = function() {
        return lens_path
    }
    return data 
}


function eulerDiagram() {

    function onEnter(enter) {
        let svg = enter.append("svg")
            .attr("width", "50%")
            .attr("viewBox", "0 0 1 1")
        let g = svg.append("g").attr("transform","translate(.5, .5)")
        g.append("g").attr("class", "set-a")
        g.append("g").attr("class", "set-b")
        g.append("g").attr("class", "set-a-and-b")
        return svg
    }

    function chart(selection) {
        selection.each(data => {
            let svg = selection.selectAll("svg")
                .data([data])
                .join(onEnter)
            svg.select("g")
                .select(".set-a")
                .selectAll("path")
                .data([data])
                .join("path")
                .attr("d", d => d.a.path())
            svg.select("g")
                .select(".set-b")
                .selectAll("path")
                .data([data])
                .join("path")
                .attr("d", d => d.b.path())
            svg.select("g")
                .select(".set-a-and-b")
                .selectAll("path")
                .data([data])
                .join("path")
                .attr("d", d => d.a_and_b.path())
        })
    }
    return chart
}