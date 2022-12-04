function _1(md){return(
md`# Plane Sweep for Line segments`
)}

async function _2(FileAttachment,md){return(
md`### Problem
Given a set of line segments find all the intersection points.

### Line Segment Intersection
*  https://en.wikipedia.org/wiki/Intersection_(geometry)#Two_line_segments
![image.png](${await FileAttachment("image.png").url()})

### Applications
* GIS
  * Sewers intersecting parcels
  * Roads intersecting county borders
* Ray shooting
  * Determining if a ray intersects another object

### Sweep Line Algorithm
* Output sensitive algorithm
* https://en.wikipedia.org/wiki/Sweep_line_algorithm
![image@1.png](${await FileAttachment("image@1.png").url()})
`
)}

function _3(md){return(
md`# Demo`
)}

function _step(Inputs,segments){return(
Inputs.button([
  ["Back", value => value === 0 ? 0: value - 1],
  ["Forward", value => value + 1],
  ["Go to begining", value => 0],
  ["Remove all segments", value => {while (segments.length > 0) segments.pop();return 0}],
], {value: 0})
)}

function _5(md){return(
md`Click on two different locations to create a line segment

Green Lines are not in sweep line data structure

Red lines are in the Sweep line data structure

Blue lines are associated with the current event

Pink and Orange are predecessor and successor`
)}

function _6(d3,algo,step,point_buffer,Point,segments,LineSegment,update,draw_event_q,draw_sweep_line_status,draw_descrption)
{  
  const div = d3.create('div')
  
  const svg = div.append("svg")
      .attr("width", 400)
      .attr("height", 400)
      .attr("viewBox", '0 0 400 400')
      .attr("style", "border: 1px solid black");

  const event_queue_viz = div.append("svg")
    .attr("width", 120)
    .attr("height", 400)
    .attr("viewBox", '0 0 100 400')
    .attr("style", "border: 1px solid black");

  const sweep_line_viz = div.append("svg")
    .attr("width", 100)
    .attr("height", 400)
    .attr("viewBox", '0 0 100 400')
      .style('vertical-align', 'top')
      .attr("style", "border: 1px solid black");
  const discription_viz = div.append("div")
      .style('vertical-align', 'top')
      .attr("style", "border: 1px solid black");
  
  var [description, segs, status, events, event, intersections, pred, succ] = algo(step)
  
  svg.on('click', function(i) {
    
    point_buffer.push(new Point(i.offsetX, i.offsetY))
    if (point_buffer.length > 1){
      
      segments.push(new LineSegment(point_buffer[0], point_buffer[1], segments.length))
      while (point_buffer.length > 0) point_buffer.pop()
    }
    var [description, segs, status, events, event, intersections, pred, succ] = algo(step)
    update(svg, description, segs, status, events, event, intersections, pred, succ);
    draw_event_q(event_queue_viz,events, event);
    draw_sweep_line_status(sweep_line_viz, status, event, pred, succ);
      draw_descrption(discription_viz, description)

  });
  
  update(svg, description, segs, status, events, event, intersections, pred, succ);
  draw_event_q(event_queue_viz,events, event)
  draw_sweep_line_status(sweep_line_viz,status, event, pred, succ)
  draw_descrption(discription_viz, description)
  return div.node()
}


function _7(md){return(
md`# Edge cases
* Try to make vertical lines
* Try to place points from right to left`
)}

function _8(md){return(
md`#### Sources

* Professor Slides
* Computational Geometry, Algorithms and applications `
)}

function _draw_event_q(EventType){return(
function draw_event_q(svg, event_q, event) {
  event_q.sort((a,b) => a.x - b.x)
  
  svg.selectAll('text')
    .data([0])
    .join(
      enter => enter.append("text")
      .attr("font-size", '15px')
      .attr("x", 0)
      .attr("y", 20)
      .text("Event Queue") 
    );
  

  const lookup = ["LEFT", "INT.", "RIGHT"]
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
    .attr("x", 5)
    .attr("y", 40)
    .text(`x: ${event.x.toFixed(2)} ${lookup[event.event_type]} ${get_seg(event)}`) 
  }

  svg.append('g').selectAll("text")
    .data(event_q)
    .join('text')
    .attr("font-size", '12px')
    .attr("x", (e,i) => 5)
    .attr("y", (e,i) => 60 + i*20)
    .text(e => `x: ${e.x.toFixed(2)} ${lookup[e.event_type]} ${get_seg(e)}`) 
  return svg.node()
}
)}

function _draw_sweep_line_status(EventType){return(
function draw_sweep_line_status(svg, status, event, pred, succ){
  status.reverse()

  svg.selectAll('text')
    .data([0])
    .join(
      enter => enter.append("text")
      .attr("font-size", '15px')
      .attr("x", 5)
      .attr("y", 20)
      .text("Sweep Line") 
    );
    const t = svg.transition().duration(750);

  var sweepLineText = svg.selectAll(".sweepLineText").data([true]);
  sweepLineText = sweepLineText.enter().append("g").attr("class", "sweepLineText").merge(sweepLineText);
  sweepLineText.selectAll("text")
    .data(status.map(s=>s.name))
    .join(
      enter => enter.append("text")
        .attr("font-size", '13px')
        .attr("x", (e,i) => 10)
        .attr("y", (e,i) => 40 + i*15)
        .text(name => `${name}`),
      update => update
        .attr("y", s => {console.log("asdf"); return 0})
        .call(update => update.transition(t)
              .attr("x", (e, i) => {console.log("asdf"); return i * 16})),
      exit => exit
      .call(exit => exit.transition(t)
            .attr("y", 30)
            .remove())
    )

  
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

function _draw_descrption(){return(
function draw_descrption(div, description) {
  div.selectAll("p")
    .data(description.split('\n'))
    .join('p')
    .text(l => l) 
  div.style("display", "inline-block")
  div.style('vertical-align', 'top')
  return div.node()
}
)}

function _update(point_buffer,step,segments,width,EventType){return(
function update(svg, description, segs, status, events, event, intersections, pred, succ) {


  events.sort((a,b) => a.x - b.x)
  svg.selectAll('circle')
    .data(point_buffer)
    .join(
      enter => enter.append("circle")
      .attr("cx", (p) => p.x)
      .attr("cy", (p) => p.y)
      .attr("r", 5)
    );
  const t = svg.transition().duration(750);
  function is_last(i) {
    return step === 0 && segments.length === i+1 && point_buffer.length !== 1 
  }
  function is_backwards(segs, i) {
    return segs[i] != segments[i]
  }
  function is_vertical(seg) {
    return seg.p.x === seg.q.x
  }
  
  svg.append('g').selectAll('line')
    .data(segments)
    .join(
      enter => enter.append("line")
                    .style("stroke", "lightgreen")
                    .style("stroke-width", 5)
                    .attr("x1", (seg, i) => seg.p.x)
                    .attr("y1", (seg, i) => seg.p.y)
                    .attr("x2", (seg, i) => seg.q.x)
                    .attr("y2", (seg, i) => seg.q.y)
          .call(enter => enter.transition(t)
                .attr("transform-origin", seg => `${(seg.p.x + seg.q.x)/2} ${(seg.p.y + seg.q.y)/2}`)
                .attr("transform", (seg, i) => {
                  if (is_last(i) && is_backwards(segs, i)){
                    return "rotate(180)"
                  } else if (is_last(i) && is_vertical(seg) && seg.p.y > seg.q.y){
                    return "rotate(20) "
                  } else if (is_last(i) && is_vertical(seg) && seg.p.y < seg.q.y){
                    return "rotate(-20) "
                  }
                  return "rotate(0)"
                })
                .transition(t)
                .attr("transform-origin", seg => `${(seg.p.x + seg.q.x)/2} ${(seg.p.y + seg.q.y)/2}`)
                .attr("transform", (seg, i) => {
                  if (is_last(i) && is_backwards(segs, i)){
                    return "rotate(180)"
                  } else if (is_last(i) && is_vertical(seg) && seg.p.y > seg.q.y){
                    return "rotate(0) "
                  } else if (is_last(i) && is_vertical(seg) && seg.p.y < seg.q.y){
                    return "rotate(0) "
                  }
                  return "rotate(0)"
                })
               ),
    );
  
  svg.append('g').selectAll('line')
    .data(events)
    .join(
      enter => enter.append("line")
          .style("stroke", e => ['red', 'black','green'][e.event_type])
          .attr('stroke-dasharray', 3)
          .attr('stroke-width', 2)
          .attr("x1", e => e.x)
          .attr("y1", e => 0)
          .attr("x2", e => e.x)
          .attr("y2", e => width)
    );

    svg.append('g').selectAll("line")
    .data(status)
    .join(
      enter => enter.append('line')
        .style("stroke", "red")
        .style("stroke-width", 5)
        .attr("x1", seg => seg.p.x)
        .attr("y1", seg => seg.p.y)
        .attr("x2", seg => seg.q.x)
        .attr("y2", seg => seg.q.y)
    )

  if (event) {
    var current_segments = []
    if (EventType.INTERSECTION === event.event_type){
      var [s1,s2,intersection] = event.segments
      current_segments = [s1,s2]
    } else {
      var [s1] = event.segments
      current_segments = [s1]
    }
    svg.append('g').selectAll('line')
    .data(current_segments)
    .join(
      enter => enter.append('line')
          .style("stroke", "blue")
          .style("stroke-width", 5)
          .attr("x1", seg => seg.p.x)
          .attr("y1", seg => seg.p.y)
          .attr("x2", seg => seg.q.x)
          .attr("y2", seg => seg.q.y)
    )
  }



      if (pred){
    svg.append('g').selectAll('line')
    .data([pred])
    .join('line')
    .style("stroke", "orange")
    .style("stroke-width", 5)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);}

    if (succ){
    svg.append('g').selectAll('line')
    .data([succ])
    .join('line')
    .style("stroke", "pink")
    .style("stroke-width", 5)
    .attr("x1", seg => seg.p.x)
    .attr("y1", seg => seg.p.y)
    .attr("x2", seg => seg.q.x)
    .attr("y2", seg => seg.q.y);
    }
  
    svg.append('g').selectAll('circle')
    .data(intersections)
    .join('circle')
    .attr("cx", (e,i) => e[0].x)
    .attr("cy", (e,i) => e[0].y)
    .attr("r", (e,i) =>  5);

  svg.append('g').selectAll("text")
    .data(segments)
    .join('text')
    .attr("font-size", '20px')
    .attr("x", seg => seg.p.x)
    .attr("y", seg => seg.p.y)
    .text(seg => seg.name);
  


}
)}

function _algo(PriorityQueue,segments,LineSegment,Event,EventType,SweepLine,segment_intersection){return(
function algo(show_step){
  var description = ""
  var step = 0
  const q = new PriorityQueue()

  var segments_sorted = segments.map(seg => {
    if (seg.p.x <= seg.q.x){
      return seg
    }
    var new_seg = new LineSegment(seg.q, seg.p, 0);
    new_seg.name = seg.name
    return new_seg 
  })
  segments_sorted.forEach(seg => {
    q.push(new Event(seg.p.x, EventType.LEFT, [seg]))
    q.push(new Event(seg.q.x, EventType.RIGHT, [seg]))
  })
  const intersections = new Set()

  var sweep_line = new SweepLine()
  var pred = null;
  var succ = null;
  if (show_step <= step){
    return [description, segments_sorted, sweep_line.status, q.toArray(), null, intersections, pred, succ]
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
        var [bot, top] = [s1, s2].sort((a,b) => b.y(event.x-1) - a.y(event.x-1))
        description += `Intersection between ${bot.name} and ${top.name}\n`
        description += `Swap ${bot.name} and ${top.name}\n`
        intersections.add([intersection,`${bot.name}-${top.name}`])
        sweep_line.swap(bot, top);
        pred = sweep_line.find(top, -1)
        succ = sweep_line.find(bot, 1)

        description += `Comparing bot: ${bot.name} and succ: ${succ ? succ.name: null}\n`
        description += `Comparing top: ${top.name} and succ: ${pred? pred.name: null}\n`
        
        var s1_succ = segment_intersection(bot, succ);
        if (s1_succ) {
          q.push(new Event(s1_succ.x, EventType.INTERSECTION, [succ, bot, s1_succ]))
          description += "Intersection " + bot.name + " " + succ.name + " (succ)" + " " + s1_succ.x.toFixed(2) +" "+ s1_succ.y.toFixed(2) + "\n"
        }

        var s2_pred = segment_intersection(top, pred);
        if (s2_pred) {
          q.push(new Event(s2_pred.x, EventType.INTERSECTION, [top, pred, s2_pred]))
          description += "Intersection " + top.name + " " + pred.name + " (pred)" + " " + s2_pred.x.toFixed(2) +" "+ s2_pred.y.toFixed(2) + "\n"
        }
        break;
    }
    step += 1
    if (show_step <= step){
      return [description, segments_sorted, sweep_line.status, q.toArray(), event,intersections, pred, succ]
    }
  }
  return [description, segments_sorted, sweep_line.status, q.toArray(), null, intersections, pred, succ]

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
    if (this.m === -Infinity){
      this.m = 50
    } else if (this.m === Infinity){
      this.m = -50
    }
    this.b = (p.y - this.m * p.x)
    this.name = String.fromCharCode(name+65)
  }
  y(x){
    return this.m * x + this.b
  }
}
)}

function _EventType()
{
  return {LEFT:0, RIGHT:2, INTERSECTION:1}
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
    this.q = new Heap.Heap((a, b) => {
      if (a.x - b.x === 0){
        return a.event_type - b.event_type
      } else {
        return a.x - b.x
      }
    })
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

function _point_buffer(){return(
[]
)}

function _segments(){return(
[]
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["image.png", {url: new URL("./files/4d843f8320152f6c1eb0323829cac47680b7b4cd97d509def9a844ebdcd832c1e39550d9feeecf8bd90c4fbe6f56fde4fb8c5c24fb54226945be31dc26b92edb.png", import.meta.url), mimeType: "image/png", toString}],
    ["image@1.png", {url: new URL("./files/b2bb4aa75b53f1a6079bb6523922fc3303a7337c0076ecad0ec6e63ae1bbc4793c11ef31af976f209bc542d97c914ee2b443138d3906b218267a3f30aad3d887.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["FileAttachment","md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof step")).define("viewof step", ["Inputs","segments"], _step);
  main.variable(observer("step")).define("step", ["Generators", "viewof step"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["d3","algo","step","point_buffer","Point","segments","LineSegment","update","draw_event_q","draw_sweep_line_status","draw_descrption"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("draw_event_q")).define("draw_event_q", ["EventType"], _draw_event_q);
  main.variable(observer("draw_sweep_line_status")).define("draw_sweep_line_status", ["EventType"], _draw_sweep_line_status);
  main.variable(observer("draw_descrption")).define("draw_descrption", _draw_descrption);
  main.variable(observer("update")).define("update", ["point_buffer","step","segments","width","EventType"], _update);
  main.variable(observer("algo")).define("algo", ["PriorityQueue","segments","LineSegment","Event","EventType","SweepLine","segment_intersection"], _algo);
  main.variable(observer("Point")).define("Point", _Point);
  main.variable(observer("LineSegment")).define("LineSegment", _LineSegment);
  main.variable(observer("EventType")).define("EventType", _EventType);
  main.variable(observer("Event")).define("Event", ["EventType"], _Event);
  main.variable(observer("Heap")).define("Heap", ["require"], _Heap);
  main.variable(observer("PriorityQueue")).define("PriorityQueue", ["Heap"], _PriorityQueue);
  main.variable(observer("SweepLine")).define("SweepLine", _SweepLine);
  main.variable(observer("segment_intersection")).define("segment_intersection", ["intersects","get_intersection"], _segment_intersection);
  main.variable(observer("get_intersection")).define("get_intersection", ["Point"], _get_intersection);
  main.variable(observer("intersects")).define("intersects", _intersects);
  main.variable(observer("point_buffer")).define("point_buffer", _point_buffer);
  main.variable(observer("segments")).define("segments", _segments);
  return main;
}
