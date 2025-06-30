import { Loader, OrbitControls, useCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
    return (
        <>
            <Loader />
            <Leva hidden />
            <UI />
            <Canvas
                shadows
                camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 10] }}
            >
                <Experience />
                {/* Add OrbitControls with min and max zoom */}
                <ambientLight />
                {/* <OrbitControls
                    enableZoom={true}
                    minDistance={1.5}
                    maxDistance={10}
                    position={[0, 0, 2000]}
                /> */}
            </Canvas>
        </>
    );
}

export default App;
