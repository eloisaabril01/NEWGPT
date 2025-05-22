"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Environment } from "@react-three/drei"
import * as THREE from "three"

function Logo(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(t / 2) / 10 + 0.5, 0.1)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.sin(t / 4) / 20, 0.1)
  })

  return (
    <mesh ref={meshRef} {...props}>
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

function LoadingText() {
  const textRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05 - 1.5
    }
  })

  return (
    <Text
      ref={textRef}
      color="white"
      fontSize={0.3}
      font="/fonts/Inter_Regular.json"
      position={[0, -1.5, 0]}
      anchorX="center"
      anchorY="middle"
    >
      Loading Nav's GPT...
    </Text>
  )
}

export default function LoadingScene() {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <color attach="background" args={["#111"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Logo position={[0, 0, 0]} />
        <LoadingText />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
