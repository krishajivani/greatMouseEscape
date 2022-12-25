import {Precision} from "../../../anigraph";


export const ArrayEqualTo = {
    ArrayEqualTo(received, other, msg) {
        let pass = true
        if(received.length===other.length) {
            for (let v = 0; v < received.length; v++) {
                pass &= received[v] === other[v];
            }
        }else{
            pass = false;
        }
        if (pass) {
            return {
                message: () =>
                    `expected (array) ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected array ${other.toString()}, got ${received.toString()}\n` + msg,
                pass: false,
            };
        }
    },
}

export const ArrayCloseTo = {
    ArrayCloseTo(received, other, msg, threshold) {
        threshold = threshold??Precision.epsilon;
        let pass = true
        if(received.length===other.length) {
            for (let v = 0; v < received.length; v++) {
                pass &= Math.abs(received[v] - other[v]) <= threshold;
            }
        }else{
            pass = false;
        }
        if (pass) {
            return {
                message: () =>
                    `expected (array) ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected array ${other.toString()}, got ${received.toString()}\n` + msg,
                pass: false,
            };
        }
    },
}


export const VecEqual = {
    VecEqual(received, other, msg) {
        const pass = received.isEqualTo(other);
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n`+msg,
                pass: false,
            };
        }
    }
}

// writing a custom expect jest test... for matrices
export const MatrixEqual = {
    MatrixEqual(received, other, msg) {
        const pass = received.isEqualTo(other);
        if (pass) {
            return {
                message: () =>
                    `expected ${received} == ${other}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n`+msg,
                pass: false,
            };
        }
    },
}


export const VertexArray2DToBeCloseTo = {
    VertexArray2DToBeCloseTo(received, other, msg) {
        let temp = true
        for(let v=0;v<received.length;v++){
            temp &= received.position.getAt(v).isEqualTo(other.position.getAt(v));
        }
        const pass = temp
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
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
}


export const VertexArray2DCircToBeCloseTo = {
    VertexArray2DCircToBeCloseTo(received, other, msg) {
        function closeto(va, vb, shift) {
            let temp = true
            for (let v = 0; v < vb.length; v++) {
                let ind = (v+shift)%vb.length;
                temp &= vb.position.getAt(v).isEqualTo(va.position.getAt(ind));
            }
            return temp;
        }
        let shifteq = false;
        for(let v=0;v<other.length;v++){
            if(closeto(received,other,v)){
                shifteq=true;
            }
        }
        const pass = shifteq;
        if (pass) {
            return {
                message: () =>
                    `expected (shift) ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected a circ shift of ${other.toString()}, got ${received.toString()}\n` + msg,
                pass: false,
            };
        }
    },
}

function vecIsInSet(vec, set) {
    for (let v = 0; v < set.length; v++) {
        if (vec.isEqualTo(set[v])) {
            return true;
        }
    }
    return false;
}


export const VectorSetToBeCloseTo = {
    VectorSetToBeCloseTo(received, other, msg) {
        let temp = true
        // compare two sets of vectors have close vectors
        // check received is a subset of other
        for (let v = 0; v < received.length; v++) {
            temp &= vecIsInSet(received[v], other);
        }
        // check other is a subset of received
        for (let v = 0; v < other.length; v++) {
            temp &= vecIsInSet(other[v], received);
        }
        // check that the sets are the same size
        temp &= received.length === other.length;
        const pass = temp
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
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
}
