let start = false
let size = 20
let height = Math.floor(innerHeight/30)
let width = Math.floor(innerWidth/40)

let start_point = [Math.floor(height/2) - 1, Math.floor(width/4)]
let end_point = [Math.floor(height/2) - 1, width - Math.floor(width/4) - 1]

let setting_start_point = false;
let setting_end_point = false;

let matrix = []

let p_queue = [start_point];
let point_found = false;

let final_path = []

function setup() {
  matrix = []
  final_path = []
  for (let i = 0; i < height; i++) {
    matrix.push([])
    for (let j = 0; j < width; j++) {
      matrix[i].push(0)
    }
  }
  p_queue = [start_point];
  point_found = false;

  background('#212528');
  let renderer = createCanvas(width*20, height*20);
  renderer.parent("sketch-container");
  fill('#212528');
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      stroke(0, 0, 0, 0);
      strokeWeight(0);
      if (x == start_point[0] && y == start_point[1]) {
        fill('#007bff');
        square(y * 20, x * 20, 20);
        fill('#212528');
        matrix[x][y] = 100;
      } else if (x == end_point[0] && y == end_point[1]) {
        fill(255, 255, 0);
        square(y * 20, x * 20, 20);
        fill('#212528');
      } else {
        square(y * 20, x * 20, 20);
      }
    }
  }
}

function distance(p) {
  return Math.abs(end_point[0] - p[0]) + Math.abs(end_point[1] - p[1]);
}

function dinsert(p) {
  let i = 0
  while (i < p_queue.length && distance(p) + p.length/2 > distance(p_queue[i]) + p_queue[i].length/2) i++;
  p_queue.splice(i, 0, p);
}

function draw() {
  if (!point_found && p_queue.length > 0 && start) {
    let cy = p_queue[0][0];
    let cx = p_queue[0][1];
    if (cy == end_point[0] && cx == end_point[1]) {
      point_found = true;
      fill('#28a745');
      square(cx * 20, cy * 20, 20);
      final_path = p_queue[0].slice(2, p_queue[0].length - 2)
    } else {
      let cur_path = p_queue[0]
      p_queue.shift()
      for (let i = -1; i < 2; i += 2) {        
        fill('#1b1f22')
        if (in_bounds(cy + i, cx) && matrix[cy + i][cx] == 0) {
          dinsert([cy + i, cx].concat(cur_path))
          matrix[cy + i][cx] = 1;
          square(cx * 20, (cy + i) * 20, 20, 7);
        }
        if (in_bounds(cy, cx + i) && matrix[cy][cx + i] == 0) {
          dinsert([cy, cx + i].concat(cur_path))
          matrix[cy][cx + i] = 1;
          square((cx + i) * 20, cy * 20, 20, 7);
        }
      }
      if (!(cy == start_point[0] && cx == start_point[1])) {
        fill('#16191c');
        square(cx * 20, cy * 20, 20);
      }
    }
  } else if (point_found && final_path.length > 0) {
    fill('#ffc107')
    square(final_path[final_path.length - 1] * 20, final_path[final_path.length - 2] * 20, 20);
    final_path.pop()
    final_path.pop()
  }
}

const get_point = (x, y) => {
  return [Math.floor(y/20), Math.floor(x/20)]
}

const is_start_point = (p) => {
  return (p[0] == start_point[0] && p[1] == start_point[1])
}

const is_end_point = (p) => {
  return (p[0] == end_point[0] && p[1] == end_point[1])
}

const set_start_point = (p) => {
  fill('#212528');
  matrix[start_point[0]][start_point[1]] = 0;
  square(start_point[1] * 20, start_point[0] * 20, 20);
  start_point = p
  p_queue = [start_point]
  fill('#007bff');
  square(p[1] * 20, p[0] * 20, 20);
  matrix[p[0]][p[1]] = 100;
}
const set_end_point = (p) => {
  fill('#212528');
  matrix[end_point[0]][end_point[1]] = 0;
  square(end_point[1] * 20, end_point[0] * 20, 20);
  end_point = p
  fill(255, 255, 0);
  square(p[1] * 20, p[0] * 20, 20);
  matrix[p[0]][p[1]] = 0;
}

function mousePressed() {
  if (mouseX >= 0 && mouseY >= 0 && mouseX < 20*width && mouseY < 20*height) {
    let p = get_point(mouseX, mouseY)
    if (is_start_point(p)) {
      setting_start_point = true
    }
    else if (is_end_point(p)) {
      setting_end_point = true
    }
  }
}

function mouseReleased() {
  if (mouseX >= 0 && mouseY >= 0 && mouseX < 20*width && mouseY < 20*height) {
    let p = get_point(mouseX, mouseY)
    if (setting_start_point) {
      set_start_point(p)
      setting_start_point = false
    } else if (setting_end_point) {
      set_end_point(p)
      setting_end_point = false
    }
  }
}

function mouseDragged() {
  if (mouseX >= 0 && mouseY >= 0 && mouseX < 20*width && mouseY < 20*height) {
    let p = get_point(mouseX, mouseY)
    if (!is_start_point(p) && !is_end_point(p) && !setting_start_point && !setting_end_point) {
      matrix[p[0]][p[1]] = 10
      fill('#dc3545')
      square(p[1] * 20, p[0] * 20, 20);
    } else if (setting_end_point) {
      set_end_point(p)
    } else if (setting_start_point) {
      set_start_point(p)
    }
  }
}

function in_bounds(y, x) {
  if (y < 0 || x < 0 || y >= height || x >= width) {
    return false;
  }
  return true;
}

document.getElementById("start").onclick = () => {
  if (point_found || p_queue.length == 0) {
    point_found = false
    p_queue = [start_point]
    fill('#212528')
    for (let y = 0; y < width; y++) {
      for (let x = 0; x < height; x++) {
        if (matrix[x][y] == 1) {
          matrix[x][y] = 0
          square(y * 20, x * 20, 20);
        }
      }
    }
    fill(255, 255, 0);
    square(end_point[1] * 20, end_point[0] * 20, 20);
  }
  start = true
};

document.getElementById("reset").onclick = () => {
  setup()
  start = false
};