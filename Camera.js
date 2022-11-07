class Camera {

  constructor() {
    // define everything here
    // these will start with some default values
    this.eye = new Vector(0, 1, 14);
    this.at = new Vector(0, 0, -90);
    this.up = new Vector(0, 1, 0);
    this.player_position_x = 16;
    this.player_position_y = 24;
  }

  forward() {
    // function for moving forward
    var distance_vector = this.at.subtract(this.eye); // d = at - eye
    distance_vector = distance_vector.divide(distance_vector.length());
    this.eye = this.eye.add(distance_vector);     // eye = eye + d
    this.at = this.at.add(distance_vector);       // at = at + d
    console.log("lp",this.eye.x, this.eye.y, this.eye.z);

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
    this.at = this.eye.add(f_prime_vector);

  }

  panRight() {
    var distance_vector = this.at.subtract(this.eye);
    var d_v = new Vector3([distance_vector.x, distance_vector.y, distance_vector.z]);
    var alpha = - 2;
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
