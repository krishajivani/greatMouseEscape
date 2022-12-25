import * as AAppState from "../anigraph/scene/AAppState";

var _appState:AAppState.AAppState;

export function GetAppState(){
    if(_appState===undefined){
        AAppState.SetAppState(new AAppState.AAppState());
        _appState = AAppState.GetAAppStateBase();
    }
    return _appState;

}
