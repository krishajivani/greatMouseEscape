import {Point2DH, Vec2, Vec3} from "../../../../anigraph";

export class LineSegment{
    start:Vec2
    end:Vec2

    /**
     * Constructor takes a starting point and an ending point.
     * @param start
     * @param end
     */
    constructor(start:Vec2, end:Vec2){
        this.start = start;
        this.end = end;
    }

    /**
     * Calculates whether there is an intersection with the provided line segment.
     * If there is an intersection, returns the location of that intersection. If not, returns undefined.
     * @param other
     * @returns {undefined | Vec2}
     */
    intersect(other:LineSegment):Vec2|undefined{
        // TODO: Replace with your code
        let lineVec1 = this.getLineVector(this);
        let lineVec2 = this.getLineVector(other);
        let crossProduct = this.getCrossProduct(lineVec1, lineVec2);

        // if cross product is [0, 0, 0], the segments are on same line (go through the 4 cases)
        // check if segments are overlapping -- "contraint" (this.start <= other.end or other.start <= this.end)
        if (crossProduct.x == 0 && crossProduct.y == 0 && crossProduct.z == 0) {
            if (this.pointInSeg(Vec3.From2DHPoint(other.start))) { // case 1 (diagrams 1 & 2)
                return other.start;
            }
            else if (this.pointInSeg(Vec3.From2DHPoint(other.end))) { // case 2 (diagram 3)
                return other.end;
            }
            else if (other.pointInSeg(Vec3.From2DHPoint(this.start))) { // case 3 (diagram 4)
                //return new Vec2(this.start.x, this.start.y);
                return this.start;
            }
            else { // not overlapping
                return undefined;
            }
        }

        // if cross product is [#, #, 0], the segments are parallel (no intersection, return undefined)
        else if (crossProduct.z == 0) {
            return undefined;
        }

        // if cross product is [#, #, 1], the segments' lines intersect at this point
        // check if both segments contain this point, if so return the point [x,y,1] as [x,y], else return undefined
        else {
            if (this.pointInSeg(crossProduct) && other.pointInSeg(crossProduct)) {
                return new Vec2(crossProduct.x, crossProduct.y);
            }
            else {
                return undefined;
            }
        }
    }


    //HELPER FUNCTIONS
    /** gets homogeneous vector representation of the line containing the segment */
    getLineVector(seg:LineSegment):Vec3 {
        // find slope based on start and end point
        let top = seg.end.y - seg.start.y;
        let bottom = seg.end.x - seg.start.x;
        let slope = top / bottom;

        // find the y-intercept
        let y_intercept = seg.start.y - (slope * seg.start.x);

        // find the a,b,c when writing the line equation as ax+by+c=0
        let a = slope;
        let b = -1;
        let c = y_intercept;

        //corner cases (slope = 0 and slope = undefined)
        if (bottom == 0) { // x = #
            a = 1;
            b = 0;
            c = -1 * seg.start.x;
        }
        else if (top == 0) { // y = #
            a = 0;
            b = 1;
            c = -1 * seg.start.y;
        }

        // scale the vector [a,b,c] so that c = 1 (call homogenize() from Vec3 class, which does this)
        let vec = new Vec3(a,b,c);
        vec.homogenize();

        // return this homogeneous line vector
        return vec;
    }

    /** gets homogenized cross product of two line vectors */
    getCrossProduct(l1:Vec3, l2:Vec3):Vec3 {
        // use functions cross() and homogenize() to do this
        let c = l1.cross(l2);
        c.homogenize();
        return c;
    }

    /** checks if the point (i.e. cross product) is contained in the segment */
    pointInSeg(point:Vec3):boolean {
        let x_min = Math.min(this.start.x, this.end.x);
        let x_max = Math.max(this.start.x, this.end.x);
        let y_min = Math.min(this.start.y, this.end.y);
        let y_max = Math.max(this.start.y, this.end.y);

        if (point.x >= x_min && point.x <= x_max) {
            if (point.y >= y_min && point.y <= y_max) {
                return true;
            }
        }

        return false;
    }
}


