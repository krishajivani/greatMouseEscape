/***
 * Convenience class for specifying and dealing with some precision issues.
 */
export class Precision {
  static epsilon: number = 1e-6;
  static SMALLEST: number = 2 * Number.MIN_VALUE;
  static VECTOR_TEST_PRECISION: number = 1e-6;
  /**
   * Returns true if the number is smaller than or equal to epsilon
   *
   * @param a the number being evaluated
   * @param epsilon
   * @returns
   */
  static isTiny(a: number, epsilon: number = 1e-6) {
    return Math.abs(a) <= epsilon;
  }

  static TinyRotation: number = 0.00001;

  /**
   * Returns the number if it is greater than or equal to epsilon, otherwise
   * returns signed epsilon.
   *
   * Values smaller than epsilon are clamped to be epsilon.
   *
   * @param a the number being evaluated
   * @param epsilon
   * @returns
   */
  static ClampAbsAboveEpsilon(a: number, epsilon: number = 1e-6) {
    if (!(Math.abs(a) < epsilon)) {
      return a;
    } else {
      return a >= 0 ? epsilon : -epsilon;
    }
  }

  /**
   * Returns true if a minus b is less than epsilon
   *
   * @param a
   * @param b
   * @returns
   */
  static PEQ(a: number, b: number) {
    return Math.abs(a - b) < this.epsilon;
  }

  /**
   * Returns the number if it is greater than or equal to epsilon, otherwise
   * returns signed epsilon.
   *
   * Values smaller than epsilon are clamped to be epsilon.
   *
   * @param a the number being evaluated
   * @param epsilon
   * @returns
   */
  static signedTiny(a: number, epsilon?: number) {
    const tinyValue = epsilon ? epsilon : Precision.epsilon;
    if (!(Math.abs(a) < tinyValue)) {
      return a;
    } else {
      return a >= 0 ? tinyValue : -tinyValue;
    }
  }

  /**
   * Returns the integer if it is greater than or equal to 1, otherwise returns
   * positive or negative 1.
   *
   * Values smaller than 1 are clamped to be 1.
   *
   * @param a the number evaluated
   * @returns
   */
  static signedTinyInt(a: number) {
    if (Math.abs(a) < 1) {
      if (a < 0) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return a;
    }
  }
}
