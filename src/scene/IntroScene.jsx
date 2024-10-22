import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Dumbbell } from "./models";
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";
import { Gltf } from "@react-three/drei/native";

const IntroScene = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View className="flex-1" {...events}>
      <Canvas
        gl={{ antialias: true }}
        // log error stop (EXGL: gl.pixelStorei() doesn't support this parameter yet!)
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const originalPixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            if (parameter === _gl.UNPACK_FLIP_Y_WEBGL) {
              return originalPixelStorei(...args);
            }
            return originalPixelStorei(...args);
          };
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
        <OrbitControls enablePan={false} enableZoom={false} />

        <Suspense>
          <Dumbbell />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default IntroScene;
