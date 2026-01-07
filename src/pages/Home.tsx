import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function Box(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#60a5fa' : '#3b82f6'} />
    </mesh>
  );
}

const Home = () => {
  return (
    <div className="w-full h-screen bg-slate-950">
      <div className="absolute top-10 left-10 z-10 text-white pointer-events-none">
        <h1 className="text-4xl font-bold mb-2">Three.js Practice</h1>
        <p className="text-slate-400">Click the cube to scale it, hover to change color.</p>
        <p className="text-sm text-slate-500 mt-4">Drag to rotate • Scroll to zoom</p>
      </div>
      
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableDamping />
        
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1000} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={500} />
        
        <Box position={[0, 0, 0]} />
        <Box position={[0, 0, 0]} />
        <Box position={[0, 0, 0]} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <gridHelper args={[20, 20, 0x444444, 0x222222]} position={[0, -2, 0]} />
      </Canvas>
    </div>
  );
};

export default Home;
