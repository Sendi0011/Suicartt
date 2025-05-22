"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ThreeDLogoProps {
  size?: number
  animated?: boolean
}

export default function ThreeDLogo({ size = 300, animated = false }: ThreeDLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)

    // Clear any existing canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    containerRef.current.appendChild(renderer.domElement)

    // Create the logo
    const group = new THREE.Group()
    scene.add(group)

    // Create a coin-like shape for SUI
    const coinGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32)
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0x5f9ea0, // Teal color
      metalness: 0.8,
      roughness: 0.2,
    })
    const coin = new THREE.Mesh(coinGeometry, coinMaterial)
    group.add(coin)

    // Add "S" letter on the coin
    const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 32, Math.PI * 1.5)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.z = 0.2
    torus.rotation.z = Math.PI / 4
    group.add(torus)

    // Add a small line to complete the "S"
    const lineGeometry = new THREE.BoxGeometry(1, 0.3, 0.1)
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3,
    })
    const topLine = new THREE.Mesh(lineGeometry, lineMaterial)
    topLine.position.set(0.5, 0.8, 0.2)
    topLine.rotation.z = Math.PI / 4
    group.add(topLine)

    const bottomLine = new THREE.Mesh(lineGeometry, lineMaterial)
    bottomLine.position.set(-0.5, -0.8, 0.2)
    bottomLine.rotation.z = Math.PI / 4
    group.add(bottomLine)

    // Add cart icon
    const cartBase = new THREE.BoxGeometry(1.5, 0.8, 0.3)
    const cartMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3,
    })
    const cart = new THREE.Mesh(cartBase, cartMaterial)
    cart.position.set(0, -0.2, 1.5)
    cart.rotation.x = Math.PI / 6
    group.add(cart)

    // Cart wheels
    const wheelGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 16)
    const wheel1 = new THREE.Mesh(wheelGeometry, cartMaterial)
    wheel1.position.set(-0.5, -0.6, 1.5)
    wheel1.rotation.x = Math.PI / 2
    group.add(wheel1)

    const wheel2 = new THREE.Mesh(wheelGeometry, cartMaterial)
    wheel2.position.set(0.5, -0.6, 1.5)
    wheel2.rotation.x = Math.PI / 2
    group.add(wheel2)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x5f9ea0, 1, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    // Animation
    let frameId: number

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      if (animated) {
        group.rotation.y += 0.01
        group.rotation.x = Math.sin(Date.now() * 0.001) * 0.2
      } else {
        group.rotation.y = 0.5
        group.rotation.x = 0.2
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const newSize = Math.min(containerRef.current.clientWidth, size)
      renderer.setSize(newSize, newSize)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameId)
      renderer.dispose()
    }
  }, [size, animated])

  return <div ref={containerRef} className="w-full h-full" />
}
