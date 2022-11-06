class Camera {

  constructor() {
    // define everything here
    // these will start with some default values
    this.eye = new Vector(0, 1, 12);
    this.at = new Vector(0, 20, -90);
    this.up = new Vector(0, 1, 0);
  }

  forward() {
    // function for moving forward
    var distance_vector = this.at.subtract(this.eye); // d = at - eye
    distance_vector = distance_vector.divide(distance_vector.length());
    this.eye = this.eye.add(distance_vector);     // eye = eye + d
    this.at = this.at.add(distance_vector);       // at = at + d
  }

  back() {
    // function for moving back
    var distance_vector = this.at.subtract(this.eye); // d = at - eye
    distance_vector = distance_vector.divide(distance_vector.length());
    this.eye = this.eye.subtract(distance_vector);    // eye = eye - d
    this.at = this.at.subtract(distance_vector);      // at = at - d
  }

  left() {
    // function for moving left
    var distance_vector = this.at.subtract(this.eye);
    distance_vector = distance_vector.divide(distance_vector.length());
    var left = distance_vector.cross(this.up);
    left = left.divide(left.length()); // normalizing it
    this.eye = this.eye.add(left);
    this.at = this.at.add(left);

  }

  right() {
    // function for moving right
    var distance_vector = this.at.subtract(this.eye);
    distance_vector = distance_vector.divide(distance_vector.length());
    var right = distance_vector.negative().cross(this.up);
    right = right.divide(right.length()) // normalizing it
    this.eye = this.eye.add(right);
    this.at = this.at.add(right);
  }
}
