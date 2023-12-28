import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';

const Lamborghini = ({ isMobile, rotationSpeed }) => {
  const computer = useGLTF('./lamborghini/scene.gltf');

  return (
    <mesh rotation={rotationSpeed}>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 20, 5]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [1, -8.25, 0.8]}
        rotation={[-0.01, -0.6, -0.01]}
      />
    </mesh>
  );
};

const LamborghiniCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState([0, -7.25, 0]);

  useEffect(() => {
    // Tự động quay 360 độ sau mỗi 5 giây
    const rotationInterval = setInterval(() => {
      setRotationSpeed((prevRotation) => [
        prevRotation[0],
        prevRotation[1] + 0.001, // Tăng góc quay theo trục Y
        prevRotation[2],
      ]);
    }, 10);

    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia('(max-width: 500px)');

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      // Xóa interval khi component unmount
      clearInterval(rotationInterval);
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <></>
      ) : (
        <Canvas
          frameloop="demand"
          shadows
          dpr={[1, 2]}
          camera={{ position: [10, 3, 10], fov: 30 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate
              autoRotateSpeed={0.1}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Lamborghini isMobile={isMobile} rotationSpeed={rotationSpeed} />
          </Suspense>
          <Preload all />
        </Canvas>
      )}
    </>
  );
};

export default LamborghiniCanvas;
