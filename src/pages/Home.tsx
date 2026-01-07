import { 
  Scroll, 
  ScrollControls, 
  useScroll, 
  Stars, 
  Float, 
  Sparkles, 
  ContactShadows
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function StarMesh({ ...props }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 5;
    const outerRadius = 1;
    const innerRadius = 0.45;
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle - Math.PI / 2) * radius;
      const y = Math.sin(angle - Math.PI / 2) * radius;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5
  };

  return (
    <mesh {...props}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#fbbf24" 
        emissive="#fbbf24" 
        emissiveIntensity={1} 
        metalness={1} 
        roughness={0.1} 
      />
    </mesh>
  );
}

function BoxMesh({ color, ...props }: any) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Scene() {
  const box1 = useRef<THREE.Mesh>(null!);
  const box2 = useRef<THREE.Mesh>(null!);
  const box3 = useRef<THREE.Mesh>(null!);
  const starGroup = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  useFrame((state) => {
    const t = scroll.offset; 
    const range = scroll.range(0, 0.8); 
    const time = state.clock.getElapsedTime();

    if (box1.current) {
      box1.current.position.x = THREE.MathUtils.lerp(-4.5, 0, range);
      box1.current.position.y = Math.sin(time) * 0.2;
      box1.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 2, range);
      const scale = THREE.MathUtils.lerp(1.2, 0, t > 0.85 ? (t - 0.85) * 6 : 0);
      box1.current.scale.setScalar(scale);
    }

    if (box2.current) {
      box2.current.position.x = THREE.MathUtils.lerp(4.5, 0, range);
      box2.current.position.z = Math.cos(time) * 0.2;
      box2.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 2, range);
      const scale = THREE.MathUtils.lerp(1.2, 0, t > 0.85 ? (t - 0.85) * 6 : 0);
      box2.current.scale.setScalar(scale);
    }

    if (box3.current) {
      box3.current.position.y = THREE.MathUtils.lerp(6, 0, range);
      box3.current.rotation.z = THREE.MathUtils.lerp(0, Math.PI * 2, range);
      const scale = THREE.MathUtils.lerp(1.2, 0, t > 0.85 ? (t - 0.85) * 6 : 0);
      box3.current.scale.setScalar(scale);
    }

    if (starGroup.current) {
      const starScale = THREE.MathUtils.lerp(0, 3, t > 0.8 ? (t - 0.8) * 5 : 0);
      starGroup.current.scale.setScalar(starScale);
      starGroup.current.rotation.y += 0.01;
      if (ringRef.current) {
        ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
      }
    }
  });

  return (
    <>
      <Sparkles count={300} scale={15} size={2} speed={0.4} color="#ffffff" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <BoxMesh ref={box1} position={[-4.5, 0, 0]} color="#3b82f6" />
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <BoxMesh ref={box2} position={[4.5, 0, 0]} color="#6366f1" />
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <BoxMesh ref={box3} position={[0, 6, 0]} color="#8b5cf6" />
      </Float>

      <group ref={starGroup} scale={0}>
        <StarMesh position={[0, 0, -0.125]} />
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
        <pointLight intensity={50} color="#fbbf24" distance={15} />
      </group>

      <ContactShadows 
        position={[0, -4.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </>
  );
}

const Home = () => {
  return (
    <div className="w-full h-screen bg-[#020617] relative">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={1} />
        <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={1000} castShadow />
        <pointLight position={[-20, -20, -20]} intensity={500} />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={7000} 
          factor={6} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
        <ScrollControls pages={4} damping={0.2}>
          <Scene />
          
          <Scroll html>
            <div className="w-screen font-sans">
              <section className="h-screen flex flex-col justify-center px-12 md:px-32 pointer-events-none">
                <div className="max-w-2xl space-y-6 pointer-events-auto">
                  <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.8] mb-4">
                    QUANTUM <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
                      STUDIO
                    </span>
                  </h1>
                  <p className="text-xl text-slate-400 font-light">
                    Precision in every pixel. Scroll to converge.
                  </p>
                </div>
              </section>
              
              <section className="h-screen flex items-center justify-center pointer-events-none">
                <div className="max-w-xl text-center pointer-events-auto">
                  <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-widest">Synergy</h2>
                  <p className="text-slate-400 italic">Merging fragments into celestial order.</p>
                </div>
              </section>
              
              <section className="h-[200vh] flex items-end justify-center pb-32 pointer-events-none text-center">
                <div className="pointer-events-auto">
                  <h2 className="text-[12vw] font-black text-white leading-none">THE STAR</h2>
                  <p className="text-amber-500 font-bold tracking-[1em] uppercase mt-4">Aligned</p>
                </div>
              </section>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>

      <nav className="fixed top-0 left-0 w-full p-12 flex justify-between items-center z-50 pointer-events-none text-white">
        <div className="font-black text-3xl tracking-tighter uppercase pointer-events-auto cursor-pointer">Astra</div>
        <div className="pointer-events-auto w-10 h-1 border-t-2 border-white" />
      </nav>
    </div>
  );
};

export default Home;
