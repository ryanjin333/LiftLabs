import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Ben = (props) => {
  const { nodes, materials } = useGLTF(
    require("../../assets/models/ben_rigged/scene.gltf")
  );
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group scale={100}>
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            geometry={nodes.Object_67.geometry}
            //material={materials.CharacterAtlas002}
            skeleton={nodes.Object_67.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_68.geometry}
            //material={materials.CharacterAtlas001}
            skeleton={nodes.Object_68.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_70.geometry}
            //material={materials.CharacterAtlas001}
            skeleton={nodes.Object_70.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_72.geometry}
            //material={materials.CharacterAtlas001}
            skeleton={nodes.Object_72.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_74.geometry}
            //material={materials.CharacterAtlas001}
            skeleton={nodes.Object_74.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_76.geometry}
            //material={materials.CharacterAtlas001}
            skeleton={nodes.Object_76.skeleton}
          />
          <skinnedMesh
            geometry={nodes.Object_78.geometry}
            // material={materials.CharacterAtlas001}
            skeleton={nodes.Object_78.skeleton}
          />
        </group>
      </group>
    </group>
  );
};

export default Ben;
