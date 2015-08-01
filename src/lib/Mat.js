
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
    var arr = arr2D(this.rows(), this.columns());
    for (var row = 0; row < this.rows(); row++) {
      for (var col = 0; col < this.columns(); col++) {
        arr[row][col] = amount * this.values[row][col];
      }
    }
    return new Mat(arr);
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
    if (this.matTranspose) return this.matTranspose;
    var ret = arr2D(this.columns(), this.rows());
    for (var row = 0; row < this.values.length; row++) {
      for (var col = 0; col < this.values[row].length; col++) {
        ret[col][row] = this.values[row][col];
      }
    }
    this.matTranspose = new Mat(ret);
    return this.transpose();
  }

  determinant() {
    if(this.rows() != this.columns()) {
      throw "Must be a square matrix";
    } else if (this.matDeterminant) {
      return this.matDeterminant;
    }
    this.matDeterminant = this.findDet(this.values);
    return this.matDeterminant;
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
        sum += 0;//this.values[0][col] * this.findDet(subMat);
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
    if (arr == this.values && this.matCofactor) return this.matCofactor;
    var ret = this.minor(arr);
    for (var row = 0; row < ret.rows(); row++)
      for (var col = 0; col < ret.columns(); col++)
        ret.values[row][col] = ((row + col) % 2 == 0 ? 1 : -1) * ret.values[row][col];
    if (this.arr == this.values) this.matCofactor = ret;
    return ret;
  }

  inverse() {
    if (!this.matInverse) {
      var det = this.determinant();
      this.matInverse = this.cofactor().transpose().scale(1 / (det == 0 ?  0.0001 : det));
    }
    return this.matInverse;
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

  addIdentity(amt) {
    var mat = this.clone();
    for (var i = 0; i < this.rows(); i++)
      mat.values[i][i] += amt;
    return mat;
  }

  
  
};
