import {
    CameraControls,
    ContactShadows,
    Environment,
    Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";

interface DotsProps {
    [key: string]: any;
}

const Dots = (props: DotsProps) => {
    const { loading } = useChat();
    const [loadingText, setLoadingText] = useState<string>("");
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingText((loadingText) => {
                    if (loadingText.length > 2) {
                        return ".";
                    }
                    return loadingText + ".";
                });
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLoadingText("");
        }
    }, [loading]);
    if (!loading) return null;
    return (
        <group {...props}>
            <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
                {loadingText}
                <meshBasicMaterial attach="material" color="black" />
            </Text>
        </group>
    );
};

export const Experience = () => {
    const cameraControls = useRef<CameraControls | null>(null);
    const { cameraState } = useChat();

    useEffect(() => {
        if (!cameraControls.current) return;
        cameraControls.current.setLookAt(0, 1.7, 1, 0, 1.7, 0, true);
    }, []);

    useEffect(() => {
        if (!cameraControls.current) return;

        switch (cameraState) {
            case "zoomed":  
                cameraControls.current.setLookAt(0, 1.7, 0.5, 0, 1.7, 0, true);
                break;
            case "default":
                cameraControls.current.setLookAt(0, 1.7, 1, 0, 1.7, 0, true);
                break;
            case "zoomeout":
                cameraControls.current.setLookAt(0, 1.2, 5, 0, 1.2, 0, true);
                break;
            default:
                cameraControls.current.setLookAt(0, 1.7, 1, 0, 1.7, 0, true);
                break;
        }
        
    }, [cameraState]);

    return (
        <>
            <CameraControls
                ref={cameraControls}
                maxDistance={10}
                minDistance={0.3}
            />
            <Environment preset="sunset" background={false} />
            {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
            <Suspense>
                <Dots position-y={1.75} position-x={-0.02} />
            </Suspense>
            <Avatar />
            <ContactShadows opacity={0.7} />
        </>
    );
};
