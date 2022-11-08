class Cube {
  constructor() {
    this.color = [1.0, 0.0, 0.0, 1.0];
    this.type = "cube";
    this.matrix = new Matrix4();
    // this.vertices = [
    //   0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0,
    //   0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0,
    //   0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0,
    //   0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0,
    //   0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0,
    //   0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0,
    //   0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0,
    //   1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0,
    //   1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0,
    //   1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0,
    //   0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0,
    //   0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0
    // ];
    // this.uv_cord = [
    //   0,0,1,1,1,0,
    //   0,0,0,1,1,1,
    //   0,0,0,1,1,1,
    //   0,0,1,1,1,0,
    //   0,0,1,0,1,1,
    //   0,0,0,1,1,1,
    //   0,0,0,1,1,1,
    //   1,0,0,0,1,1,
    //   0,0,1,1,0,1,
    //   0,0,1,0,1,1,
    //   0,1,1,1,1,0,
    //   0,1,0,0,1,0
    // ]
    this.color = null;
    this.textureNum = -2;
    this.factor = 1;
    this.color_ratio = 0;
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    // console.log("Texture num is", this.textureNum);
    // pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform1i(u_factor, this.color_ratio);
    // if (this.vertices === null) {
    //   this.generateVertices();
    // }
    // console.log(this.vertices);
    // drawTriangles3D(this.vertices, this.color);

    front
    drawTriangles3DUV([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0], [0,0,1,1,1,0]);
    // drawTriangles3D([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0]);
    drawTriangles3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0], [0,0,0,1,1,1]);
    // drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0]);

    // top
    // gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3DUV([0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0], [0,0,0,1,1,1]);
    // drawTriangles3D([0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    drawTriangles3DUV([0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0], [0,0,1,1,1,0]);
    // drawTriangles3D([0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);

    // left
    // gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangles3DUV([0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0], [0,0,1,0,1,1]);
    // drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0]);
    drawTriangles3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0], [0,0,0,1,1,1]);
    // drawTriangles3D([0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0]);

    // right
    // gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangles3DUV([0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0], [0,0,0,1,1,1]);
    // drawTriangles3D([0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    drawTriangles3DUV([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0], [1,0,0,0,1,1]);
    // drawTriangles3D([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0]);

    // bottom
    // gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3DUV([1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0], [0,0,1,1,0,1]);
    // drawTriangles3D([1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);
    drawTriangles3DUV([1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0], [0,0,1,0,1,1]);
    // drawTriangles3D([1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0]);
    //
    // botton
    // gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangles3DUV([0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0], [0,1,1,1,1,0]);
    // drawTriangles3D([0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0]);
    drawTriangles3DUV([0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0], [0,1,0,0,1,0]);
    // drawTriangles3D([0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0]);
  }

  renderFast() {
    // var xy = this.position;
    var rgba = this.color;
    // var size = this.size;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform1f(u_factor, this.color_ratio);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    var verticesArray = []
    var uv_array = []
    verticesArray = verticesArray.concat([0.0,0.0,0.0,  1.0,1.0,0.0,   1.0,0.0,0.0]);
    uv_array = uv_array.concat([0,0,1,1,1,0]);

    verticesArray = verticesArray.concat([0.0,0.0,0.0,  0.0,1.0,0.0,   1.0,1.0,0.0]);
    uv_array = uv_array.concat([0,0,0,1,1,1]);

    verticesArray = verticesArray.concat([0.0,1.0,0.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    uv_array = uv_array.concat([0,0,0,1,1,1]);

    verticesArray = verticesArray.concat([0.0,1.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);
    uv_array = uv_array.concat([0,0,1,1,1,0]);

    verticesArray = verticesArray.concat([0.0,0.0,0.0,  0.0,0.0,1.0,   0.0,1.0,1.0]);
    uv_array = uv_array.concat([0,0,1,0,1,1]);

    verticesArray = verticesArray.concat([0.0,0.0,0.0,  0.0,1.0,0.0,   0.0,1.0,1.0]);
    uv_array = uv_array.concat([0,0,0,1,1,1]);

    verticesArray = verticesArray.concat([0.0,0.0,1.0,  0.0,1.0,1.0,   1.0,1.0,1.0]);
    uv_array = uv_array.concat([0,0,0,1,1,1]);

    verticesArray = verticesArray.concat([1.0,0.0,1.0,  0.0,0.0,1.0,   1.0,1.0,1.0]);
    uv_array = uv_array.concat([1,0,0,0,1,1]);

    verticesArray = verticesArray.concat([1.0,0.0,0.0,  1.0,1.0,1.0,   1.0,1.0,0.0]);
    uv_array = uv_array.concat([0,0,1,1,0,1]);

    verticesArray = verticesArray.concat([1.0,0.0,0.0,  1.0,0.0,1.0,   1.0,1.0,1.0]);
    uv_array = uv_array.concat([0,0,1,0,1,1]);

    verticesArray = verticesArray.concat([0.0,0.0,0.0,  1.0,0.0,0.0,   1.0,0.0,1.0]);
    uv_array = uv_array.concat([0,1,1,1,1,0]);

    verticesArray = verticesArray.concat([0.0,0.0,0.0,  0.0,0.0,1.0,   1.0,0.0,1.0]);
    uv_array = uv_array.concat([0,1,0,0,1,0]);
    drawTriangles3DUV(verticesArray, uv_array);
    // drawTriangles3DUV(this.vertices, this.uv_cord);
  }

  // }
}
