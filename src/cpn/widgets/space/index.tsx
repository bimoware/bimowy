import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Space() {
  return (
    <Canvas>
      <PerspectiveCamera position={[2, 5, 5]} fov={500} />
      <OrbitControls />
      <GizmoHelper>
        <GizmoViewport />
      </GizmoHelper>
      <ambientLight />
      <axesHelper />
      {(
        [
          [0, 0, -Math.PI / 2],
          [0, Math.PI / 2, 0],
          [Math.PI / 2, 0, 0],
        ] as const
      ).map((gridRotation, i) => (
        <Grid
          key={i}
          fadeDistance={30}
          fadeStrength={5}
          cellColor="gray"
          sectionColor="lightblue"
          infiniteGrid
          followCamera
          rotation={gridRotation}
        />
      ))}

      <mesh position={[1, 2, 2]}>
        <sphereGeometry args={[0.1, 2 ** 5, 2 ** 5]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>
    </Canvas>
  );
}
