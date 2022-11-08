class Camera {

  constructor() {
    // define everything here
    // these will start with some default values
    this.eye = new Vector(0, 1, 14);
    this.at = new Vector(0, 0, -100);
    this.up = new Vector(0, 1, 0);
    this.player_position_x = 16;
    this.player_position_y = 24;
    this.total_rotation = 0;
    this.rotation_happened = false;
    this.previous_rotation_value = 0;
    this.projMatrix = new Matrix4()
    this.fov = 50;
  }

  forward() {
    // function for moving forward
    var distance_vector = this.at.subtract(this.eye); // d = at - eye
    distance_vector = distance_vector.divide(distance_vector.length());
    this.eye = this.eye.add(distance_vector);     // eye = eye + d
    this.at = this.at.add(distance_vector);       // at = at + d
    // console.log("lp",this.eye.x, this.eye.y, this.eye.z);

    // changing the player's position as well
    this.player_position_y -= 1;
  }

  back() {
    // function for moving back
    var distance_vector = this.at.subtract(this.eye); // d = at - eye
    distance_vector = distance_vector.divide(distance_vector.length());
    this.eye = this.eye.subtract(distance_vector);    // eye = eye - d
    this.at = this.at.subtract(distance_vector);      // at = at - d

    // changing the player's position as well
    this.player_position_y += 1;
  }

  right() {
    // function for moving left
    var distance_vector = this.at.subtract(this.eye);
    distance_vector = distance_vector.divide(distance_vector.length());
    var left = distance_vector.cross(this.up);
    left = left.divide(left.length()); // normalizing it
    this.eye = this.eye.add(left);
    this.at = this.at.add(left);

    // changing the player's position as well
    this.player_position_x += 1;

  }

  left() {
    // function for moving right
    var distance_vector = this.at.subtract(this.eye);
    distance_vector = distance_vector.divide(distance_vector.length());
    var right = distance_vector.negative().cross(this.up);
    right = right.divide(right.length()) // normalizing it
    this.eye = this.eye.add(right);
    this.at = this.at.add(right);

    // changing the player's position as well
    this.player_position_x -= 1;
  }

  panLeft() {
    var distance_vector = this.at.subtract(this.eye);
    var d_v = new Vector3([distance_vector.x, distance_vector.y, distance_vector.z]);
    var alpha = 2;
    var rotation_matrix = new Matrix4();
    rotation_matrix.setRotate(alpha, this.up.x, this.up.y, this.up.z);
    var f_prime = rotation_matrix.multiplyVector3(d_v);
    var f_prime_vector = new Vector(f_prime.elements[0], f_prime.elements[1], f_prime.elements[2]);
    var diff = this.at.subtract(this.eye.add(f_prime_vector));
    var diff_normal = diff.divide(diff.length());
    this.at = this.eye.add(f_prime_vector);

    var prev_rot_value = this.previous_rotation_value % 360; // this needs to store the previous value when the cahnge was made
    // right nor it is not stoing the correct value
    this.total_rotation += 2;
    var rotation_value = this.total_rotation % 360;
    if ((rotation_value <= 40) && (rotation_value > 0)) {
      if (!((prev_rot_value <= 40) && (prev_rot_value > 0))) {
        // this.player_position_x -= 1;
        this.player_position_y -= 1;
        this.player_position_y -= 1;
        this.player_position_x += 1
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 90) && (rotation_value > 40)) {
      if (!((prev_rot_value <= 90) && (prev_rot_value > 40))) {
        this.player_position_x += 1;
        this.player_position_x += 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 130) && (rotation_value > 90)) {
      if (!((prev_rot_value <= 130) && (prev_rot_value> 90))) {
        this.player_position_x += 1;
        this.player_position_x += 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 180) && (rotation_value > 130)) {
      if ((prev_rot_value <= 130) && (prev_rot_value > 90)) {
        this.player_position_y += 1;
        this.player_position_y += 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 220) && (rotation_value > 180)) {
      if (!((prev_rot_value <= 220) && (prev_rot_value > 180))) {
        this.player_position_y += 1;
        this.player_position_y += 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 270) && (rotation_value > 220)) {
      if (!((prev_rot_value <= 270) && (prev_rot_value > 220))) {
        this.player_position_x -= 1;
        this.player_position_x -= 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 310) && (rotation_value > 270)) {
      if (!((prev_rot_value <= 310) && (prev_rot_value > 270))) {
        this.player_position_x -= 1;
        this.player_position_x -= 1;
        this.previous_rotation_value = this.total_rotation;
      }
    } else if ((rotation_value <= 360) && (rotation_value > 310)) {
      if (!((prev_rot_value <= 360) && (prev_rot_value > 310))) {
        this.player_position_x -= 1;
        this.player_position_y += 1;
        this.player_position_y += 1;
        this.previous_rotation_value = this.total_rotation;
      }
    }

    // changing the player location
    // var r = Math.sqrt(distance_vector.x**2 + distance_vector.y**2 + distance_vector.z**2);
    // console.log(Math.cos(alpha * (Math.PI / 180)));
    // console.log(Math.sin(alpha * (Math.PI / 180)));
    // console.log("Value previously: ", this.player_position_x, this.player_position_y);
    //
    //
    // var x_component = r * Math.cos(alpha * (Math.PI / 180));
    // var y_component = r * Math.sin(alpha * (Math.PI / 180));
    // //
    // // console.log("Value after: ", this.player_position_x, this.player_position_y);
    //
    // var normalized = this.at.divide(this.at.x**2 + this.at.y**2 + this.at.z**2);
    // this.player_position_x += Math.ceil(normalized.x);
    // this.player_position_y += Math.ceil(normalized.z);

  }

  panRight() {
    var distance_vector = this.at.subtract(this.eye);
    var d_v = new Vector3([distance_vector.x, distance_vector.y, distance_vector.z]);
    var alpha = - 2;
    this.total_rotation -= 2;
    var rotation_matrix = new Matrix4();
    rotation_matrix.setRotate(alpha, this.up.x, this.up.y, this.up.z);
    var f_prime = rotation_matrix.multiplyVector3(d_v);
    var f_prime_vector = new Vector(f_prime.elements[0], f_prime.elements[1], f_prime.elements[2]);
    this.at = this.eye.add(f_prime_vector);
  }

  panMouseLeft(difference) {
    var distance_vector = this.at.subtract(this.eye);
    var d_v = new Vector3([distance_vector.x, distance_vector.y, distance_vector.z]);
    var alpha = difference;
    var rotation_matrix = new Matrix4();
    rotation_matrix.setRotate(alpha, this.up.x, this.up.y, this.up.z);
    var f_prime = rotation_matrix.multiplyVector3(d_v);
    var f_prime_vector = new Vector(f_prime.elements[0], f_prime.elements[1], f_prime.elements[2]);
    var diff = this.at.subtract(this.eye.add(f_prime_vector));
    var diff_normal = diff.divide(diff.length());
    this.at = this.eye.add(f_prime_vector);
  }

  panMouseRight(difference) {
    var distance_vector = this.at.subtract(this.eye);
    var d_v = new Vector3([distance_vector.x, distance_vector.y, distance_vector.z]);
    var alpha = - difference;
    this.total_rotation -= 2;
    var rotation_matrix = new Matrix4();
    rotation_matrix.setRotate(alpha, this.up.x, this.up.y, this.up.z);
    var f_prime = rotation_matrix.multiplyVector3(d_v);
    var f_prime_vector = new Vector(f_prime.elements[0], f_prime.elements[1], f_prime.elements[2]);
    this.at = this.eye.add(f_prime_vector);
  }

// In your camera class, create a function called "panLeft":
// Compute the forward vector  f = at - eye;
// Rotate the vector f by alpha (decide a value) degrees around the up vector.
// Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z).
// Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
// Update the "at"vector to be at = eye + f_prime;
// In your camera class, create a function called "panRight":
// Same idea as panLeft, but rotate u by -alpha degrees around the up vector.
}
