import {
  Scroll,
  ScrollControls,
  useScroll,
  Stars,
  Environment,
  useTexture,
} from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

// 🌍 TEXTURES
import sun from "@/assets/2k_sun.jpg"
import mercury from "@/assets/2k_mercury.jpg"
import venus from "@/assets/2k_venus_surface.jpg"
import earth from "@/assets/2k_earth_daymap.jpg"
import earthClouds from "@/assets/2k_earth_clouds.jpg"
import mars from "@/assets/2k_mars.jpg"
import jupiter from "@/assets/2k_jupiter.jpg"
import saturn from "@/assets/2k_saturn.jpg"
import saturnRings from "@/assets/2k_saturn_ring_alpha.png"

/* =======================
   PLANET DATA
======================= */

const PLANETS = [
  {
    name: "Sun",
    size: 4,
    distance: 0,
    tilt: 0,
    texture: sun,
    description: "The massive star at the heart of our solar system.",
  },
  {
    name: "Mercury",
    size: 0.6,
    distance: 12,
    tilt: 0.03,
    texture: mercury,
    description: "The smallest planet, closest to the Sun.",
  },
  {
    name: "Venus",
    size: 0.9,
    distance: 20,
    tilt: 177,
    texture: venus,
    description: "Earth’s toxic twin with extreme temperatures.",
  },
  {
    name: "Earth",
    size: 1.2,
    distance: 28,
    tilt: 23.5,
    texture: earth,
    description: "Our home planet, the only known world with life.",
  },
  {
    name: "Mars",
    size: 0.8,
    distance: 36,
    tilt: 25,
    texture: mars,
    description: "The red planet with ancient riverbeds.",
  },
  {
    name: "Jupiter",
    size: 2.5,
    distance: 50,
    tilt: 3,
    texture: jupiter,
    description: "The largest planet with a giant storm system.",
  },
  {
    name: "Saturn",
    size: 2.2,
    distance: 65,
    tilt: 26.7,
    texture: saturn,
    description: "Famous for its spectacular ring system.",
  },
]

/* =======================
   SUN
======================= */

function Sun() {
  const texture = useTexture(sun)

  return (
    <mesh>
      <sphereGeometry args={[4, 128, 128]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

/* =======================
   EARTH CLOUDS
======================= */

function EarthClouds() {
  const clouds = useTexture(earthClouds)
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.02
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.22, 64, 64]} />
      <meshStandardMaterial
        map={clouds}
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

/* =======================
   PLANET MESH
======================= */

function PlanetMesh({ planet }: { planet: any }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture(planet.texture)

  const axialTilt = useMemo(
    () => (planet.tilt * Math.PI) / 180,
    [planet.tilt]
  )

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.15
  })

  return (
    <group rotation={[0, 0, axialTilt]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 128, 128]} />
        <meshStandardMaterial
        //@ts-ignore
          map={texture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {planet.name === "Earth" && <EarthClouds />}
    </group>
  )
}

/* =======================
   PLANET (WITH ORBIT)
======================= */

function Planet({ planet }: { planet: any }) {
  const orbitRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    orbitRef.current.rotation.y += delta * (1 / planet.distance)
  })

  return (
    <group ref={orbitRef}>
      <group position={[planet.distance, 0, 0]}>
        <PlanetMesh planet={planet} />

        {planet.name === "Saturn" && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[planet.size * 1.4, planet.size * 2.2, 128]}
            />
            <meshStandardMaterial
              map={useTexture(saturnRings)}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}

/* =======================
   SOLAR SYSTEM + CAMERA
======================= */

function SolarSystem() {
  const scroll = useScroll()

  useFrame((state) => {
    const t = scroll.offset
    const targetX = t * 65

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.035
    )

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      22,
      0.05
    )

    state.camera.lookAt(targetX, 0, 0)
  })

  return (
    <>
      <Sun />
      {PLANETS.slice(1).map((planet) => (
        <Planet key={planet.name} planet={planet} />
      ))}
    </>
  )
}

/* =======================
   PAGE
======================= */

export default function Home() {
  return (
    <div className="w-full h-screen bg-black text-white">
      <Canvas camera={{ fov: 30, position: [0, 0, 20], far: 2000 }}>
        {/* LIGHTS */}
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 0]} intensity={3} decay={2} />
        <directionalLight position={[10, 5, 20]} intensity={0.6} />

        {/* POST PROCESS */}
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0} />
        </EffectComposer>

        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={300} depth={100} count={50000} factor={6} fade />
        </Suspense>

        <ScrollControls pages={7} damping={0.1}>
          <SolarSystem />

          {/* INFO CARDS */}
          <Scroll html>
            <div className="w-screen">
              {PLANETS.map((planet) => (
                <section
                  key={planet.name}
                  className="h-screen flex items-center px-20 pointer-events-none"
                >
                  <div className="max-w-xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 pointer-events-auto">
                    <h1 className="text-6xl font-black uppercase mb-4">
                      {planet.name}
                    </h1>

                    <p className="text-lg text-slate-300 mb-6">
                      {planet.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>Axial Tilt</div>
                      <div>{planet.tilt}°</div>

                      <div>Orbit Distance</div>
                      <div>{planet.distance} AU</div>
                    </div>

                    <button className="mt-8 px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition">
                      Explore Planet
                    </button>
                  </div>
                </section>
              ))}
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
