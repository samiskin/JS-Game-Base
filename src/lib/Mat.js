
function arr2D(rows, columns) {
  var arr = new Array(rows);
  for (var i = 0; i < rows; i++) {
    arr[i] = new Array(columns);
  }
  return arr;
}

export default class Mat {

  constructor(arr = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
    this.values = arr; // Array of arrays
  }

  clone() {
    return new Mat(this.values);
  }

  scale(amount) {
    var mat = this.clone();
    for (var row = 0; row < this.rows(); row++) {
      for (var col = 0; col < this.columns(); col++) {
        mat.values[row][col] = amount * this.values[row][col];
      }
    }
    return mat;
  }

  multiply(other) {
    var { values } = this;
    var ret = [];
    for (var row = 0; row < this.rows(); row++) {
      var retRow = [];
      for (var otherCol = 0; otherCol < other.columns(); otherCol++) {
        var sum = 0;
        for (var col = 0; col < this.columns(); col++) {
          sum += values[row][col] * other.values[col][otherCol];
        }
        retRow.push(sum);
      }
      ret.push(retRow);
    }
    return new Mat(ret);
  }

  transpose() {
    var ret = arr2D(this.columns(), this.rows());
    for (var row = 0; row < this.values.length; row++) {
      for (var col = 0; col < this.values[row].length; col++) {
        ret[col][row] = this.values[row][col];
      }
    }
    return new Mat(ret);
  }

  determinant() {
    if(this.rows() != this.columns()) {
      throw "Must be a square matrix";
    }
    return this.findDet(this.values);
  }

  findDet(arr) {
    if (arr.length == 1) {
      return arr[0][0];
    } else if (arr.length == 2) {
      return arr[0][0] * arr[1][1] - arr[1][0] * arr[0][1];
    } else {
      var sum = 0;
      for (var col = 0; col < arr.length; col++) {
        var subMat = arr2D(this.rows() - 1, this.columns() - 1);
        for (var subRow = 1; subRow < this.rows(); subRow++) {
          var hitCol = false;
          for (var subCol = 0; subCol < this.columns(); subCol++) {
            if (subCol == col)
              hitCol = true;
            else {
              subMat[subRow - 1][hitCol ? subCol-1 : subCol] = this.values[subRow][subCol];
            }
          }
        }
        sum += this.values[0][col] * this.findDet(subMat);
      }
      return sum;
    }
  }

  minor(arr = this.values) {
    var minor = arr2D(this.rows(), this.columns());
    for (var row = 0; row < arr.length; row++) {
      for (var col = 0; col < arr.length; col++) {
        var subMat = arr2D(this.rows() - 1, this.columns() - 1);
        var hitRow = false;
        for (var subRow = 0; subRow < this.rows(); subRow++) {
          if (subRow == row) hitRow = true;
          else {
            var hitCol = false;
            for (var subCol = 0; subCol < this.columns(); subCol++) {
              if (subCol == col) hitCol = true;
              else {
                subMat[hitRow ? subRow - 1 : subRow][hitCol ? subCol-1 :
                  subCol] = this.values[subRow][subCol]; 
              }
            }
          }
        }
        minor[row][col] = this.findDet(subMat);
      }
    }
    return new Mat(minor);
  }

  cofactor(arr = this.values) {
    var ret = this.minor(arr);
    for (var row = 0; row < ret.rows(); row++)
      for (var col = 0; col < ret.columns(); col++)
        ret.values[row][col] = ((row + col) % 2 == 0 ? 1 : -1) * ret.values[row][col];
    return ret;
  }

  inverse() {
    return this.cofactor().transpose().scale(1 / this.determinant());
  }

  rows() {
    return this.values.length;
  }

  columns() {
    return this.values[0].length;
  }

  print() {
    for (var i = 0; i < this.rows(); i++) {
      var str = "| ";
      for (var j = 0; j < this.columns(); j++) {
        str += Math.round(this.values[i][j] * 100) / 100 + " ";
      }
      console.log(str + "|");
    }
  }

  
  
};
