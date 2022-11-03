class Triangle3D {
  constructor() {
    this.color = [1.0, 0.0, 0.0, 1.0];
    this.type = "triangle3d";
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
    drawTriangles3D([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0]);

    // second side
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3D([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0]);

    // 3rd side - connecting 1st and 2nd from top
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangles3D([1.0,0.0,1.0,  1.0,0.0,0.0,   1.0,1.0,0.0]);
    drawTriangles3D([1.0,1.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0]);


    // connecting from the back
    gl.uniform4f(u_FragColor, rgba[0] * 0.4, rgba[1] * 0.4, rgba[2] * 0.4, rgba[3]);
    drawTriangles3D([1.0,1.0,1.0,  0.0,0.0,0.0,   0.0,0.0,1.0]);
    drawTriangles3D([1.0,1.0,1.0,  1.0,1.0,0.0,   0.0,0.0,0.0]);

    // bottom
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangles3D([1.0,0.0,0.0,  1.0,0.0,1.0,   0.0,0.0,1.0]);
    drawTriangles3D([0.0,0.0,1.0,  0.0,0.0,0.0,   1.0,0.0,0.0]);

  }

}
