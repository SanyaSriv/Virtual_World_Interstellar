class Cube {
  constructor() {
    this.color = [1.0, 0.0, 0.0, 1.0];
    this.type = "cube";
    this.matrix = new Matrix4();
    this.vertices = null;
    this.color = null;
  }

  generateVertices() {
    let v = []
    let c = []
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    v.push(0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0);
    c.push(rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    v.push(0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0);
    c.push(rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    v.push(0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0);
    c.push(rgba[0] * 0.2, rgba[1] * 0.2, rgba[2] * 0.2, rgba[3]);
    v.push(0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0);
    c.push(rgba[0] * 0.2, rgba[1] * 0.2, rgba[2] * 0.2, rgba[3]);
    v.push(0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);
    v.push(0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0);
    c.push(rgba[0], rgba[1], rgba[2], rgba[3]);

    this.vertices = new Float32Array(v);
    this.color = new Float32Array(c);

  }
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // if (this.vertices === null) {
    //   this.generateVertices();
    // }
    // console.log(this.vertices);
    // drawTriangles3D(this.vertices, this.color);

    // front
    drawTriangles3D([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0]);

    // top
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3D([0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    drawTriangles3D([0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);

    // left
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0]);

    // right
    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangles3D([0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    drawTriangles3D([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0]);

    // bottom
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3D([1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);
    drawTriangles3D([1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0]);
    //
    // botton
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3D([0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0]);
    drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0]);
  }

  // }
}
