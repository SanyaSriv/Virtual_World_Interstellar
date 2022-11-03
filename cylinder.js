class Cylinder {
  constructor() {
    this.color = [1.0, 0.0, 0.0, 1.0];
    this.type = "sphere";
    this.matrix = new Matrix4();
  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // first side
    let A = [0.0,0.0,0.0];
    let B = [1.0,1.0,0.0];
    let C = [1.0,0.0,0.0];

    let center_x = 0.0;
    let center_y = 0.0;
    let step = 360 / 30;
    let scaling_factor = 1/2;

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

      // console.log(point0_x, point0_y, point1_x, point1_y, point2_x, point2_y);
      // Draw
      // front circle
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      drawTriangles3D([0.0,0.0,0.0,  point1_x, point1_y, 0.0,   point2_x,point2_y, 0.0]);
      //back circle
      gl.uniform4f(u_FragColor, rgba[0] * 0.4, rgba[1] * 0.4, rgba[2] * 0.4, rgba[3]);
      drawTriangles3D([0.0,0.0,1.0,  point1_x, point1_y, 1.0,   point2_x,point2_y, 1.0]);
      // connecting these 2 by 2 triangles
      gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
      drawTriangles3D([point1_x, point1_y, 0.0,  point1_x, point1_y, 1.0,   point2_x,point2_y, 1.0]);
      drawTriangles3D([point2_x,point2_y, 1.0,  point2_x,point2_y, 0.0,  point1_x, point1_y, 0.0,]);
    }


}

}
