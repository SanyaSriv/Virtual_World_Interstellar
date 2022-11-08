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
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
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
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } else if (u_whichTexture == 6) {
      gl_FragColor = texture2D(u_Sampler6, v_UV);
    }
    else {
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
let u_reflection_matrix;
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
let global_scale = 1;
let special_shift_animation = 0;
let mouse_rotate_x = 0;
let mouse_rotate_y = 0;
let mouse_rotate_z = 0;
let u_Sampler0, u_Sampler1, u_Sampler2, u_Sampler3, u_Sampler4, u_Sampler5, u_Sampler6;
let u_whichTexture;
let u_factor;
// global animation variables
let hello_animation_state = 0;
let animation_leg_rotation = 0;
let number_of_minecraft_cubes = 0;
let mine_craft_cube_x_y_coord = [];
let g_GlobalCameraInstance;
let texture_or_color = 0;
let globalFOV = 0;
// // this will listen to all sliders
// this is slowing down the program
function AddActionsToHtmlUI() {
  // listener for camera angle
  document.getElementById("camera_angle").addEventListener('mousemove', function() {g_GlobalCameraInstance.fov = parseInt(this.value);});
  document.getElementById("Add_block").addEventListener('mousedown', function() {texture_or_color = 0; add_block();});
  // document.getElementById("Add_block_colored").addEventListener('mousedown', function() {texture_or_color = 1; add_block();});
  document.getElementById("Delete_block").addEventListener('mousedown', function() {delete_block();});
  document.getElementById("camera_angle2").addEventListener('mousemove', function() {g_globalAngleVertical = this.value; renderScene();});
  document.getElementById("wall_e_leg_vertical").addEventListener('mousemove', function() {leg_vertical_movement = this.value; scaleVerticalLegMovement();});
  document.getElementById("arm_vertical").addEventListener('mousemove', function() {arm_vertical_movement = this.value; scaleVerticalArmMovement();});
  document.getElementById("neck_front_back").addEventListener('mousemove', function() {neck_front_back = this.value; renderScene();});
  document.getElementById("left_forearm").addEventListener('mousemove', function() {left_forearm_rotation = this.value; renderScene();});
  document.getElementById("left_forearm_scale").addEventListener('mousemove', function() {left_forearm_scale = this.value; renderScene();});
  document.getElementById("hands_open_close").addEventListener('mousemove', function() {hand_open_close_movement = this.value; renderScene();});
  document.getElementById("hands_rotate").addEventListener('mousemove', function() {hand_rotation = this.value; renderScene();});
  document.getElementById("neck_upper_rotate").addEventListener('mousemove', function() {upper_neck_rotation = this.value; renderScene();});
  document.getElementById("global_scale").addEventListener('mousemove', function() {global_scale = this.value / 100; renderScene();});
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
  var image4 = new Image();
  var image5 = new Image();
  var image6 = new Image();
  var image7 = new Image();

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
  if (!image4) {
    console.log("Failed to get the image4 object");
    return false;
  }
  if (!image5) {
    console.log("Failed to get the image5 object");
    return false;
  }
  if (!image6) {
    console.log("Failed to get the image6 object");
  }
  if (!image7) {
    console.log("Failed to get the image7 object");
  }

  image1.onload = function() {loadTexture(image1, 0, u_Sampler0);};
  image2.onload = function() {loadTexture(image2, 1, u_Sampler1);};
  image3.onload = function() {loadTexture(image3, 2, u_Sampler2);};
  image4.onload = function() {loadTexture(image4, 3, u_Sampler3);};
  image5.onload = function() {loadTexture(image5, 4, u_Sampler4);};
  image6.onload = function() {loadTexture(image6, 5, u_Sampler5);};
  image7.onload = function() {loadTexture(image7, 6, u_Sampler6);};

  image1.src = "gold_picture.jpeg";
  image2.src = "final_floor.png";
  image3.src = "bh.jpeg";
  image4.src = "black_tile_reduced.jpeg"
  image5.src = "white_tile_reduced.jpeg"
  image6.src = "gold_picture.jpeg"
  image7.src = "silver_picture.jpeg"

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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 2);
  } else if (number == 3) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 3);
  } else if (number == 4) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 4);
  } else if (number == 5) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 5);
  } else if (number == 6) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 6);
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

function add_block() {
  var diff = g_GlobalCameraInstance.at.subtract(g_GlobalCameraInstance.eye);
  diff = diff.divide(diff.length());
  var new_position = g_GlobalCameraInstance.eye.add(diff);

  g_GlobalCameraInstance.player_position_x = Math.round(new_position.x) + 16;
  g_GlobalCameraInstance.player_position_y = Math.round(new_position.z) + 11;
  // console.log(Math.round(new_position.x), Math.round((new_position.x + 16) / 1.2));
  if (g_GlobalCameraInstance.player_position_x > 31) {
    g_GlobalCameraInstance.player_position_x = 31;
  }
  if (g_GlobalCameraInstance.player_position_y > 31) {
    g_GlobalCameraInstance.player_position_y = 31;
  }
  if (g_GlobalCameraInstance.player_position_x < 0) {
    g_GlobalCameraInstance.player_position_x = 0;
  }
  if (g_GlobalCameraInstance.player_position_y < 0) {
    g_GlobalCameraInstance.player_position_y = 0;
  }
  console.log("add: ", g_GlobalCameraInstance.player_position_x, g_GlobalCameraInstance.player_position_y);
  g_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] += 1;
  if ((g_color_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y]) == 0) {
    if (texture_or_color == 0) {
      g_color_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] = 0;
    } else if (texture_or_color == 1) {
      g_color_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] = 1;
    }
  }
}

function delete_block() {
  var diff = g_GlobalCameraInstance.at.subtract(g_GlobalCameraInstance.eye);
  diff = diff.divide(diff.length());
  var new_position = g_GlobalCameraInstance.eye.add(diff);

  g_GlobalCameraInstance.player_position_x = Math.round(new_position.x) + 16;
  g_GlobalCameraInstance.player_position_y = Math.round(new_position.z) + 11;

  if (g_GlobalCameraInstance.player_position_x > 31) {
    g_GlobalCameraInstance.player_position_x = 31;
  }
  if (g_GlobalCameraInstance.player_position_y > 31) {
    g_GlobalCameraInstance.player_position_y = 31;
  }
  if (g_GlobalCameraInstance.player_position_x < 0) {
    g_GlobalCameraInstance.player_position_x = 0;
  }
  if (g_GlobalCameraInstance.player_position_y < 0) {
    g_GlobalCameraInstance.player_position_y = 0;
  }

  // console.log("delete: ", g_GlobalCameraInstance.player_position_x, g_GlobalCameraInstance.player_position_y);
  if (g_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] > 0) {
    g_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] -= 1;
  }
}

g_map = [
  [3,1,2,1,2,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,2,1,2,1,3],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // <- player begins's here
  [0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,3,4,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [3,1,2,1,2,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,2,1,2,1,3]
]



g_color_map = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

var g_eye = [0,1,12]
var g_at = [0,20,-90]
var g_up = [0,1,0]

function renderMap() {
  var g_map_length = g_map.length;
  // console.log("map length = ", g_map_length);
  for (var i = 0; i < g_map_length; i++) {
    for (var j = 0; j < g_map_length; j ++) {
      if (g_map[i][j] > 0){
        var size_to_add = 0;
        for (var k = 0; k < g_map[i][j]; k ++) {
          // draw the cube/wall
          var wall = new Cube();
          wall.color = [1, 0,0,1.0];
          if (g_color_map[i][j] == 0) {
            if (k % 2 != 0) {
              wall.textureNum = 4;
            } else {
              wall.textureNum = 3;
            }
          } else if (g_color_map[i][j] == 1) {
            wall.textureNum = -2;
            wall.color = [235/255, 52/255, 97/255, 1.0];
          } else if (g_color_map[i][j] == 3) {
            wall.textureNum = -2;
            wall.color = [168/255, 114/255, 12/255, 1.0];
          } else if (g_color_map[i][j] == 4) {
            wall.textureNum = -2;
            wall.color = [16/255, 151/255, 158/255, 1.0];
          }

          wall.matrix.translate(0, -0.75 + size_to_add, 0);
          wall.matrix.scale(1.2, 1.2, 1.2);
          wall.matrix.translate(i-16, 0, j-16);
          size_to_add += 1.2;
          wall.renderFast();
        }
      }
    }
  }
}

function renderWallE() {
    // Clear the canvas
    // console.log("Came here, going to draw the body: ", shift_animation_rotation);
    // checkig for the leg movement - if it is not the default
    var start_time = performance.now();

    var combined_x_rotation = parseFloat(g_globalAngle) + parseFloat(shift_animation_rotation) + parseFloat(mouse_rotate_x);
    var combined_y_rotation = parseFloat(g_globalAngleVertical) + parseFloat(mouse_rotate_y);

    // console.log("x axis rotation: ", g_globalAngle, shift_animation_rotation, mouse_rotate_x);
    // console.log("y axis rotation: ", combined_y_rotation, g_globalAngleVertical, mouse_rotate_y/10);
    // var globalRotate = new Matrix4().rotate(g_globalAngle + shift_animation_rotation + mouse_rotate_x, 0, 1, 0);
    var globalRotate = new Matrix4().rotate(180, 0, 1, 0);
    // globalRotate.rotate(-90, 0, 1, 0);
    // var globalRotate = new Matrix4();
    // then rotate it vertically
    // globalRotate.rotate(g_globalAngleVertical + mouse_rotate_y, 1, 0, 0);
    globalRotate.rotate(combined_y_rotation, 1, 0, 0);

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotate.elements);

    var reflection_matrix = new Matrix4([1,0,0,0, 0,-1,0,0, 0,0,-1,0, 0,0,0,1])

    x_factor = 2
    // console.log(global_scale);
    // main body
    var body = new Cube();
    body.color = [254/255, 175/255, 52/255, 1.0];
    body.matrix.setTranslate(-0.5 + x_factor, -0.5, -0.5);
    body.matrix.scale(0.5 , 0.5 , 0.5 );
    body.renderFast();

    //body detail
    var body_detail = new Cube();
    body_detail.color = [207/255,167/255,105/255, 1.0];
    body_detail.matrix.setTranslate(-0.35 + x_factor, -0.20, -0.52);
    body_detail.matrix.scale(0.35 , 0.2 , 0.03 );
    body_detail.renderFast();

    var battery_screen = new Cube();
    battery_screen.color = [0.0, 0.0, 0.0, 1.0];
    battery_screen.matrix.setTranslate(-0.15 + x_factor, -0.15, -0.53);
    battery_screen.matrix.scale(0.08 , 0.12 , 0.05 );
    battery_screen.renderFast();

    var battery_bar_1 = new Cube();
    battery_bar_1.color = [224/255, 231/255, 34/255, 1.0];
    battery_bar_1.matrix.translate(-0.128 + x_factor, -0.14, -0.54);
    battery_bar_1.matrix.scale(0.04 , 0.01 , 0.01 );
    battery_bar_1.renderFast();

    var battery_bar_2 = new Cube();
    battery_bar_2.color = [224/255, 231/255, 34/255, 1.0];
    battery_bar_2.matrix.translate(-0.128 + x_factor, -0.12, -0.54);
    battery_bar_2.matrix.scale(0.04 , 0.01 , 0.01 );
    battery_bar_2.renderFast();

    var battery_bar_3 = new Cube();
    battery_bar_3.color = [224/255, 231/255, 34/255, 1.0];
    battery_bar_3.matrix.translate(-0.128 + x_factor, -0.10, -0.54);
    battery_bar_3.matrix.scale(0.04 , 0.01 , 0.01 );
    battery_bar_3.renderFast();

    var red_button = new Cylinder();
    red_button.color = [1, 0, 0, 1.0];
    red_button.matrix.translate(-0.2 + x_factor, -0.129, -0.53);
    red_button.matrix.scale(0.04 , 0.04 , 0.01 );
    red_button.render();

    var body_grill = new Cube();
    body_grill.color = [94/255, 110/255, 115/255, 1.0];
    body_grill.matrix.translate(-0.3 + x_factor, -0.095, -0.53);
    body_grill.matrix.scale(0.12 , 0.06 , 0.01 );
    body_grill.renderFast();

    var grill_bar_1 = new Cube();
    grill_bar_1.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_1.matrix.translate(-0.28 + x_factor, -0.088, -0.54);
    grill_bar_1.matrix.scale(0.037 , 0.01 , 0.001 );
    grill_bar_1.renderFast();

    var grill_bar_2 = new Cube();
    grill_bar_2.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_2.matrix.translate(-0.23 + x_factor, -0.088, -0.54);
    grill_bar_2.matrix.scale(0.037 , 0.01 , 0.001 );
    grill_bar_2.renderFast();

    var grill_bar_3 = new Cube();
    grill_bar_3.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_3.matrix.translate(-0.28 + x_factor, -0.074, -0.54);
    grill_bar_3.matrix.scale(0.037 , 0.01 , 0.001 );
    grill_bar_3.renderFast();

    var grill_bar_4 = new Cube();
    grill_bar_4.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_4.matrix.translate(-0.23 + x_factor, -0.074, -0.54);
    grill_bar_4.matrix.scale(0.037 , 0.01 , 0.001 );
    grill_bar_4.renderFast();

    var grill_bar_5 = new Cube();
    grill_bar_5.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_5.matrix.translate(-0.28 + x_factor, -0.06, -0.54);
    grill_bar_5.matrix.scale(0.037, 0.01, 0.001);
    grill_bar_5.renderFast();

    var grill_bar_6 = new Cube();
    grill_bar_6.color = [0.0, 0.0, 0.0, 1.0];
    grill_bar_6.matrix.translate(-0.23 + x_factor, -0.06, -0.54);
    grill_bar_6.matrix.scale(0.037, 0.01, 0.001);
    grill_bar_6.renderFast();

    var black_lining_front = new Cube();
    black_lining_front.color = [51/255, 53/255, 54/255, 1.0];
    black_lining_front.matrix.translate(-0.5 + x_factor, -0.02, -0.53);
    black_lining_front.matrix.scale(0.50, 0.02, 0.02);
    black_lining_front.renderFast();

    var black_lining_right = new Cube();
    black_lining_right.color = [51/255, 53/255, 54/255, 1.0];
    black_lining_right.matrix.translate(-0.52 + x_factor, -0.021, 0);
    black_lining_right.matrix.rotate(90, 0, 1, 0);
    black_lining_right.matrix.scale(0.50, 0.02, 0.02);
    black_lining_right.renderFast();

    var black_lining_left = new Cube();
    black_lining_left.color = [51/255, 53/255, 54/255, 1.0];
    black_lining_left.matrix.translate(0.0 + x_factor, -0.021, 0);
    black_lining_left.matrix.rotate(90, 0, 1, 0);
    black_lining_left.matrix.scale(0.50, 0.02, 0.02);
    black_lining_left.renderFast();

    // making text on Wall-E's body - | of W
    // writing W
    var wall_e_letter_scale = 0.8;
    var wall_e_z_axis_offset
    var w_1 = new Cube();
    w_1.color = [0,0,0, 1.0];
    w_1.matrix.setTranslate(-0.36 + x_factor, -0.45, -0.51);
    w_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    w_1.renderFast();

    var w_2 = new Cube();
    w_2.color = [0,0,0, 1.0];
    w_2.matrix.setTranslate(-0.34 + x_factor, -0.45, -0.51);
    w_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    w_2.renderFast();

    var w_3 = new Cube();
    w_3.color = [0,0,0, 1.0];
    w_3.matrix.setTranslate(-0.32 + x_factor, -0.45, -0.51);
    w_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    w_3.renderFast();

    var w_4 = new Cube();
    w_4.color = [0,0,0, 1.0];
    w_4.matrix.setTranslate(-0.32 + x_factor, -0.45, -0.51);
    w_4.matrix.rotate(90, 0, 0, 1);
    w_4.matrix.scale(0.010 * wall_e_letter_scale, 0.04 * wall_e_letter_scale, 0.01);
    w_4.renderFast();

    // writing A in WALL-E
    // first vertical line for A
    var a_1 = new Cube();
    a_1.color = [0,0,0, 1.0];
    a_1.matrix.setTranslate(-0.29 + x_factor, -0.45, -0.51);
    a_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    a_1.renderFast();

    // second vertical line for A
    var a_2 = new Cube();
    a_2.color = [0,0,0, 1.0];
    a_2.matrix.setTranslate(-0.25 + x_factor, -0.45, -0.51);
    a_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    a_2.renderFast();

    // upper top horizontal line for A
    var a_3 = new Cube();
    a_3.color = [0,0,0, 1.0];
    a_3.matrix.setTranslate(-0.247 + x_factor, -0.42, -0.51);
    a_3.matrix.rotate(90, 0, 0, 1);
    a_3.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
    a_3.renderFast();

    // middle bar for A
    var a_4 = new Cube();
    a_4.color = [0,0,0, 1.0];
    a_4.matrix.setTranslate(-0.247 + x_factor, -0.44, -0.51);
    a_4.matrix.rotate(90, 0, 0, 1);
    a_4.matrix.scale(0.010 * wall_e_letter_scale, 0.045 * wall_e_letter_scale, 0.01);
    a_4.renderFast();


    // now going to make the first L
    var l1_1 = new Cube();
    l1_1.color = [0,0,0, 1.0];
    l1_1.matrix.setTranslate(-0.22 + x_factor, -0.45, -0.51);
    l1_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    l1_1.renderFast();

    var l1_2 = new Cube();
    l1_2.color = [0,0,0, 1.0];
    l1_2.matrix.setTranslate(-0.175 + x_factor, -0.45, -0.51);
    l1_2.matrix.rotate(90, 0, 0, 1);
    l1_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    l1_2.renderFast();


    // now going to make the second L
    var l2_1 = new Cube();
    l2_1.color = [0,0,0, 1.0];
    l2_1.matrix.setTranslate(-0.16 + x_factor, -0.45, -0.51);
    l2_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    l2_1.renderFast();

    var l2_2 = new Cube();
    l2_2.color = [0,0,0, 1.0];
    l2_2.matrix.setTranslate(-0.115 + x_factor, -0.45, -0.51);
    l2_2.matrix.rotate(90, 0, 0, 1);
    l2_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.01);
    l2_2.renderFast();

    // making the dot
    var dot = new Cube();
    dot.color = [0,0,0, 1.0];
    dot.matrix.setTranslate(-0.09 + x_factor, -0.44, -0.51);
    dot.matrix.rotate(90, 0, 0, 1);
    dot.matrix.scale(0.02 * wall_e_letter_scale, 0.02 * wall_e_letter_scale, 0.01);
    dot.renderFast();

    var e_circle = new Cylinder();
    e_circle.matrix.setTranslate(-0.043 + x_factor, -0.43, -0.51);
    e_circle.matrix.scale(0.09 * wall_e_letter_scale, 0.09 * wall_e_letter_scale, 0.01);
    e_circle.render();
    // now making the E of Wall E
    var e_1 = new Cube();
    e_1.color = [1,1,1, 1.0];
    e_1.matrix.setTranslate(-0.0225 + x_factor, -0.45, -0.5102);
    e_1.matrix.rotate(90, 0, 0, 1);
    e_1.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.019);
    e_1.matrix.multiply(reflection_matrix);
    e_1.renderFast();

    var e_2 = new Cube();
    e_2.color = [1,1,1, 1.0];
    e_2.matrix.setTranslate(-0.025 + x_factor, -0.435, -0.5102);
    e_2.matrix.rotate(90, 0, 0, 1);
    e_2.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.019);
    e_2.renderFast();

    var e_3 = new Cube();
    e_3.color = [1,1,1, 1.0];
    e_3.matrix.setTranslate(-0.025 + x_factor, -0.42, -0.5102);
    e_3.matrix.rotate(90, 0, 0, 1);
    e_3.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.019);
    e_3.renderFast();

    var e_4 = new Cube();
    e_4.color = [1,1,1, 1.0];
    e_4.matrix.setTranslate(-0.065 + x_factor, -0.45, -0.5102);
    e_4.matrix.scale(0.010 * wall_e_letter_scale, 0.05 * wall_e_letter_scale, 0.019);
    e_4.renderFast();

    // we will be defining all code related to Wall-e's legs here
    // right leg
    var leg_r = new Triangle3D();
    leg_r.color = [111/255, 115/255, 117/255, 1.0];
    leg_r.matrix.setTranslate(0.2 + x_factor, -0.65 + leg_vertical_movement + animation_leg_rotation + shift_leg_rotation, 0.1);
    // body.matrix.rotate(90, 1, 0, 0);
    leg_r.matrix.rotate(98, 0, 0, 1); // decides if it is inward or outward
    leg_r_reference_matrix = new Matrix4(leg_r.matrix);
    leg_r.matrix.rotate(45, 0, 1, 0);
    leg_r.matrix.rotate(-85, 1, 0, 0);
    leg_r.matrix.scale(0.5, 0.5, 0.15);
    leg_r.render();

    var leg_l = new Triangle3D();
    leg_l.color = [111/255, 115/255, 117/255, 1.0];
    leg_l.matrix.setTranslate(-0.50 + x_factor, -0.66 + leg_vertical_movement + shift_leg_rotation, 0.1);
    // body.matrix.rotate(90, 1, 0, 0);
    leg_l.matrix.rotate(91, 0, 0, 1); // decides if it is inward or outward
    leg_l.matrix.rotate(45, 0, 1, 0);
    leg_l.matrix.rotate(-85, 1, 0, 0);
    leg_l.matrix.scale(0.5, 0.5, 0.15);
    leg_l.render();

    // todo: add movement in arms
    // going to make Wall-E's arms
    // making left arm
    // TODO: Fix horizontal rotation
    var left_arm = new Cube();
    left_arm.color = [206/255, 189/255, 180/255, 1.0];
    left_arm.matrix.setTranslate(-0.04 + x_factor, -0.21, -0.2);
    left_arm.matrix.rotate(90, 0, 1, 0);
    left_arm.matrix.rotate(arm_vertical_movement, 1, 0, 0);
    // trying animation here
    left_arm.matrix.rotate(-annimation_raise_hand, 1, 0, 0);
    // adding animation here
    left_arm.matrix.rotate(shift_animation_hands_up, 1, 0, 0);
    // left_arm.matrix.rotate(arm_horizontal_movement, 0, 1, 0);
    var left_arm_reference_matrix = new Matrix4(left_arm.matrix);
    left_arm.matrix.scale(0.06, 0.05, 0.12);
    left_arm.renderFast();

    // Wall-e's hands2
    // left forearm part 1
    var left_forearm_1 = new Cube();
    left_forearm_1.color = [213/255, 162/255, 135/255, 1.0];
    left_forearm_1.matrix = left_arm_reference_matrix;
    left_forearm_1.matrix.translate(0.0, 0.0, 0.12);
    left_forearm_1.matrix.rotate(90, 0, 1, 0);
    left_forearm_1.matrix.rotate(-25, 0, 1, 0);
    // rotation based upon the slider
    left_forearm_1.matrix.rotate(left_forearm_rotation, 0, 1, 0);
    // trying animation here
    left_forearm_1.matrix.rotate(-annimation_open_hand, 0, 1, 0);
    // adding shift animation here
    left_forearm_1.matrix.rotate(- shift_forearm_rotation, 0, 1, 0);
    var left_forearm_1_reference_matrix = new Matrix4(left_forearm_1.matrix);
    left_forearm_1.matrix.scale(0.06, 0.05, 0.20);
    left_forearm_1.renderFast();

    // left forearm part 2
    var left_forearm_2 = new Cube();
    left_forearm_2.color = [83/255, 122/255, 143/255, 1.0];
    left_forearm_2.matrix = left_forearm_1_reference_matrix;
    left_forearm_2.matrix.translate(0.009, 0.009, 0.198);
    left_forearm_2.matrix.rotate(hand_rotation, 0, 0, 1);
    var left_forearm_2_reference_matrix = new Matrix4(left_forearm_2.matrix);
    var left_forearm_2_reference_matrix_2 = new Matrix4(left_forearm_2.matrix);
    left_forearm_2.matrix.scale(0.03, 0.03, 0.12 * (left_forearm_scale / 100));
    left_forearm_2.renderFast();

    // we need to add the scaling to the hand as well: left_forearm_scale

    // going to make the left hand now
    var left_hand_1 = new Cube();
    left_hand_1.color = [61/255, 85/255, 117/255, 1.0];
    left_hand_1.matrix = left_forearm_2_reference_matrix;
    left_hand_1.matrix.translate(0.00, 0.016, 0.12 * (left_forearm_scale / 100));
    // this is somehow also controlling the movement for left_hand_2
    // I suspect this is because we are reusing the left_forearm_2_reference_matrix
    // and it is getting passed by pointers and changing
    left_hand_1.matrix.rotate(hand_open_close_movement, 0, 1, 0);
    // adding user controlled hand rotation here
    // left_hand_1.matrix.rotate(hand_rotation, 0, 0, 1);
    left_hand_1.matrix.scale(0.01, 0.05, 0.11);
    left_hand_1.renderFast();

    var left_hand_2 = new Cube();
    left_hand_2.color = [61/255, 85/255, 117/255, 1.0];
    left_hand_2.matrix = left_forearm_2_reference_matrix;
    left_hand_2.matrix.translate(0.0, -1.1, 0.0);
    left_hand_2.renderFast();

    var left_hand_3 = new Cube();
    left_hand_3.color = [125/255, 143/255, 165/255, 1.0];
    left_hand_3.matrix = left_forearm_2_reference_matrix_2;
    left_hand_3.matrix.translate(0.01, -0.01, 0.12 * (left_forearm_scale / 100));
    left_hand_3.matrix.rotate(45, 0, 1, 0);
    left_hand_3.matrix.rotate(-hand_open_close_movement, 0, 1, 0);
    // left_hand_3.matrix.rotate(-hand_rotation, 1, 0, 0);
    left_hand_3.matrix.scale(0.01, 0.05, 0.11);
    left_hand_3.renderFast()

    // going to make right arm, fore-arm and right hand
    var right_arm = new Cube();
    right_arm.color = [206/255, 189/255, 180/255, 1.0];
    right_arm.matrix.setTranslate(-0.46 + x_factor, -0.166, -0.2);
    right_arm.matrix.rotate(90, 0, 1, 0);
    right_arm.matrix.rotate(180, 1, 0, 0);
    right_arm.matrix.rotate(- arm_vertical_movement, 1, 0, 0);
    // adding shift animation
    right_arm.matrix.rotate(- shift_animation_hands_up, 1, 0, 0);
    var right_arm_reference_matrix = new Matrix4(right_arm.matrix);
    right_arm.matrix.scale(0.06, 0.05, 0.12);
    right_arm.renderFast();

    // right forearm - part 1
    var right_forearm_1 = new Cube()
    right_forearm_1.color = [213/255, 162/255, 135/255, 1.0];
    right_forearm_1.matrix = right_arm_reference_matrix;
    right_forearm_1.matrix.translate(0.0, 0.0, 0.11);
    right_forearm_1.matrix.rotate(90, 0, 1, 0);
    right_forearm_1.matrix.rotate(-25, 0, 1, 0);
    // rotation based upon the left slider: adding this just for now
    right_forearm_1.matrix.rotate(left_forearm_rotation, 0, 1, 0);
    // shift animation here
    right_forearm_1.matrix.rotate(shift_forearm_rotation, 1, 0, 0);
    var right_forearm_1_reference_matrix = new Matrix4(right_forearm_1.matrix);
    right_forearm_1.matrix.scale(0.06, 0.05, 0.20);
    right_forearm_1.renderFast();

    // right forearm - part 2
    var right_forearm_2 = new Cube();
    right_forearm_2.color = [83/255, 122/255, 143/255, 1.0];
    right_forearm_2.matrix = right_forearm_1_reference_matrix;
    right_forearm_2.matrix.translate(0.009, 0.009, 0.198);
    right_forearm_2.matrix.rotate(-hand_rotation, 0, 0, 1);
    var right_forearm_2_reference_matrix = new Matrix4(right_forearm_2.matrix);
    var right_forearm_2_reference_matrix_2 = new Matrix4(right_forearm_2.matrix);
    // using the left one just to check: this can later have its own parameter "right_forearm_scale"
    right_forearm_2.matrix.scale(0.03, 0.03, 0.12 * (left_forearm_scale / 100));
    right_forearm_2.renderFast();

    // now going to make the right hand
    var right_hand_1 = new Cube();
    right_hand_1.color = [61/255, 85/255, 117/255, 1.0];
    right_hand_1.matrix = right_forearm_2_reference_matrix;
    // for now we are using the left forearm scale
    right_hand_1.matrix.translate(0.00, 0.016, 0.12 * (left_forearm_scale / 100));
    // this is somehow also controlling the movement for left_hand_2
    // I suspect this is because we are reusing the left_forearm_2_reference_matrix
    // and it is getting passed by pointers and changing
    right_hand_1.matrix.rotate(hand_open_close_movement, 0, 1, 0);
    right_hand_1.matrix.scale(0.01, 0.05, 0.11);
    right_hand_1.renderFast();

    var right_hand_2 = new Cube();
    right_hand_2.color = [61/255, 85/255, 117/255, 1.0];
    right_hand_2.matrix = right_forearm_2_reference_matrix;
    right_hand_2.matrix.translate(0.0, -1.1, 0.0);
    right_hand_2.renderFast();

    var right_hand_3 = new Cube();
    right_hand_3.color = [125/255, 143/255, 165/255, 1.0];
    right_hand_3.matrix = right_forearm_2_reference_matrix_2;
    // for now we are using the left_forearm_scale
    right_hand_3.matrix.translate(0.01, -0.01, 0.12 * (left_forearm_scale / 100));
    right_hand_3.matrix.rotate(45, 0, 1, 0);
    right_hand_3.matrix.rotate(-hand_open_close_movement, 0, 1, 0);
    right_hand_3.matrix.scale(0.01, 0.05, 0.11);
    right_hand_3.renderFast()

    // making Wall-E's neck
    var neck_1 = new Cube();
    neck_1.color = [145/255, 103/255, 79/255, 1.0];
    neck_1.matrix.setTranslate(-0.27 + x_factor, -0.05, -0.2);
    neck_1.matrix.rotate(-25, 1, 0, 0);
    neck_1.matrix.rotate(neck_front_back, 1, 0, 0);
    // animation here
    neck_1.matrix.rotate(animation_neck_lower, 1, 0, 0);
    // adding shift animation here
    neck_1.matrix.rotate(shift_animation_neck, 1, 0, 0);
    var neck_1_reference_matrix = new Matrix4(neck_1.matrix);
    neck_1.matrix.scale(0.07, 0.128, 0.07);
    neck_1.renderFast();

    var neck_2 = new Cube();
    neck_2.color = [171/255, 113/255, 74/255, 1.0];
    neck_2.matrix = neck_1_reference_matrix;
    neck_2.matrix.translate(0, 0.127, 0);
    neck_2.matrix.rotate(45, 1, 0, 0);
    neck_2.matrix.rotate(upper_neck_rotation, 1, 0, 0);
    // animation here
    neck_2.matrix.rotate(-animation_neck_upper, 1, 0, 0);
    var neck_2_reference_matrix = new Matrix4(neck_2.matrix);
    var neck_2_reference_matrix_2 = new Matrix4(neck_2.matrix);
    neck_2.matrix.scale(0.07, 0.128, 0.07);
    neck_2.renderFast();

    var right_eye = new Cylinder();
    right_eye.color = [127/255, 131/255, 135/255, 1.0];
    right_eye.matrix = neck_2_reference_matrix;
    right_eye.matrix.translate(-0.025, 0.165, 0.0);
    right_eye.matrix.scale(0.1, 0.1, 0.16);
    var right_eye_reference_matrix = new Matrix4(right_eye.matrix);
    right_eye.render();

    var right_inner_eye = new Cylinder();
    right_inner_eye.color = [193/255, 194/255, 188/255, 1.0];
    right_inner_eye.matrix = right_eye_reference_matrix;
    right_inner_eye.matrix.translate(0.0, 0.0, -0.001);
    right_inner_eye.matrix.scale(0.8, 0.8, 0.001);
    var right_inner_eye_reference_matrix = new Matrix4(right_inner_eye.matrix);
    right_inner_eye.render();

    var right_eye_cornea = new Cylinder();
    right_eye_cornea.color = [9/255, 24/255, 49/255, 1.0];
    right_eye_cornea.matrix = right_inner_eye_reference_matrix;
    right_eye_cornea.matrix.translate(0.07, 0.07, -0.05);
    right_eye_cornea.matrix.scale(0.55, 0.55, 0.002);
    right_eye_cornea.render();

    var right_eyebrow = new Cube();
    right_eyebrow.color = [241/255, 180/255, 129/255, 1.0];
    right_eyebrow.matrix = right_eye_reference_matrix;
    right_eyebrow.matrix.translate(-0.7, 0.56 + animation_eyebrow, 0.5); // animation here
    right_eyebrow.matrix.rotate(15, 0, 0, 1);
    right_eyebrow.matrix.scale(1.2, 0.1, 0.1);
    right_eyebrow.renderFast();

    var left_eye = new Cylinder();
    left_eye.color = [127/255, 131/255, 135/255, 1.0];
    left_eye.matrix = neck_2_reference_matrix_2;
    left_eye.matrix.translate(0.09, 0.165, 0.0);
    left_eye.matrix.scale(0.1, 0.1, 0.16);
    var left_eye_reference_matrix = new Matrix4(left_eye.matrix);
    left_eye.render();

    var left_inner_eye = new Cylinder();
    left_inner_eye.color = [193/255, 194/255, 188/255, 1.0];
    left_inner_eye.matrix = left_eye_reference_matrix;
    left_inner_eye.matrix.translate(0.0, 0.0, -0.001);
    left_inner_eye.matrix.scale(0.8, 0.8, 0.001);
    var left_inner_eye_reference_matrix = new Matrix4(left_inner_eye.matrix);
    left_inner_eye.render();

    var left_eye_cornea = new Cylinder();
    left_eye_cornea.color = [9/255, 24/255, 49/255, 1.0];
    left_eye_cornea.matrix = left_inner_eye_reference_matrix;
    left_eye_cornea.matrix.translate(-0.07, 0.07, -0.06);
    left_eye_cornea.matrix.scale(0.55, 0.55, 0.002);
    left_eye_cornea.render();

    var left_eyebrow = new Cube();
    left_eyebrow.color = [241/255, 180/255, 129/255, 1.0];
    left_eyebrow.matrix = left_eye_reference_matrix;
    left_eyebrow.matrix.translate(-0.60, 0.89 + animation_eyebrow, 0.5); // animation here
    left_eyebrow.matrix.rotate(-15, 0, 0, 1);
    left_eyebrow.matrix.scale(1.2, 0.1, 0.1);
    left_eyebrow.renderFast();

}
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
  // var projMatrix = new Matrix4();
  // projMatrix.setPerspective(50, canvas.width/canvas.height, 0.1, 100);
  // gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  g_GlobalCameraInstance.projMatrix.setPerspective(g_GlobalCameraInstance.fov, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_GlobalCameraInstance.projMatrix.elements);

  // setting up the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_GlobalCameraInstance.eye.x, g_GlobalCameraInstance.eye.y , g_GlobalCameraInstance.eye.z,
                    g_GlobalCameraInstance.at.x, g_GlobalCameraInstance.at.y, g_GlobalCameraInstance.at.z,
                    g_GlobalCameraInstance.up.x, g_GlobalCameraInstance.up.y, g_GlobalCameraInstance.up.z); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // setting up the scaling
  // var scaling_mat = new Matrix4().scale((global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom, (global_scale / 100) * annimation_zoom);
  // gl.uniformMatrix4fv(u_GlobalScaleMatrix, false, scaling_mat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // main body
  var gold_cube = new Cube();
  gold_cube.color = [1, 0, 0, 1.0];
  gold_cube.matrix.translate(0.01, -0.74, 0);
  gold_cube.matrix.scale(0.5, 0.5, 0.5);
  gold_cube.textureNum = 5;
  gold_cube.renderFast();

  var silver_cube = new Cube();
  silver_cube.color = [1, 0, 0, 1.0];
  silver_cube.matrix.translate(-7.0, -0.74, 0);
  silver_cube.matrix.scale(0.5, 0.5, 0.5);
  silver_cube.textureNum = 6;
  silver_cube.renderFast();

  var energy = new Cube();
  energy.color = [203/255, 240/255, 19/255, 1.0];
  energy.matrix.translate(10, -0.74, 0);
  energy.matrix.scale(0.5, 0.5, 0.5);
  energy.textureNum = -2;
  energy.renderFast();

  var floor = new Cube();
  floor.matrix.translate(0,-0.75,0);
  floor.color = [1, 0, 0, 1.0];
  floor.matrix.scale(40, 0, 40);
  // floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.textureNum = 1;
  floor.renderFast();

  var sky = new Cube();
  sky.color = [1, 0, 0, 1.0];
  sky.textureNum = 2;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  var sky_reference_matrix = new Matrix4(sky.matrix);
  sky.renderFast();

  // draw the mine craft cubes
  var index = mine_craft_cube_x_y_coord.length - 1
  for(var i = 0; i < number_of_minecraft_cubes; i++) {
    var block = new Cube();
    z = mine_craft_cube_x_y_coord[index];
    index -= 1;
    y = mine_craft_cube_x_y_coord[index];
    index -= 1;
    x = mine_craft_cube_x_y_coord[index];
    index -= 1;

    block.color = [1, 0, 0, 1.0];
    block.textureNum = -1;
    block.matrix.translate(0, -0.75, 0);
    block.matrix.scale(1.2, 1.2, 1.2);
    block.matrix.translate(x, 0, - z - 7);
    block.renderFast();
  }

  // rendering the map
  renderMap();
  // now going to render WallE
  renderWallE();

  // calculating the performance in the very end;
  var duration = performance.now() - start_time;
  sendTextToHTML("fps = " + Math.floor(10000/duration), "fps");

}


function ObjectMaker() {
  let positions = [];
  let normals = [];
  let coordinats = [];
  readOBJFile('chinese_coin.obj', gl, model, 60, true);
  draw(gl, gl.program, currentAngle, viewProjMatrix, model);
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

  u_Sampler3 = gl.getUniformLocation(gl.program, "u_Sampler3");
  if (!u_Sampler3) {
    console.log("Failed to get the u_Sampler3 location");
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, "u_Sampler4");
  if (!u_Sampler4) {
    cosole.log("Failed to get the u_Sampler4 location");
    return false;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, "u_Sampler5");
  if (!u_Sampler5) {
    cosole.log("Failed to get the u_Sampler5 location");
    return false;
  }

  u_Sampler6 = gl.getUniformLocation(gl.program, "u_Sampler6");
  if (!u_Sampler6) {
    cosole.log("Failed to get the u_Sampler6 location");
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the u_whichTexture value");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_reflection_matrix, false, identityM.elements);
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
  number_of_minecraft_cubes += 1;

  g_map[g_GlobalCameraInstance.player_position_x][g_GlobalCameraInstance.player_position_y] += 1;

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
  canvas.onmousedown = function(ev) {
    mouse_down = 1;
    mouse_up = 0;
    initial_x = ev.clientX;
    initial_y = ev.clientY;
    // console.log("mouse down")
  };

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
        g_GlobalCameraInstance.panMouseLeft(Math.abs(final_x - initial_x) * 0.4);
        // then it means the user went from right to left
        // mouse_rotate_x = - (final_x - initial_x);

      } else {
        g_GlobalCameraInstance.panMouseRight(Math.abs(initial_x - final_x) * 0.4);
        // mouse_rotate_x = initial_x - final_x;
      }
      initial_x = final_x;
      initial_y = final_y;
    }
  }
  }
  // canvas.onmousedown = function(ev){ click(ev) };

  // // now we will rotate along the y axis
  // if (final_y - initial_y > 0) {
  //   mouse_rotate_y = - (final_y - initial_y);
  // } else {
  //   mouse_rotate_y = initial_y - final_y;
  // }

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
    g_GlobalCameraInstance.left();
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
  renderScene();
}

var start_time = performance.now() / 1000.0;
var seconds = performance.now() / 1000.0 - start_time;
var ticker = 0;

function tick() {
  seconds = performance.now() / 1000.0 - start_time;
  ticker += 1;

  setAnnimationAngles();

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
    if ((80 < ticker) && (ticker < 100)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((100 < ticker) && (ticker < 120)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    if ((120 < ticker) && (ticker < 140)) {
      // now move your eyebrows to represent that wall-e's happy
      animation_eyebrow -= 0.007;
    }
    if ((140 < ticker) && (ticker < 160)) {
      // now move your eyebrows to represent that wall-e noticed the user
      animation_eyebrow += 0.007;
    }
    // finanly wave
    if ((160 < ticker) && (ticker < 190)) {
      annimation_open_hand += 2;
    }
    if ((190 < ticker) && (ticker < 220)) {
      annimation_raise_hand += 2;
    }
    // now we will do a hello for 20 ticks
    if ((220 < ticker) && (ticker < 240)) {
      annimation_raise_hand -= 1;
    }
    if ((240 < ticker) && (ticker < 260)) {
      annimation_raise_hand += 1;
    }
    if ((260 < ticker) && (ticker < 280)) {
      annimation_raise_hand -= 1;
    }
    if ((280 < ticker) && (ticker < 300)) {
      annimation_raise_hand += 1;
    }

    if ((300 < ticker) && (ticker < 330)) {
      annimation_raise_hand -= 2;
    }
    // hello done - now resume back to normal position
    if ((330 < ticker) && (ticker < 360)) {
      annimation_open_hand -= 2;
    }

    // return back to the original position of the neck
    if ((360 < ticker) && (ticker < 390)) {
      animation_neck_lower += 1;
    }

    if ((390 < ticker) && (ticker < 400)) {
      animation_neck_upper += 1;
    }

    if (ticker > 405) {
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
