import React, {useEffect, useRef, useState} from "react";
import {AGLContext, AGLRenderWindow} from "../rendering";
import {ASceneController} from "../scene";

type AThreeJSContextComponentProps = {
    controller:ASceneController
    children?: React.ReactNode
}

export function AThreeJSContextComponent(props:AThreeJSContextComponentProps) {
    const [renderWindow, ] = useState(new AGLRenderWindow(new AGLContext()));
    async function initThreeJSContext(contextParentElement: HTMLDivElement) {
        renderWindow.setContainer(contextParentElement)
        // await props.controller?.model?.PreloadAssets();
        await renderWindow.setDelegate(props.controller);
        renderWindow.startRendering();
    }
    const container = useRef(null as unknown as HTMLDivElement);
    useEffect(() => {
        (async () => {
            await initThreeJSContext(container.current);
        })();
    });
    return (
        <div className="canvas">
            <div
                className="anigraphcontainer"
                ref={container}
                key={renderWindow.uid}
            >
                {props.children}
            </div>
        </div>
    );
}
