import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Dumbbell, Test, Ben } from "./models";
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";

const IntroScene = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View className="flex-1" {...events}>
      <Canvas gl={{ antialias: false }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <OrbitControls enablePan={false} enableZoom={false} />

        <Suspense>
          <Ben />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default IntroScene;
