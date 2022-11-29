function _1(md){return(
md`# Plane Sweep Line Segments`
)}

function _step(Inputs){return(
Inputs.button([
  ["Back", value => value === 0 ? 0: value - 1],
  ["Forward", value => value + 1],
  ["Reset", value => 0]
], {value: 0})
)}

function _3(d3,algo,step,XMLSerializer,draw,draw_event_q,draw_sweep_line_status,draw_intersection_list,draw_descrption)
{

  const div = d3.create("div")
  var [description, segments, status, events, event, intersections, pred, succ] = algo(step)
  console.log(description)
  const s = new XMLSerializer()
  const viz_xml = s.serializeToString(draw(segments, status, events, event, pred, succ, intersections))
  const viz_event_q = s.serializeToString(draw_event_q(events, event))
  const viz_sweep_line_status = s.serializeToString(draw_sweep_line_status(status, event, pred, succ))
  const viz_intersection_list = s.serializeToString(draw_intersection_list(intersections))
  const viz_description = s.serializeToString(draw_descrption(description))
  
  div.append('span').html(viz_xml)
  div.append('span').html(viz_event_q)
  div.append('span').html(viz_sweep_line_status)
  div.append('span').html(viz_intersection_list)
  div.append('span').html(viz_description)

  return div.node()

  // return draw(segments, status, events, event)
}


function _algo(PriorityQueue,segments,Event,EventType,SweepLine,segment_intersection){return(
function algo (show_step){
  // console.log('INVOCATION')
  var description = ""
  var step = 0
  // Init event queue 
  const q = new PriorityQueue()
  segments.forEach(seg => {
    q.push(new Event(seg.p.x, EventType.LEFT, [seg]))
    q.push(new Event(seg.q.x, EventType.RIGHT, [seg]))
  })
  const intersections = new Set()

  var sweep_line = new SweepLine()
  var pred = null;
  var succ = null;
  if (show_step <= step){
    return [description, segments, sweep_line.status, q.toArray(), null, intersections, pred, succ]
  }

  while (!q.isEmpty()) {
    description = ""
    pred = null;
    succ = null;
    var event = q.pop()      
    switch (event.event_type) {
      case EventType.LEFT:
        var [s1] = event.segments;
        description += `Line Segment ${s1.name} entered the SweepLine DS\n`
        sweep_line.insert(s1, event.x);
        pred = sweep_line.find(s1, -1)
        succ = sweep_line.find(s1, 1)
        description += `Comparing ${s1.name} and pred: ${pred ? pred.name: null} (orange)\n`
        description += `Comparing ${s1.name} and succ: ${succ? succ.name: null} (pink)\n`
        var s1_pred = segment_intersection(s1, pred);
        if (s1_pred) {
          q.push(new Event(s1_pred.x, EventType.INTERSECTION, [pred, s1, s1_pred]))
          description += "Intersection at " + s1.name + " " + pred.name + " (pred)" + " " + s1_pred.x.toFixed(2) +" "+ s1_pred.y.toFixed(2) +"\n"
        }
        var s1_succ = segment_intersection(s1, succ);
        if (s1_succ) {
          q.push(new Event(s1_succ.x, EventType.INTERSECTION, [s1, succ, s1_succ]))
          description += "Intersection at " + s1.name + " " + succ.name + " (succ)" + " " + s1_succ.str() +"\n"
        }
        break;
      case EventType.RIGHT:
        var [segment] = event.segments
        description += `Line Segment ${segment.name} exited the SweepLine DS\n`
        pred = sweep_line.find(segment, -1)
        succ = sweep_line.find(segment, 1)
        sweep_line.delete(segment)
        var pred_succ = segment_intersection(pred, succ)
        description += `Comparing pred:${pred ? pred.name: null} and succ:${succ ? succ.name: null}  \n`
        if (pred_succ) {
          q.push(new Event(pred_succ.x, EventType.INTERSECTION, [succ, pred, pred_succ]))
          description += "Adding Intersection to Event Queue " + pred.name + " (pred) " + succ.name + " (succ)" + " " + pred_succ.str() +"\n"
        }
        break;
      case EventType.INTERSECTION:
        var [s1, s2, intersection] = event.segments
        var [s1, s2] = [s1, s2].sort((a,b) => b.p.y - a.p.y)
        description += `Intersection between ${s1.name} and ${s2.name}\n`
        description += `Swap ${s1.name} and ${s2.name}\n`
        intersections.add([intersection,`${s1.name}-${s2.name}`])
        sweep_line.swap(s1, s2);
        pred = sweep_line.find(s2, -1)
        succ = sweep_line.find(s1, 1)

        description += `Comparing s1: ${s1.name} and succ: ${succ ? succ.name: null}\n`
        description += `Comparing s2: ${s2.name} and succ: ${pred? pred.name: null}\n`
        
        var s1_succ = segment_intersection(s1, succ);
        if (s1_succ) {
          q.push(new Event(s1_succ.x, EventType.INTERSECTION, [succ, s1, s1_succ]))
          description += "Intersection " + s1.name + " " + succ.name + " (succ)" + " " + s1_succ.x.toFixed(2) +" "+ s1_succ.y.toFixed(2) + "\n"
        }

        var s2_pred = segment_intersection(s2, pred);
        if (s2_pred) {
          q.push(new Event(s2_pred.x, EventType.INTERSECTION, [s2, pred, s2_pred]))
          description += "Intersection " + s2.name + " " + pred.name + " (pred)" + " " + s2_pred.x.toFixed(2) +" "+ s2_pred.y.toFixed(2) + "\n"
        }
        break;
    }
    step += 1
    if (show_step <= step){
      return [description, segments, sweep_line.status, q.toArray(), event,intersections, pred, succ]
    }
  }
  return [description, segments, sweep_line.status, q.toArray(), null, intersections, pred, succ]
}
)}

function _Point(){return(
class Point {
    constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  str(){
    return `(${this.x.toFixed(2)},${this.y.toFixed(2)})`
  }
}
)}

function _LineSegment(){return(
class LineSegment {
  constructor(p, q, name) {
    this.p = p;
    this.q = q;
    this.m = (p.y - q.y)/(p.x - q.x)
    this.b = (p.y - this.m * p.x)
    this.name = String.fromCharCode(name+65)
  }
  y(x){
    return this.m * x + this.b
  }
}
)}

function _draw(d3,width,EventType){return(
function draw (segments, active, events, event, pred, succ, intersections){
      console.log("a")

  const svg = d3.create("svg")
      .attr("width", 500)
      .attr("height", 500)
      .attr("viewBox", '0 0 100 100');
 console.log("b")

  svg.append('g').selectAll("line")
    .data(segments)
    .join('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 1)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);
console.log("c")

  
  svg.append('g').selectAll("line")
    .data(active)
    .join('line')
    .style("stroke", "red")
    .style("stroke-width", 1)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);
console.log("d")

  svg.append('g').selectAll('line')
    .data(events)
    .join('line')
    .style("stroke", e => ['red','green', 'black'][e.event_type])
    .attr('stroke-dasharray', 1)
    .attr('stroke-width', .2)
    .attr("x1", e => e.x)
    .attr("y1", e => 0)
    .attr("x2", e => e.x)
    .attr("y2", e => width);
 console.log("e")

  svg.append('g').selectAll("text")
    .data(segments)
    .join('text')
    .attr("font-size", '3px')
    .attr("x", seg => seg.p.x)
    .attr("y", seg => seg.p.y)
    .text(seg => seg.name);
console.log("f")

  if (event) {
    svg.append('g').selectAll('line').data([event])
      .join('line')
      .style("stroke", 'black')
      .attr('stroke-width', .1)
      .attr("x1", e => e.x)
      .attr("y1", e => 0)
      .attr("x2", e => e.x)
      .attr("y2", e => width);

    var segments = []
    if (EventType.INTERSECTION === event.event_type){
      var [s1,s2,intersection] = event.segments
      segments = [s1,s2]
    } else {
      var [s1] = event.segments
      segments = [s1]
    }
    svg.append('g').selectAll('line')
    .data(segments)
    .join('line')
    .style("stroke", "blue")
    .style("stroke-width", 1)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);
  }
  
console.log("g")


  
console.log("h")

    if (pred){
    svg.append('g').selectAll('line')
    .data([pred])
    .join('line')
    .style("stroke", "orange")
    .style("stroke-width", 1)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);}

    if (succ){
    svg.append('g').selectAll('line')
    .data([succ])
    .join('line')
    .style("stroke", "pink")
    .style("stroke-width", 1)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);
    }
console.log("i")
    svg.append('g').selectAll('line')
    .data(intersections)
    .join('circle')
    .attr("cx", (e,i) => e[0].x)
    .attr("cy", (e,i) => e[0].y)
    .attr("r", (e,i) =>  1);
  

  return svg.node()
}
)}

function _draw_event_q(d3,EventType){return(
function draw_event_q(event_q, event) {
  event_q.sort((a,b) => a.x - b.x)
  const svg = d3.create("svg")
    .attr("width", 120)
    .attr("height", 400)
    .attr("viewBox", '0 0 100 400')
    .style('vertical-align', 'top')
  svg.append('g')
    .append('text')
    .attr("font-size", '15px')
    .attr("x", 0)
    .attr("y", 20)
    .text("Event Queue") 

  const lookup = ["LEFT","RIGHT", "INT."]
  function get_seg(e) {
    if (EventType.INTERSECTION === e.event_type) {
      return e.segments[0].name + " " + e.segments[1].name
    }
    return e.segments[0].name
  }
  if (event) {
    svg.append('g')
    .append('text')
    .attr("font-size", '12px')
    .attr("font-weight","bold")
    .attr("x", 10)
    .attr("y", 40)
    .text(`x: ${event.x.toFixed(2)} ${lookup[event.event_type]} ${get_seg(event)}`) 
  }

  svg.append('g').selectAll("text")
    .data(event_q)
    .join('text')
    .attr("font-size", '12px')
    .attr("x", (e,i) => 10)
    .attr("y", (e,i) => 60 + i*20)
    .text(e => `x: ${e.x.toFixed(2)} ${lookup[e.event_type]} ${get_seg(e)}`) 
  return svg.node()
}
)}

function _draw_sweep_line_status(d3,EventType){return(
function draw_sweep_line_status(status, event, pred, succ){
  status.reverse()
    const svg = d3.create("svg")
    .attr("width", 100)
    .attr("height", 400)
    .attr("viewBox", '0 0 100 400')
      .style('vertical-align', 'top')

  svg.append('g')
    .append('text')
    .attr("font-size", '15px')
    .attr("x", 0)
    .attr("y", 20)
    .text("Sweep Line")
  svg.append('g').selectAll("text")
    .data(status)
    .join('text')
    .attr("font-size", '13px')
    .attr("x", (e,i) => 10)
    .attr("y", (e,i) => 40 + i*15)
    .text(seg => `${seg.name}`) 
 const lookup = ["LEFT","RIGHT", "INT."]
  const current = [];
  if (event){
    if (EventType.INTERSECTION === event.event_type) {
      current.push(event.segments[1].name)
    }
    current.push(event.segments[0].name)
  }

  function getSegColor(name){
    if (current.includes(name)){
      return 'blue'
    } else if (pred && pred.name === name){
        return 'orange'
    } else if (succ && succ.name === name){
      return 'pink'
    } else {
      return 'red'
    }
  }
  
  function get_seg(e) {
    if (EventType.INTERSECTION === e.event_type) {
      return e.segments[0].name + " " + e.segments[1].name
    }
    return e.segments[0].name
  }
    svg.append('g').selectAll("text")
    .data(status)
    .join('line')
    .style("stroke", seg => `${getSegColor(seg.name)}`)
    .style("stroke-width", 3)
    .attr("x1", (e,i) => 30)
    .attr("y1", (e,i) => 35 + i*15)
    .attr("x2", (e,i) => 70)
    .attr("y2", (e,i) => 35 + i*15)
  
  return svg.node()
}
)}

function _draw_intersection_list(d3){return(
function draw_intersection_list(intersections){
    const svg = d3.create("svg")
    .attr("width", 100)
    .attr("height", 400)
    .attr("viewBox", '0 0 100 400')
      .style('vertical-align', 'top')

  svg.append('g')
    .append('text')
    .attr("font-size", '15px')
    .attr("x", 0)
    .attr("y", 20)
    .text("Intersections")
  svg.append('g').selectAll("text")
    .data(intersections)
    .join('text')
    .attr("font-size", '10px')
    .attr("x", (e,i) => 10)
    .attr("y", (e,i) => 40 + i*10)
    .text(i => `${i[1]} ${i[0].str()}`) 
  return svg.node()
}
)}

function _draw_descrption(d3){return(
function draw_descrption(description) {
  const div = d3.create("span")
  div.selectAll("p")
    .data(description.split('\n'))
    .join('p')
    .text(l => l) 
  div.style("display", "inline-block")
  div.style('vertical-align', 'top')
  return div.node()
}
)}

function _EventType()
{
  return {LEFT:0, RIGHT:1, INTERSECTION:2}
}


function _Event(EventType){return(
class Event {
    constructor(x, event_type, segments) {
      this.x = x
      this.event_type = event_type
      this.segments = segments
  }
  str(){
    var segs = ""
    if (EventType.INTERSECTION === this.event_type){
      if (this.segments[0].name > this.segments[1].name) {
        segs = `${this.segments[0].name}${this.segments[1].name}`
      } else {
        segs = `${this.segments[1].name}${this.segments[0].name}`
      }
    } else {
      segs = `${this.segments[0].name}`
    }
    return `${this.event_type} ${segs}`
  }
}
)}

function _Heap(require){return(
require('heap-js')
)}

function _PriorityQueue(Heap){return(
class PriorityQueue {
  constructor() {
    this.q = new Heap.Heap((a, b) => a.x - b.x)
    this.seen = new Set()
  }
  push(element) {
    if (this.seen.has(element.str())){
      return null
    }
    this.seen.add(element.str())
    return this.q.push(element)
  }
  toArray(){
    return this.q.toArray()
  }
  isEmpty(){
    return this.q.isEmpty()
  }
  pop(){
    return this.q.pop() 
  }
}
)}

function _SweepLine(){return(
class SweepLine {
  constructor() {
      this.status = []
  }

  swap(a,b) {
    const ai = this.status.indexOf(a);
    const bi = this.status.indexOf(b);
    const t = this.status[ai];
    this.status[ai] = b;
    this.status[bi] = t;
  }
  insert(element, x) {
    this.status.push(element)
    this.status.sort((a,b) => {
      return b.y(x) - a.y(x)
    })
  }
  find(element, delta){
    const i = this.status.indexOf(element)
    const key = i+delta
    if (key >= this.status.length || key < 0){
      return null
    }
    return this.status[key]
  }
  delete(element){
    const index = this.status.indexOf(element)
    this.status.splice(index, 1)
  }
}
)}

function _datapoints(){return(
`10
10 57 79 46
12 32 95 19
44 8 14 70
97 74 68 17
50 25 14 65
61 11 16 6
26 94 53 31
100 53 25 21
81 99 16 98
35 78 70 93`
)}

function _segments(datapoints,LineSegment,Point){return(
datapoints.split('\n').slice(1).map(t => t.split(' ').map(parseFloat)).map(d => new LineSegment(new Point(d[0], d[1]), new Point(d[2], d[3]))).map((seg,i) => seg.p.x < seg.q.x ? new LineSegment(seg.p, seg.q, i) : new LineSegment(seg.q, seg.p, i))
)}

function _intersects(){return(
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}
)}

function _get_intersection(Point){return(
function get_intersection(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

  // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return new Point(x,y)
}
)}

function _segment_intersection(intersects,get_intersection){return(
function segment_intersection(s1,s2) {
  if (s1 && s2) {
    if (intersects(s1.p.x, s1.p.y, s1.q.x, s1.q.y, s2.p.x, s2.p.y, s2.q.x, s2.q.y)){
      return get_intersection(s1.p.x, s1.p.y, s1.q.x, s1.q.y, s2.p.x, s2.p.y, s2.q.x, s2.q.y)
    }
  }
  return false
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof step")).define("viewof step", ["Inputs"], _step);
  main.variable(observer("step")).define("step", ["Generators", "viewof step"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","algo","step","XMLSerializer","draw","draw_event_q","draw_sweep_line_status","draw_intersection_list","draw_descrption"], _3);
  main.variable(observer("algo")).define("algo", ["PriorityQueue","segments","Event","EventType","SweepLine","segment_intersection"], _algo);
  main.variable(observer("Point")).define("Point", _Point);
  main.variable(observer("LineSegment")).define("LineSegment", _LineSegment);
  main.variable(observer("draw")).define("draw", ["d3","width","EventType"], _draw);
  main.variable(observer("draw_event_q")).define("draw_event_q", ["d3","EventType"], _draw_event_q);
  main.variable(observer("draw_sweep_line_status")).define("draw_sweep_line_status", ["d3","EventType"], _draw_sweep_line_status);
  main.variable(observer("draw_intersection_list")).define("draw_intersection_list", ["d3"], _draw_intersection_list);
  main.variable(observer("draw_descrption")).define("draw_descrption", ["d3"], _draw_descrption);
  main.variable(observer("EventType")).define("EventType", _EventType);
  main.variable(observer("Event")).define("Event", ["EventType"], _Event);
  main.variable(observer("Heap")).define("Heap", ["require"], _Heap);
  main.variable(observer("PriorityQueue")).define("PriorityQueue", ["Heap"], _PriorityQueue);
  main.variable(observer("SweepLine")).define("SweepLine", _SweepLine);
  main.variable(observer("datapoints")).define("datapoints", _datapoints);
  main.variable(observer("segments")).define("segments", ["datapoints","LineSegment","Point"], _segments);
  main.variable(observer("intersects")).define("intersects", _intersects);
  main.variable(observer("get_intersection")).define("get_intersection", ["Point"], _get_intersection);
  main.variable(observer("segment_intersection")).define("segment_intersection", ["intersects","get_intersection"], _segment_intersection);
  return main;
}
