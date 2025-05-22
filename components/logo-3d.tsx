"use client"

import { Canvas } from "@react-three/fiber"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function LogoMesh() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 4) / 4
    meshRef.current.rotation.y = Math.sin(t / 2) / 2
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#8b5cf6"
        roughness={0.1}
        metalness={0.8}
        emissive="#4c1d95"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

export default function Logo3D() {
  return (
    <div className="h-10 w-10">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LogoMesh />
      </Canvas>
    </div>
  )
}
