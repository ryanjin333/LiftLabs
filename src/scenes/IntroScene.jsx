import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Dumbbell, Animation, AnimationSelf } from "./models";
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";
import { Gltf } from "@react-three/drei/native";
import { GLView } from "expo-gl";

const IntroScene = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1, backgroundColor: "#fff" }}
        onContextCreate={async (gl) => {
          // Set up WebGL context here if needed, e.g., for rendering
        }}
      >
        <Canvas style={{ flex: 1 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </Canvas>
      </GLView>
    </View>
  );
};

export default IntroScene;
