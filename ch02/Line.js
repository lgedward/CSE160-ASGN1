class Line {
    constructor(start, end, color, size) {
      this.start = start;
      this.end = end;
      this.color = color;
      this.size = size;
    }
  
    render() {
      var vertices = new Float32Array([
        this.start[0], this.start[1], 0.0,
        this.end[0], this.end[1], 0.0
      ]);
  
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      var FSIZE = vertices.BYTES_PER_ELEMENT;
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
      gl.enableVertexAttribArray(a_Position);
  
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.drawArrays(gl.LINES, 0, 2);
    }
  }
  