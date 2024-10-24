import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { useEffect } from "react";

const AnimationSelf = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    require("../../assets/models/animation_self.glb")
  );
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions["Armature Test CharacterAction"]) {
      actions["Armature Test CharacterAction"].play();
    }
  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="camera_pivot" rotation={[-0.218, 0, 0]} />
        <group name="Armature_Test_Character">
          <skinnedMesh
            name="Test_Character"
            geometry={nodes.Test_Character.geometry}
            material={materials["test character"]}
            skeleton={nodes.Test_Character.skeleton}
          />
          <primitive object={nodes.root} />
        </group>
      </group>
    </group>
  );
};

export default AnimationSelf;
