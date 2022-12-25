import { Precision } from "../Precision";

export const VecEqual = {
  VecEqual(received, other, msg) {
    const pass = received.isEqualTo(other);
    if (pass) {
      return {
        message: () => `expected ${other} == ${received}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${other.toString()}, got ${received.toString()}\n` + msg,
        pass: false,
      };
    }
  },
};

export const VecCloseTo = {
  VecCloseTo(received, other, msg) {
    const pass = received.isEqualTo(other, Precision.VECTOR_TEST_PRECISION);
    if (pass) {
      return {
        message: () => `expected (close to) ${other} == ${received}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected (close to) ${other.toString()}, got ${received.toString()}\n` +
          msg,
        pass: false,
      };
    }
  },
};

// writing a derived expect jest test... for matrices
export const MatrixEqual = {
  MatrixEqual(received, other, msg) {
    const pass = received.toBeCloseTo(other);
    if (pass) {
      return {
        message: () => `expected ${received} == ${other}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${other.toString()}, got ${received.toString()}\n` + msg,
        pass: false,
      };
    }
  },
};

// writing a derived expect jest test... for matrices
export const MatrixCloseTo = {
  MatrixCloseTo(received, other, msg) {
    const pass = received.isEqualTo(other, Precision.VECTOR_TEST_PRECISION);
    if (pass) {
      return {
        message: () => `expected (close to) ${received} == ${other}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected (close to) ${other.toString()}, got ${received.toString()}\n` +
          msg,
        pass: false,
      };
    }
  },
};

export const VertexArray2DToBeCloseTo = {
  VertexArray2DToBeCloseTo(received, other, msg) {
    let temp = true;
    for (let v = 0; v < received.length; v++) {
      temp &= received.position.getAt(v).isEqualTo(other.position.getAt(v));
    }
    const pass = temp;
    if (pass) {
      return {
        message: () => `expected ${other} == ${received}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${other.toString()}, got ${received.toString()}\n` + msg,
        pass: false,
      };
    }
  },
};

export const VertexArray2DCircToBeCloseTo = {
  VertexArray2DCircToBeCloseTo(received, other, msg) {
    function closeto(va, vb, shift) {
      let temp = true;
      for (let v = 0; v < vb.length; v++) {
        let ind = (v + shift) % vb.length;
        temp &= vb.position.getAt(v).isEqualTo(va.position.getAt(ind));
      }
      return temp;
    }
    let shifteq = false;
    for (let v = 0; v < other.length; v++) {
      if (closeto(received, other, v)) {
        shifteq = true;
      }
    }
    const pass = shifteq;
    if (pass) {
      return {
        message: () => `expected (shift) ${other} == ${received}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected a circ shift of ${other.toString()}, got ${received.toString()}\n` +
          msg,
        pass: false,
      };
    }
  },
};
