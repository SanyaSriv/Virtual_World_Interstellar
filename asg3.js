// Vertex shader program
// removing the global scale matrix (u_GlobalScaleMatrix) from this for now
var VSHADER_SOURCE =
  `precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ViewMatrix * u_ProjectionMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
  }`;

// declaring the global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_PointSize;
let u_FragColor;
let g_globalAngle = 0;
let g_globalAngleVertical = 0;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_ModelMatrix = [];
let leg_vertical_movement = 0;
let arm_vertical_movement = 0;
let arm_horizontal_movement = 0;
let neck_front_back = 0;
let left_forearm_rotation = 0;
let left_forearm_scale = 100;
let hand_open_close_movement = 0;
let hand_rotation = 0;
let upper_neck_rotation = 0;
let global_scale = 100;
let special_shift_animation = 0;
let mouse_rotate_x = 0;
let mouse_rotate_y = 0;
let mouse_rotate_z = 0;

// global animation variables
let hello_animation_state = 0;
let animation_leg_rotation = 0;
// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; renderScene();});
  document.getElementById("wall_e_leg_vertical").addEventListener('mousemove', function() {leg_vertical_movement = this.value; scaleVerticalLegMovement();});
  document.getElementById("arm_vertical").addEventListener('mousemove', function() {arm_vertical_movement = this.value; scaleVerticalArmMovement();});
  document.getElementById("neck_front_back").addEventListener('mousemove', function() {neck_front_back = this.value; renderScene();});
  document.getElementById("left_forearm").addEventListener('mousemove', function() {left_forearm_rotation = this.value; renderScene();});
  document.getElementById("left_forearm_scale").addEventListener('mousemove', function() {left_forearm_scale = this.value; renderScene();});
  document.getElementById("hands_open_close").addEventListener('mousemove', function() {hand_open_close_movement = this.value; renderScene();});
  document.getElementById("hands_rotate").addEventListener('mousemove', function() {hand_rotation = this.value; renderScene();});
  document.getElementById("neck_upper_rotate").addEventListener('mousemove', function() {upper_neck_rotation = this.value; renderScene();});
  document.getElementById("global_scale").addEventListener('mousemove', function() {global_scale = this.value; renderScene();});
  document.getElementById("hello_animation_on").addEventListener('mousedown', function() {hello_animation_state = 1; ticker = 0;});
  document.getElementById("hello_animation_off").addEventListener('mousedown', function() {hello_animation_state = 0; ticker = 0;});
  // trying to add the shift ket animation
  document.addEventListener('mousedown', function (ev) {special_shift_animation = ev.shiftKey; ticker = 0;});
}

function scaleVerticalLegMovement() {
  leg_vertical_movement -= 50;
  leg_vertical_movement /= 300;
  // setting an upper limit
  if (leg_vertical_movement > 0.09) {
    leg_vertical_movement = 0.09;
  }
  renderScene();
}
//
function scaleVerticalArmMovement() {
  renderScene();
}

// Function to render all shapes stored in g_points_array
// we need a way to store how and when exactly was the butterfly drawn
function renderScene() {
  // Clear the canvas
  // checkig for the leg movement - if it is not the default
  var start_time = performance.now();
  var combined_x_rotation = parseFloat(g_globalAngle) + parseFloat(shift_animation_rotation) + parseFloat(mouse_rotate_x);
  var combined_y_rotation = parseFloat(g_globalAngleVertical) + parseFloat(mouse_rotate_y);

  var globalRotate = new Matrix4().rotate(combined_x_rotation, 0, 1, 0);

  // then rotate it vertically
  globalRotate.rotate(combined_y_rotation, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);

  // setting up the scaling
  // var scaling_mat = new Matrix4().scale((global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom);
  // gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, scaling_mat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // console.log(global_scale);
  // main body
  var body = new Cube();
  body.color = [1, 0, 0, 1.0];
  body.matrix.setTranslate(-0.5, -0.5, -0.5);
  body.matrix.scale(0.5, 0.5, 0.5);
  body.render();


  // calculating the performance in the very end;
  var duration = performance.now() - start_time;
  sendTextToHTML("fps = " + Math.floor(10000/duration), "fps");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  htmlElm.innerHTML = text;
}
// extract the canvas and initialize WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer : true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // get the storage location for a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // // getting the location for v_UV;
  // v_UV = gl.getVary

  // get the storage location of u_PointSize
  u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
  if (u_PointSize < 0) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

  // get the storage location of u_PointSize
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // u_GlobalScaleMatrix = gl.getUniformLocation(gl.program, "u_GlobalScaleMatrix");
  // if (!u_GlobalScaleMatrix) {
  //   console.log("Failed to get the storage location of u_GlobalScaleMatrix");
  //   return;
  // }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
  // gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, identityM.elements);
}
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var z = ev.clientZ;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // console.log(x, y);
}

// drag functionality
var mouse_down = 0;
var mouse_up = 0;
var drag = 0;
var initial_x = 0;
var initial_y = 0;

function main() {
  // Setting up WebGL
  setupWebGL();
  connectVariablesToGLSL();
  // Initialize shaders
  AddActionsToHtmlUI();
  canvas.onmousedown = function(ev) {
    mouse_down = 1;
    mouse_up = 0;
    initial_x = ev.clientX;
    initial_y = ev.clientY;
  };
  // canvas.onmouseup = function(ev) {
  canvas.onmousemove = function(ev){
  if (ev.buttons == 1) {
    mouse_up = 1;
    mouse_down = 0;
    final_x = ev.clientX;
    final_y = ev.clientY;

    if ((final_x != initial_x) && (final_y != initial_y)) {
      drag = 1;
    } else {
      drag = 0;
    }

    // if the user dragged on canvas, then we rotate
    if (drag == 1) {
      // rotate along the x axis
      if (final_x - initial_x > 0) {
        // then it means the user went from right to left
        mouse_rotate_x = - (final_x - initial_x);
      } else {
        mouse_rotate_x = initial_x - final_x;
      }

      // now we will rotate along the y axis
      if (final_y - initial_y > 0) {
        mouse_rotate_y = - (final_y - initial_y);
      } else {
        mouse_rotate_y = initial_y - final_y;
      }
    }
  }
  }
  // canvas.onmousemove = function(ev){if (ev.buttons == 1) {click(ev)}};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // renderScene();
  requestAnimationFrame(tick);
}

var start_time = performance.now() / 1000.0;
var seconds = performance.now() / 1000.0 - start_time;
var ticker = 0;
function tick() {
  seconds = performance.now() / 1000.0 - start_time;
  ticker += 1;
  // console.log(performance.now());

  // setAnnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}

// TODO: shift these variables to the top
var animation_arm_movement = 0;
var animation_forearm_movement = 0;
var animation_fingers_movement = 0;
var animation_neck_lower = 0;
var animation_neck_upper = 0;
var animation_eyebrow = 0;
var annimation_zoom = 1;
var annimation_raise_hand = 0;
var annimation_open_hand = 0;

// variables for shift animation
var shift_animation_rotation = 0;
var shift_animation_hands_up = 0;
var shift_animation_neck = 0;
var shift_forearm_rotation = 0;
var shift_leg_rotation = 0;

function setAnnimationAngles() {
  // trying to say a hello in the animation
  if (hello_animation_state == 1) {
    // then wall-e should bend its eyes down
    if (ticker < 30) {
      animation_neck_lower -= 1; // move lower neck down
    }
    if ((30 < ticker) && (ticker < 60)) {
      animation_neck_upper += 1; // move lower neck up
    }
    if ((60 < ticker) && (ticker < 80)) {
      animation_neck_upper -= 2;
    }
    if ((80 < ticker) && (ticker < 160)) {
      annimation_zoom += 0.01
    }
    if ((160 < ticker) && (ticker < 190)) {
      // wait for 30 ticks
    }
    if ((190 < ticker) && (ticker < 210)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((210 < ticker) && (ticker < 240)) {
      // wait for 30 ticks and do nothing in between
    }
    if ((240 < ticker) && (ticker < 260)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    if ((260 < ticker) && (ticker < 280)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((280 < ticker) && (ticker < 310)) {
      // wait for 30 ticks and do nothing in between
    }
    if ((310 < ticker) && (ticker < 330)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    if ((330 < ticker) && (ticker < 430)) {
      if (annimation_zoom > 1.000) {
        annimation_zoom -= 0.01
      }
    }
    // finanly wave
    if ((430 < ticker) && (ticker < 460)) {
      annimation_open_hand += 2;
    }
    if ((460 < ticker) && (ticker < 490)) {
      annimation_raise_hand += 2;
    }
    // now we will do a hello for 20 ticks
    if ((490 < ticker) && (ticker < 510)) {
      annimation_raise_hand -= 1;
    }
    if ((510 < ticker) && (ticker < 530)) {
      annimation_raise_hand += 1;
    }
    if ((530 < ticker) && (ticker < 550)) {
      annimation_raise_hand -= 1;
    }
    if ((550 < ticker) && (ticker < 570)) {
      annimation_raise_hand += 1;
    }

    if ((570 < ticker) && (ticker < 600)) {
      annimation_raise_hand -= 2;
    }
    // hello done - now resume back to normal position
    if ((600 < ticker) && (ticker < 630)) {
      annimation_open_hand -= 2;
    }

    // return back to the original position of the neck
    if ((630 < ticker) && (ticker < 660)) {
      animation_neck_lower += 1;
    }

    if ((660 < ticker) && (ticker < 670)) {
      animation_neck_upper += 1;
    }

    if (ticker > 700) {
      // at this point 1 set of animation is complete, and we can loop over this again
      // reset
      ticker = 0;
      animation_neck_lower = 0;
      animation_neck_upper = 0;
      animation_eyebrow = 0;
      // annimation_zoom = 1;
    }
  } else {
    annimation_raise_hand = 0;
    annimation_open_hand = 0;
    animation_arm_movement = 0;
    animation_neck_lower = 0;
    animation_neck_upper = 0;
    animation_eyebrow = 0;
    annimation_zoom = 1;
  }
  if (special_shift_animation == true) {
    // in this animation, we can rotate WallE quickly and then let it do a quick thing
    // console.log(special_shift_animation)
    if ((0 < ticker) && (ticker < 60)) {
      shift_animation_rotation += 3;
      shift_animation_hands_up += 1;
      shift_animation_neck += 1;
      shift_forearm_rotation += 0.5;
      shift_leg_rotation += 0.0009;
    } else if ((60 < ticker) && (ticker < 120)) {
      shift_animation_rotation += 3;
      shift_animation_hands_up -= 1;
      shift_animation_neck -= 1;
      shift_forearm_rotation -= 0.5;
      shift_leg_rotation -= 0.0009;
    } else if (ticker > 120) { // end this animation
      special_shift_animation = false;
      shift_animation_neck = 0;
      shift_animation_hands_up = 0;
      shift_animation_rotation = 0;
      shift_forearm_rotation = 0;
      shift_leg_rotation = 0;
    }
  }
}
