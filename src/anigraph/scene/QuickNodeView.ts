import {ANodeView, NodeViewCallback} from "./ANodeView";
import {ANodeModel} from "./ANodeModel";


export class QuickNodeView extends ANodeView{
    protected _initCallback!:NodeViewCallback;
    protected _updateCallback!:NodeViewCallback;
    protected _disposeCallback!:NodeViewCallback;

    init(){
        this._initCallback(this);
    }

    update(){
        this._updateCallback(this);
    }

    dispose() {
        super.dispose();
        this._disposeCallback(this);
    }

    constructor(model?:ANodeModel, init?:NodeViewCallback, update?:NodeViewCallback, dispose?:NodeViewCallback){
        super();
        if(model && (init===undefined)){
            throw new Error("If model provided to instructor, you must also provide init function")
        }
        if(init){this._initCallback = init;}
        if(update){this._updateCallback = update;}
        if(dispose){this._disposeCallback = dispose;}
        if(model) {
            this.setModel(model);
        }
    }

    static Create(model:ANodeModel, init:NodeViewCallback, update?:NodeViewCallback, dispose?:NodeViewCallback){
        let newView = new QuickNodeView();
        newView._initCallback = init;
        if(update){newView._updateCallback = update;}
        if(dispose){newView._disposeCallback = dispose;}
        newView.setModel(model);
        return newView;
    }
}

