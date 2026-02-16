import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HyperspeedBackgroundProps {
  speed?: number;
  density?: number;
  colors?: {
    stars: string;
    trails: string;
    background: string;
  };
}

const HyperspeedBackground: React.FC<HyperspeedBackgroundProps> = ({
  speed = 0.02,
  density = 800,
  colors = {
    stars: '#64FFDA',
    trails: '#00BCD4',
    background: 'radial-gradient(ellipse at center, #0F172A 0%, #020617 70%)'
  }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    console.log('HyperspeedBackground: Component mounting...');
    
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: colors.stars,
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const starsVertices = [];
    const starsVelocities = [];

    for (let i = 0; i < density; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      
      starsVertices.push(x, y, z);
      starsVelocities.push(0, 0, Math.random() * 0.5 + 0.1);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update star positions for hyperspeed effect
      const positions = starsGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += speed * 50; // Z movement for hyperspeed
        
        // Reset stars that have passed
        if (positions[i + 2] > 100) {
          positions[i + 2] = -100;
          positions[i] = (Math.random() - 0.5) * 2000;
          positions[i + 1] = (Math.random() - 0.5) * 2000;
        }
      }
      
      starsGeometry.attributes.position.needsUpdate = true;
      
      // Slight rotation for dynamic effect
      stars.rotation.y += 0.001;
      stars.rotation.x += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
      
      console.log('HyperspeedBackground: Component unmounted and cleaned up');
    };
  }, [speed, density, colors]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background: colors.background,
        zIndex: -1
      }}
    />
  );
};

export default HyperspeedBackground;