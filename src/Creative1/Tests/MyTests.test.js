import { V2 } from "../../anigraph";
import {
    ArrayEqualTo,
    ArrayCloseTo,
    MatrixEqual,
    VecEqual,
    VertexArray2DCircToBeCloseTo,
    VertexArray2DToBeCloseTo,
} from "./helpers/TestHelpers";
expect.extend(ArrayEqualTo);
expect.extend(ArrayCloseTo);
expect.extend(VertexArray2DToBeCloseTo);
expect.extend(MatrixEqual);
expect.extend(VecEqual);
expect.extend(VertexArray2DCircToBeCloseTo);
import {LineSegment} from "../Polygon2D";


describe("LineSegment Intersection Tests", () => {
    test("Simple intersection", () => {
        const segX = new LineSegment(V2(-1,0), V2(1,0));
        const segY = new LineSegment(V2(0,-1), V2(0,1));
        let intersection = segX.intersect(segY);
        expect(intersection.elements).ArrayCloseTo([0,0])
    });
});
