import React, { useRef, useEffect } from "react";
import { useGLTF, OrthographicCamera } from "@react-three/drei/native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useFrame } from "@react-three/fiber/native";

const Dumbbell = (props) => {
  const { nodes, materials } = useGLTF(
    require("../../assets/models/dumbbell.glb")
  );
  // animations
  const dumbbellRef = useRef();

  const xRotation = useSharedValue(0);
  const yRotation = useSharedValue(0);
  const yPosition = useSharedValue(-6);
  const scale = useSharedValue(0);

  // Initial animation: Move dumbbell from bottom to center in an arc
  // useEffect(() => {
  //   // Animation sequence with two spins, short pause between spins, and longer pause after both spins
  //   yRotation.value = withRepeat(
  //     withTiming(2 * Math.PI, {
  //       duration: 5000,
  //       easing: Easing.circle, // Apply easing effect
  //     }),
  //     -1, // Repeat infinitely
  //     false // Don't reverse
  //   );
  // }, []);

  useEffect(() => {
    //animations go here
    //actions[ACTIONNAME]?.play()
    xRotation.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 7000, easing: Easing.linear }),
      -1,
      false
    );
    yRotation.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 7000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    yPosition.value = withTiming(-0.5, {
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
    });

    scale.value = withTiming(1, {
      duration: 2000, // Duration to reach full size
      easing: Easing.ease, // You can also use withSpring for a bouncing effect
    });
  }, []);
  useFrame(() => {
    //dumbbellRef.current.rotation.y = yRotation.value;
    dumbbellRef.current.rotation.set(xRotation.value, yRotation.value, 0); // apply spinning motion
    dumbbellRef.current.position.set(0, yPosition.value, 0); // apply spinning motion
    dumbbellRef.current.scale.set(scale.value, scale.value, scale.value);
  });
  return (
    <group ref={dumbbellRef} {...props} dispose={null}>
      <group scale={0.003}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder.geometry}
          material={materials["Rough Metal"]}
          rotation={[-0.661, -0.383, -2.254]}
          scale={[0.368, 3.612, 0.368]}
        />
      </group>
    </group>
  );
};
export default Dumbbell;
