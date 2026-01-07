import { 
  Scroll, 
  ScrollControls, 
  useScroll, 
  Stars, 
  Environment,
  useTexture
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const PLANETS = [
  {
    name: "Sun",
    color: "#ff8800",
    size: 4,
    distance: 0,
    tilt: 0,
    texture: "https://threejs.org/examples/textures/lava/lavatile.jpg",
    description: "The massive star at our Solar System's heart, providing the intense heat and light necessary for life."
  },
  {
    name: "Mercury",
    color: "#A5A5A5",
    size: 0.6,
    distance: 15,
    tilt: 0.03,
    texture: "https://threejs.org/examples/textures/planets/mercury.jpg",
    description: "The smallest planet, orbiting closest to the Sun with an iron-rich core and no atmosphere."
  },
  {
    name: "Venus",
    color: "#E3BB76",
    size: 0.9,
    distance: 30,
    tilt: 177, 
    texture: "https://threejs.org/examples/textures/planets/venus_surface.jpg",
    description: "Earth's sister planet, featuring a crushing CO2 atmosphere and surface temperatures hot enough to melt lead."
  },
  {
    name: "Earth",
    color: "#2271B3",
    size: 1.2,
    distance: 45,
    tilt: 23.5,
    texture: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    description: "Our blue home, the only planet known to support life with its perfect balance of air and water."
  },
  {
    name: "Mars",
    color: "#E27B58",
    size: 0.8,
    distance: 60,
    tilt: 25,
    texture: "https://threejs.org/examples/textures/planets/mars.jpg",
    description: "The Red Planet, hosting the largest volcano in the solar system and ancient, frozen riverbeds."
  },
  {
    name: "Jupiter",
    color: "#D39C7E",
    size: 2.5,
    distance: 85,
    tilt: 3,
    texture: "https://threejs.org/examples/textures/planets/jupiter.jpg",
    description: "A colossal gas giant harboring the Great Red Spot—a storm larger than Earth itself."
  },
  {
    name: "Saturn",
    color: "#C5AB6E",
    size: 2.2,
    distance: 110,
    tilt: 26.7,
    texture: "https://threejs.org/examples/textures/planets/saturn.jpg",
    description: "The ringed wonder, famous for its intricate system of orbiting ice and rock chunks."
  }
];

function PlanetMesh({ data }: { data: typeof PLANETS[0] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  // const texture = useTexture(data.texture);
  const axialTilt = useMemo(() => (data.tilt * Math.PI) / 180, [data.tilt]);
  
  const rotationSpeed = data.name === "Sun" ? 0.05 : 0.3 + (Math.random() * 0.2);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + data.distance * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, axialTilt]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.size, 64, 64]} />
        <meshStandardMaterial 
          color={data.color}
          emissive={data.name === "Sun" ? "#ff2200" : "#000000"}
          emissiveIntensity={data.name === "Sun" ? 2 : 0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

function Planet({ data }: { data: typeof PLANETS[0], index: number }) {
  return (
    <group position={[data.distance, 0, 0]}>
      <Suspense fallback={
        <mesh>
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshStandardMaterial color={data.color} />
        </mesh>
      }>
        <PlanetMesh data={data} />
      </Suspense>

  
      {/* Saturn's Rings */}
      {data.name === "Saturn" && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[data.size * 1.8, 0.2, 2, 128]} />
          <meshStandardMaterial color="#C5AB6E" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

function SolarSystem() {
  const scroll = useScroll();

  useFrame((state) => {
    const t = scroll.offset; 
    const targetX = t * 110; 
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 20, 0.05);
    state.camera.lookAt(targetX, 0, 0);
  });

  return (
    <group>
      {PLANETS.map((planet, i) => (
        <Planet key={planet.name} data={planet} index={i} />
      ))}
    </group>
  );
}

const Home = () => {
  return (
    <div className="w-full h-screen bg-[#000000] relative overflow-hidden text-white font-sans">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="text-white text-xs font-black tracking-[1em] uppercase animate-pulse">Voyager Initializing</div>
        </div>
      }>
        <Canvas 
          shadows 
          dpr={window.devicePixelRatio > 1 ? 1.5 : 1}
          gl={{ 
            antialias: true, 
            stencil: false,
            powerPreference: "high-performance",
          }} 
          camera={{ fov: 30, position: [0, 0, 20], far: 2000 }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#ff8800" /> {/* Sun Light */}
          <pointLight position={[50, 50, 50]} intensity={1} />
          
          <Suspense fallback={null}>
            <Environment preset="night" />
            <Stars radius={300} depth={100} count={5000} factor={20} saturation={1} fade speed={1} />
          </Suspense>
          
          <ScrollControls pages={8} damping={0.1}>
            <SolarSystem />
            <Scroll html>
              <div className="w-screen">
                {PLANETS.map((planet) => (
                  <section key={planet.name} className="h-screen flex items-center px-12 md:px-32 pointer-events-none">
                    <div className="max-w-xl bg-black/60 p-10 rounded-[3rem] border border-white/10 pointer-events-auto">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-4 h-16 bg-blue-500 rounded-full" />
                        <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                          {planet.name}
                        </h1>
                      </div>
                      <p className="text-2xl text-slate-400 font-light leading-relaxed mb-8">
                        {planet.description}
                      </p>
                      <button className="px-10 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                        Initiate Orbit
                      </button>
                    </div>
                  </section>
                ))}
              </div>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </Suspense>

      <nav className="fixed top-0 left-0 w-full p-12 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto cursor-pointer group">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:rotate-180 transition-transform duration-1000">
             <div className="w-5 h-5 bg-white" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase">Cosmos Engine</span>
        </div>
      </nav>
    </div>
  );
};

export default Home;
