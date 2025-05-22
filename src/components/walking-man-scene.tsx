"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Group, Vector3, MathUtils } from "three"

export default function WalkingManScene() {
  return (
    <Canvas shadows camera={{ position: [10, 8, 16], fov: 50 }}>
      <color attach="background" args={["#87CEEB"]} />
      <fog attach="fog" args={["#87CEEB", 30, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <Environment preset="city" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#7CFC00" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[4, 30]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      <WalkingMan />
      <EnvironmentObjects />

      <OrbitControls
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minDistance={5}
        maxDistance={40}
        target={[0, 1, 0]}
      />
    </Canvas>
  )
}

function WalkingMan() {
  const group = useRef<Group>(null)
  const walkingSpeed = 3

  const [position, setPosition] = useState(new Vector3(0, 0, 0))
  const [rotation, setRotation] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [moveDirection, setMoveDirection] = useState({ forward: 0, right: 0 })

  const legRotationSpeed = 4
  const armRotationSpeed = 4
  const legMaxRotation = Math.PI / 4
  const armMaxRotation = Math.PI / 6

  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)

  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keys) setKeys((prev) => ({ ...prev, [e.key]: true }))
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keys) setKeys((prev) => ({ ...prev, [e.key]: false }))
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const forward = Number(keys.ArrowUp) - Number(keys.ArrowDown)
    const right = Number(keys.ArrowRight) - Number(keys.ArrowLeft)
    setMoveDirection({ forward, right })
    setIsMoving(forward !== 0 || right !== 0)
    if (forward !== 0 || right !== 0) {
      const angle = Math.atan2(right, forward)
      setRotation(angle)
    }
  }, [keys])

  useFrame((_, delta) => {
    if (!group.current) return
    if (isMoving) {
      const newPosition = position.clone()
      const moveVector = new Vector3(
        moveDirection.right * walkingSpeed * delta,
        0,
        moveDirection.forward * walkingSpeed * delta
      )
      newPosition.add(moveVector)
      newPosition.x = MathUtils.clamp(newPosition.x, -40, 40)
      newPosition.z = MathUtils.clamp(newPosition.z, -40, 40)
      setPosition(newPosition)
    }
    group.current.position.copy(position)
    group.current.rotation.y = rotation
    const animationTime = Date.now() * 0.005
    const legRotation = isMoving ? Math.sin(animationTime * legRotationSpeed) * legMaxRotation : 0
    const armRotation = isMoving ? Math.sin(animationTime * armRotationSpeed) * armMaxRotation : 0
    if (leftLegRef.current) leftLegRef.current.rotation.x = legRotation
    if (rightLegRef.current) rightLegRef.current.rotation.x = -legRotation
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armRotation
    if (rightArmRef.current) rightArmRef.current.rotation.x = armRotation
  })

  return (
    <group ref={group}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.5]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>
      <group ref={leftArmRef} position={[0.6, 1.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[-0.6, 1.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
      </group>
      <group ref={leftLegRef} position={[0.25, 1, 0]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[0.25, 1, 0.25]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[-0.25, 1, 0]}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[0.25, 1, 0.25]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>
    </group>
  )
}

type ObjectData = {
  type: "tree" | "building" | "lamp"
  position: [number, number, number]
  key: string
  scale?: number
  rotation?: [number, number, number]
  dimensions?: [number, number, number]
  color?: string
}

function EnvironmentObjects() {
  const environmentObjects = useMemo<ObjectData[]>(() => {
    const objects: ObjectData[] = []
    for (let i = 0; i < 20; i++) {
      let x = MathUtils.randFloatSpread(40)
      if (Math.abs(x) < 3) x = x > 0 ? x + 3 : x - 3
      const z = MathUtils.randFloatSpread(40)
      const scale = 0.8 + Math.random() * 0.5
      objects.push({ type: "tree", position: [x, 0, z], scale, rotation: [0, Math.random() * Math.PI * 2, 0], key: `tree-${i}` })
    }
    for (let i = 0; i < 10; i++) {
      const x = MathUtils.randFloatSpread(60)
      const z = MathUtils.randFloatSpread(60)
      if (Math.abs(x) < 5 && Math.abs(z) < 15) continue
      const height = 3 + Math.random() * 7
      const width = 3 + Math.random() * 5
      const depth = 3 + Math.random() * 5
      objects.push({ type: "building", position: [x, height / 2, z], dimensions: [width, height, depth], color: Math.random() > 0.5 ? "#D3D3D3" : "#A9A9A9", key: `building-${i}` })
    }
    for (let i = -12; i <= 12; i += 4) {
      objects.push({ type: "lamp", position: [2.5, 0, i], key: `lamp-r-${i}` })
      objects.push({ type: "lamp", position: [-2.5, 0, i], key: `lamp-l-${i}` })
    }
    return objects
  }, [])

  return (
    <group>
      {environmentObjects.map((obj) => {
        if (obj.type === "tree") return <Tree key={obj.key} position={obj.position} scale={obj.scale} rotation={obj.rotation} />
        if (obj.type === "building") return <Building key={obj.key} position={obj.position} dimensions={obj.dimensions!} color={obj.color!} />
        if (obj.type === "lamp") return <StreetLamp key={obj.key} position={obj.position} />
        return null
      })}
    </group>
  )
}

type TreeProps = {
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

function Tree({ position, scale = 1, rotation = [0, 0, 0] }: TreeProps) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh castShadow position={[0, 3, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  )
}

type BuildingProps = {
  position: [number, number, number]
  dimensions: [number, number, number]
  color: string
}

function Building({ position, dimensions, color }: BuildingProps) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

type StreetLampProps = {
  position: [number, number, number]
}

function StreetLamp({ position }: StreetLampProps) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh castShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh castShadow position={[0.3, 1.4, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#F9D71C" emissive="#F9D71C" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0.3, 1.4, 0]} intensity={0.5} distance={5} color="#F9D71C" />
    </group>
  )
}