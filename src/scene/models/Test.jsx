import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei/native";

const Test = (props) => {
  const { nodes } = useGLTF(require("../../assets/models/test.glb"));
  return (
    <group {...props} dispose={null}>
      <group scale={0.005}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder.geometry}
          rotation={[-0.661, -0.383, -2.254]}
          scale={[0.368, 3.612, 0.368]}
        >
          {/* Use a basic material here */}
          <meshStandardMaterial
            color="#ffffff" // White color for clear glass
            transparent={true} // Enable transparency
            opacity={0.8} // Lower opacity for see-through effect
            metalness={0.9} // Higher metalness for reflectivity
            roughness={0.1} // Low roughness for smooth/glossy look
            // transmission={0.9} // Higher transmission for refraction effect (requires WebGL2)
            ior={10} // Index of refraction for glass-like behavior
            thickness={10} // Thickness of the glass
          />
        </mesh>
      </group>
    </group>
  );
};

export default Test;
