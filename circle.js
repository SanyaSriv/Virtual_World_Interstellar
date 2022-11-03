class Circle {
  constructor() {
    this.color = [0.0, 0.0, 0.0, 1.0];
    this.position = [0.0, 0.0, 0.0];
    this.type = "circle";
    this.size = 5.0;
    this.segments = 0;
  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Passing the size now
    gl.uniform1f(u_PointSize, size);

    let center_x = xy[0];
    let center_y = xy[1];
    let step = 360 / this.segments;
    let scaling_factor = this.size / 300;

    // i is the angle in this loop
    for (var i = 0; i < 360; i += step) {
      // getting the angles
      let angle1 = i * (Math.PI / 180);
      let angle2 = (i + step) * (Math.PI / 180);

      // point 1
      var point0_x = center_x;
      var point0_y = center_y;

      // point2
      var point1_x = center_x + (Math.cos(angle1) * scaling_factor);
      var point1_y = center_y + (Math.sin(angle1) * scaling_factor);

      // point3
      var point2_x = center_x + (Math.cos(angle2) * scaling_factor);
      var point2_y = center_y + (Math.sin(angle2) * scaling_factor);

      // Draw
      drawTriangles([point0_x, point0_y, point1_x, point1_y, point2_x, point2_y]);
    }

  }
}
