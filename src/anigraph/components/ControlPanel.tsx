import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {folder, LevaPanel, levaStore, useControls, useCreateStore} from "leva";
import {AAppState} from "../scene/AAppState";
import {useSnapshot} from "valtio";

// @ts-ignore
function RenewStore({ controlSpecs, setStore }) {
    const store = useCreateStore();
    useEffect(() => {
        setStore(store);
    }, [setStore, store]);
    useControls(controlSpecs, { store });
    return <></>;
}

type ControlPanelProps = {
    appState:AAppState;
}


export function ControlPanel(props:ControlPanelProps) {
    // let standardControls = AAppState.GetAppState().getControlPanelStandardSpec();
    const [store, setStore] = useState(levaStore);
    const state = useSnapshot(props.appState.stateValues);
    // const selectionModelState = useSnapshot(appState.selectionModel.state);
    props.appState.addControlPanelListener(()=>{
        props.appState._guiKey=uuidv4();
        // setState(`${Object.keys(appState.GUIControlSpecs)}`);
    })

    return (
        <>
            <LevaPanel store={store} />
            <RenewStore
                key={state[AAppState.AppStateDefaultKeys.GUI_KEY]}
                controlSpecs={props.appState.GUIControlSpecs}
                setStore={setStore}
            />
        </>
    );
}

//
// export function ControlPanel(props:ControlPanelProps){
//
//     let standardControls = AAppState.GetAppState().getControlPanelStandardSpec();
//     const [store, setStore] = useState(levaStore);
//     const state = useSnapshot(appState.state);
//
//     const [state, setState] = useState(uuidv4());
//     appState.addControlPanelListener(()=>{
//         // setState(uuidv4());
//         setState(`${Object.keys(appState.GUIControlSpecs)}`);
//     })
//     useControls(props.appState.GUIControlSpecs);
//     return(
//         <>
//             <LevaPanel store={store} />
//             <RenewStore
//                 key={state._guiKey}
//                 controlSpecs={{
//                     ...standardControls,
//                     ModelGUI: folder({
//                         ...appState.selectionModel.getModelGUIControlSpecs(),
//                     }),
//                 }}
//                 setStore={setStore}
//             />
//         </>
//     )
// }
