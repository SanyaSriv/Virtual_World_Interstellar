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
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
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
let u_Sampler0, u_Sampler1, u_Sampler2;
let u_whichTexture;
// global animation variables
let hello_animation_state = 0;
let animation_leg_rotation = 0;
let number_of_minecraft_cubes = 0;
let mine_craft_cube_x_y_coord = [];
let g_GlobalCameraInstance;
// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  // document.getElementById("camera_angle").addEventListener('mousemove', function() {camera_angle_rotate(this.value);});
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

function initTextures(gl, n) {

  // doing it for image 1
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();

  if (!image1) {
    console.log("Failed to get the image1 object");
    return false;
  }
  if (!image2) {
    console.log("Failed to get the image2 object");
    return false;
  }
  if (!image3) {
    console.log("Failed to get the image3 object");
    return false;
  }

  image1.onload = function() {loadTexture(image1, 0, u_Sampler0);};
  image2.onload = function() {loadTexture(image2, 1, u_Sampler1);};
  image3.onload = function() {loadTexture(image3, 2, u_Sampler2);};

  image1.src = "wall_e_taking_care.jpeg";
  image2.src = "final_floor.png";
  image3.src = "bh.jpeg";

  return true;
}

var texture1, texture2;

function loadTexture(image, number, u_Sampler) {

  texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get the texture');
    return false;
  }

  if (number === 0) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
  } else if (number === 1) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 1);
  } else if (number == 2) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 2);
  }
  console.log("Loaded Texture", image);
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

var g_eye = [0,1,12]
var g_at = [0,20,-90]
var g_up = [0,1,0]

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

  // setting up the projection matrix
  var projMatrix = new Matrix4();
  projMatrix.setPerspective(50, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  // setting up the view matrix
  var viewMat = new Matrix4();
  // viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2], g_at[0],g_at[1],g_at[2], g_up[0],g_up[1],g_up[2]); // eye, at, up
  viewMat.setLookAt(g_GlobalCameraInstance.eye.x, g_GlobalCameraInstance.eye.y, g_GlobalCameraInstance.eye.z,
                    g_GlobalCameraInstance.at.x, g_GlobalCameraInstance.at.y, g_GlobalCameraInstance.at.z,
                    g_GlobalCameraInstance.up.x, g_GlobalCameraInstance.up.y, g_GlobalCameraInstance.up.z); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // setting up the scaling
  // var scaling_mat = new Matrix4().scale((global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom);
  // gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, scaling_mat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // console.log(global_scale);


  // main body
  var body = new Cube();
  body.color = [1, 0, 0, 1.0];
  body.matrix.translate(0, -0.74, 0);
  body.matrix.scale(0.5, 0.5, 0.5);
  body.textureNum = 0;
  body.render();

  var floor = new Cube();
  floor.matrix.translate(0,-0.75,0);
  floor.color = [1, 0, 0, 1.0];
  floor.matrix.scale(32, 0, 32);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.textureNum = 1;
  floor.render();

  var sky = new Cube();
  sky.color = [1, 0, 0, 1.0];
  sky.textureNum = 2;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  var sky_reference_matrix = new Matrix4(sky.matrix);
  sky.render();

  // draw the mine craft cubes
  var index = mine_craft_cube_x_y_coord.length - 1
  for(var i = 0; i < number_of_minecraft_cubes; i++) {
    var block = new Cube();
    block.matrix.translate(0,-0.75,0);
    block.color = [1, 0, 0, 1.0];
    // block.matrix = floor_reference_matrix;
    block.textureNum = -1;
    y = mine_craft_cube_x_y_coord[index];
    index -= 1;
    x = mine_craft_cube_x_y_coord[index];
    index -= 1;
    block.matrix.translate(-0.5, 0, -0.5);
    block.matrix.translate(x, 0, y);
    // block.matrix.scale(1/10, 5, 1/10);
    // console.log("value in here is: ", x, y)
    block.render();
  }

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

  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the u_sampler0 location");
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the u_sampler1 location");
    return;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log("Failed to get the u_sampler2 location");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the u_whichTexture value");
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
  var z = ev.clientZ; // z coordinate of the mouse pointer

  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  console.log("value of x and y is: ", x, y);
  number_of_minecraft_cubes += 1;
  mine_craft_cube_x_y_coord.push(x);
  mine_craft_cube_x_y_coord.push(y);
  console.log(number_of_minecraft_cubes);
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

  // initializing the camera
  g_GlobalCameraInstance = new Camera();
  // canvas.onmousedown = function(ev) {
  //   mouse_down = 1;
  //   mouse_up = 0;
  //   initial_x = ev.clientX;
  //   initial_y = ev.clientY;
  // };
  // canvas.onmouseup = function(ev) {
  // canvas.onmousemove = function(ev){
  // if (ev.buttons == 1) {
  //   mouse_up = 1;
  //   mouse_down = 0;
  //   final_x = ev.clientX;
  //   final_y = ev.clientY;
  //
  //   if ((final_x != initial_x) && (final_y != initial_y)) {
  //     drag = 1;
  //   } else {
  //     drag = 0;
  //   }
  //
  //   // if the user dragged on canvas, then we rotate
  //   if (drag == 1) {
  //     // rotate along the x axis
  //     if (final_x - initial_x > 3) {
  //       // then it means the user went from right to left
  //       mouse_rotate_x = - (final_x - initial_x);
  //     } else {
  //       mouse_rotate_x = initial_x - final_x;
  //     }
  //
  //     // now we will rotate along the y axis
  //     if (final_y - initial_y > 3) {
  //       mouse_rotate_y = - (final_y - initial_y);
  //     } else {
  //       mouse_rotate_y = initial_y - final_y;
  //     }
  //   }
  // }
  // }
  canvas.onmousedown = function(ev){ click(ev) };

  document.onkeypress = function(ev){keydown(ev);};

  initTextures();
  // canvas.onmousemove = function(ev){if (ev.buttons == 1) {click(ev)}};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // renderScene();
  requestAnimationFrame(tick);
}

// this function is for moving in different directions
function keydown(ev) {
  if (ev.keyCode == 97) {
    // A is pressed, move left
    console.log("Moving left");
    g_GlobalCameraInstance.left();
    // g_eye[0] -= 0.2;
  } else if (ev.keyCode == 100) {
    // D is pressed, move right
    g_GlobalCameraInstance.right();
    // g_eye[0] += 0.2;
  } else if (ev.keyCode == 119) {
    // W is pressed, move forward
    g_GlobalCameraInstance.forward();
  } else if (ev.keyCode == 115) {
    // S is pressed, move down
    g_GlobalCameraInstance.back();
  } else if (ev.keyCode == 113) {
    g_GlobalCameraInstance.panLeft();
  } else if (ev.keyCode == 101) {
    g_GlobalCameraInstance.panRight();
  }
  console.log("Key pressed", ev.keyCode);
  renderScene();
}

// this function is for rotating the camera angle
function camera_angle_rotate(angle) {
  var direction = g_GlobalCameraInstance.at.subtract(g_GlobalCameraInstance.eye);
  console.log("x = ", direction.x);
  console.log("y = ", direction.y);
  var r = Math.sqrt((direction.x**2) + (direction.y**2));
  var tan_theta = direction.y / direction.x;
  var theta = Math.atan(tan_theta); // this will be in radians
  console.log(g_GlobalCameraInstance.at.x, g_GlobalCameraInstance.at.y, g_GlobalCameraInstance.at.z);
  // converting the angle in radians
  var radian_angle = angle * (Math.PI/180);
  var final_angle = theta + radian_angle;

  var x_new = r * Math.cos(final_angle);
  var y_new = r * Math.sin(final_angle);
  console.log("x_new = ", x_new);
  console.log("y_new = ", y_new);
  // now resetting the vectors
  direction.x = x_new;
  direction.y = y_new;
  console.log("direction = ", direction.x, direction.y, direction.z);
  console.log(g_GlobalCameraInstance.at.x, g_GlobalCameraInstance.at.y, g_GlobalCameraInstance.at.z);
  var f = g_GlobalCameraInstance.eye.add(direction);
  g_GlobalCameraInstance.at.x = f.x;
  g_GlobalCameraInstance.at.y = f.y;
  console.log(g_GlobalCameraInstance.at.x, g_GlobalCameraInstance.at.y, g_GlobalCameraInstance.at.z);
  renderScene();
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
