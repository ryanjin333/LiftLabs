// import { Suspense, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber/native";
// import { Dumbbell, Animation, AnimationSelf } from "./models";
// import useControls from "r3f-native-orbitcontrols";
// import { View } from "react-native";
// import { Gltf } from "@react-three/drei/native";

// const IntroScene = () => {
//   const [OrbitControls, events] = useControls();
//   return (
//     <View className="flex-1 bg-primary" {...events}>
//       <Canvas>
//         <ambientLight intensity={0.7} />
//         <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
//         <OrbitControls enablePan={false} enableZoom={false} />

//         <Suspense fallback={null}>
//           <AnimationSelf position={[0, 0, 0]} />
//         </Suspense>
//       </Canvas>
//     </View>
//   );
// };

// export default IntroScene;
import { Canvas } from "@react-three/fiber/native";
import { View, Text } from "react-native";

const IntroScene = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Text style={{ color: "white", position: "absolute", top: 50 }}>
        Loading Scene...
      </Text>
      <Canvas>
        <ambientLight intensity={0.5} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </View>
  );
};

export default IntroScene;
