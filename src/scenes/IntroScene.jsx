import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Dumbbell, Animation, AnimationSelf } from "./models";
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";
import { Gltf } from "@react-three/drei/native";

const IntroScene = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View className="flex-1" {...events}>
      <Canvas>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
        <OrbitControls enablePan={false} enableZoom={false} />

        <Suspense fallback={null}>
          <AnimationSelf position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default IntroScene;
