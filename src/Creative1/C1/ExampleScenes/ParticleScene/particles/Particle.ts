import {Basic2DParticle, Color, Vec2, Vec3} from "../../../../../anigraph";

export class Particle extends Basic2DParticle{
    protected _color!:Color;
    protected _radius!:number;
    protected _alpha!:number;
    protected _direction!:Vec2;
    protected  _state!:number; // 0 -> starting state off canvas, 1 -> on canvas, 2 -> dying

    get color(){
        return this._color;
    }
    set color(v:Color){
        this._color = v;
    }

    get direction() {
        return this._direction;
    }

    set direction(d:Vec2) {
        this._direction.x = d.x;
        this._direction.y = d.y;
    }

    get state() {
        return this._state;
    }

    set state(s:number) {
        this._state = s;
    }

    constructor(id:number, position?:Vec2, radius?:number, color?:Color) {
        super();
        this._id = id;
        this._direction = new Vec2(0,0);
        this._state = 0; // initial state, off canvas
        if(position){this.position = position;}
        if(radius !== undefined){this.radius=radius;}
        if(color){this.color = color;}
    }
}
