import React, { useRef, useEffect } from "react";
import { useGLTF, OrthographicCamera } from "@react-three/drei/native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useFrame } from "@react-three/fiber/native";

const Dumbbell = (props) => {
  const { nodes, materials } = useGLTF(
    require("../../assets/models/dumbbell.gltf")
  );
  // animations
  const dumbbellRef = useRef();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const z = useSharedValue(0);
  useEffect(() => {
    //animations go here
    //actions[ACTIONNAME]?.play()
    x.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
    y.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
    z.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);
  useFrame(() => {
    dumbbellRef.current.rotation.set(x.value, y.value, z.value);
  });
  return (
    <group ref={dumbbellRef} {...props} dispose={null} position={[0, -0.5, 0]}>
      <group scale={0.003}>
        <group position={[151.861, 174.884, 149.11]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder.geometry}
            material={nodes.Cylinder.material}
            position={[62.305, 80.728, 112.715]}
            rotation={[-0.661, -0.383, -2.254]}
            scale={[0.368, 3.612, 0.368]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere_3.geometry}
            material={nodes.Sphere_3.material}
            position={[-248.285, -210.688, -68.408]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere_2.geometry}
            material={nodes.Sphere_2.material}
            position={[83.131, -37.007, -303.171]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere.geometry}
            material={nodes.Sphere.material}
            position={[-277.354, -11.906, -129.15]}
          />
        </group>
        <pointLight
          intensity={1}
          decay={2}
          distance={2000}
          position={[-130.211, 158.281, 6.928]}
        />
        <OrthographicCamera
          makeDefault={false}
          far={100000}
          near={0}
          position={[610.886, 619.926, 1236.136]}
          rotation={[-0.405, 0.375, 0.156]}
        />
      </group>
    </group>
  );
};
export default Dumbbell;
