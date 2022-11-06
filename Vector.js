class Vector {

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  negative() {
    return new Vector(-this.x, -this.y, -this.z);
  }
  subtract(another_vector) {
    return new Vector(this.x - another_vector.x, this.y - another_vector.y, this.z - another_vector.z);
  }
  
  add(another_vector) {
    return new Vector(this.x + another_vector.x, this.y + another_vector.y, this.z + another_vector.z);
  }

  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar, this.z / scalar);
  }
  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  length() {
    return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
  }
  cross(another_vector) {
    return new Vector(
      this.y * another_vector.z - this.z * another_vector.y,
      this.z * another_vector.x - this.x * another_vector.z,
      this.x * another_vector.y - this.y * another_vector.x
    );
  }
}
