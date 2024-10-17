import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Dumbbell } from "./models";
import useControls from "r3f-native-orbitcontrols";
import { View } from "react-native";
//import { useGLTF } from "@react-three/drei/native";

// function Model(props) {
//   const gltf = useGLTF(
//     "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/Avocado/glTF/Avocado.gltf"
//   );
//   return <primitive {...props} object={gltf.scene} />;
// }

const RotatingBox = () => {
  const boxRef = useRef();

  // Rotate the box on each frame
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.01;
      boxRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={boxRef}>
      {/* A simple box geometry */}
      <boxGeometry args={[1, 1, 1]} />
      {/* Apply a basic material */}
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};

const IntroScene = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View className="flex-1" {...events}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <OrbitControls enablePan={false} enableZoom={false} />
        <Suspense>
          <Dumbbell />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default IntroScene;
