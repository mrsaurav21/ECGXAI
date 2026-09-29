import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Served statically from frontend/public/heart_3d.glb
const MODEL_PATH = '/heart_3d.glb';

export default function HeartGeometry({ 
  ischemicTerritories = {}, 
  hoveredTerritory, 
  setHoveredTerritory 
}) {
  const groupRef = useRef();

  // Load the GLB asset directly from the public root
  const { scene } = useGLTF(MODEL_PATH);

  // Clone scene and apply dynamic materials matching the palette
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const meshName = (child.name || '').toLowerCase();

        // Identify coronary territories by mesh naming
        let territoryKey = null;
        if (
          meshName.includes('lad') || 
          meshName.includes('anterior') || 
          meshName.includes('septum') ||
          meshName.includes('interventricular')
        ) {
          territoryKey = 'LAD';
        } else if (
          meshName.includes('rca') || 
          meshName.includes('inferior') || 
          meshName.includes('right')
        ) {
          territoryKey = 'RCA';
        } else if (
          meshName.includes('lcx') || 
          meshName.includes('lateral') || 
          meshName.includes('circumflex')
        ) {
          territoryKey = 'LCx';
        }

        if (territoryKey) {
          const isIschemic = Boolean(ischemicTerritories[territoryKey]);
          const isHovered = hoveredTerritory === territoryKey;

          child.material = new THREE.MeshStandardMaterial({
            color: isHovered ? '#7091E6' : isIschemic ? '#E04858' : '#3D52A0',
            emissive: isHovered ? '#3D52A0' : isIschemic ? '#E04858' : '#000000',
            emissiveIntensity: isHovered ? 0.7 : isIschemic ? 0.9 : 0.0,
            roughness: 0.3,
            metalness: 0.2,
          });

          child.userData = { territory: territoryKey };
        } else {
          // General Myocardium Tissue surface
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#3D52A0',
            roughness: 0.45,
            metalness: 0.15,
            clearcoat: 0.4,
            clearcoatRoughness: 0.3,
          });
        }
      }
    });

    return clone;
  }, [scene, ischemicTerritories, hoveredTerritory]);

  // Gentle idle rotation when not inspecting
  useFrame((_, delta) => {
    if (groupRef.current && !hoveredTerritory) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      scale={1.2}
      position={[0, -0.2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        const terr = e.object.userData?.territory;
        if (terr) setHoveredTerritory(terr);
      }}
      onPointerOut={() => setHoveredTerritory(null)}
    />
  );
}

// Preload the GLB model asset from public root
useGLTF.preload(MODEL_PATH);