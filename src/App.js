import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import styled from "styled-components";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import CountryBufferGeometry from "CountryBufferGeometry";
import geojson from "countries.geojson.json";
import { GlobalStyle } from "styles";

extend({ CountryBufferGeometry });

const CAM_LENGTH_START = 10;
const CAM_LENGTH_ZOOMED = 2;
const CAM_LENGTH_UN_ZOOMED = 3;
const CAM_FOV = 50;

const Bg = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #1d222f;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Content = styled.div`
  position: relative;
  padding: 32px;
`;

const BackButton = styled.button`
  padding: 20px 40px;
  font-size: 18px;
`;

const countriesData = [];
Object.keys(geojson).forEach((region) => {
  geojson[region].forEach((country) => {
    countriesData.push(country);
  });
});

const Country = ({ coordinates, color, onClick }) => {
  const geometry = useRef();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!geometry.current) return;
    geometry.current.setCoordinates(coordinates);
  }, [geometry, coordinates]);

  return (
    <mesh
      onClick={() => onClick(geometry.current?.boundingSphere?.center)}
      onPointerOver={() => setIsHovering(true)}
      onPointerOut={() => setIsHovering(false)}
    >
      <countryBufferGeometry ref={geometry} />
      <meshPhongMaterial color={isHovering ? "red" : color} />
    </mesh>
  );
};

const Earth = ({ children }) => {
  const globe = React.useRef();
  const earth = React.useRef();

  return (
    <a.group ref={globe}>
      <mesh ref={earth}>
        <sphereBufferGeometry args={[0.995, 64, 64]} />
        <meshPhongMaterial color="#2b3f71" />
      </mesh>
      {children}
    </a.group>
  );
};

const Camera = ({ countryCenter }) => {
  const cameraRef = useRef();
  const spotLightRef = useRef();

  const nextCamPos = useMemo(() => {
    if (!countryCenter) {
      return [
        cameraRef.current?.position.x || 0,
        cameraRef.current?.position.y || 0,
        cameraRef.current?.position.z || CAM_LENGTH_UN_ZOOMED,
        CAM_LENGTH_UN_ZOOMED,
      ];
    }
    const pos = countryCenter.clone();
    pos.normalize();
    return [pos.x, pos.y, pos.z, CAM_LENGTH_ZOOMED];
  }, [countryCenter, cameraRef]);

  useFrame(() => {
    spotLightRef.current.position.x = cameraRef.current.position.x;
    spotLightRef.current.position.y = cameraRef.current.position.y;
    spotLightRef.current.position.z = cameraRef.current.position.z;
  });

  const updateCameraPos = useCallback(
    ({ value: { pos, cameraOffset } }) => {
      if (!cameraRef.current) {
        return;
      }
      cameraRef.current.position.x = pos[0];
      cameraRef.current.position.y = pos[1];
      cameraRef.current.position.z = pos[2];
      cameraRef.current.position.setLength(pos[3]);
      cameraRef.current.lookAt(0, 0, 0);

      cameraRef.current.setViewOffset(
        window.innerWidth,
        window.innerHeight,
        cameraOffset,
        0,
        window.innerWidth,
        window.innerHeight
      );
      cameraRef.current.updateProjectionMatrix();
    },
    [cameraRef]
  );

  const [, set] = useSpring(() => ({
    pos: [0, 0, CAM_LENGTH_START, CAM_LENGTH_START],
    cameraOffset: 0,
    reset: true,
    onChange: updateCameraPos,
  }));

  useEffect(() => {
    set({
      from: {
        pos: [
          cameraRef.current?.position.x || 0,
          cameraRef.current?.position.y || 0,
          cameraRef.current?.position.z || CAM_LENGTH_START,
          cameraRef.current?.position.length() || CAM_LENGTH_START,
        ],
      },
      pos: nextCamPos,
      cameraOffset: countryCenter ? -400 : 0,
    });
  }, [set, cameraRef, nextCamPos, countryCenter]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={CAM_FOV} />
      <spotLight
        ref={spotLightRef}
        castShadow
        intensity={2.25}
        angle={0.6}
        penumbra={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
    </>
  );
};

const App = () => {
  const [countryCenter, setCountryCenter] = useState(undefined);

  return (
    <Bg>
      <GlobalStyle />
      <CanvasContainer>
        <Canvas mode="concurrent">
          <Camera countryCenter={countryCenter} />
          <ambientLight intensity={0.75} />
          <Earth>
            {countriesData.map((country) => (
              <Country
                coordinates={country.geometry.coordinates}
                color="#FFFFFF"
                onClick={(vector) => {
                  setCountryCenter(vector);
                }}
              />
            ))}
          </Earth>
          <fog attach="fog" args={["#1d222f", 1, 6]} />
          <OrbitControls
            autoRotate={!countryCenter}
            autoRotateSpeed={1}
            enableZoom={false}
          />
        </Canvas>
      </CanvasContainer>
      <Content>
        {countryCenter && (
          <BackButton
            onClick={() => {
              setCountryCenter(undefined);
            }}
          >
            Back
          </BackButton>
        )}
      </Content>
    </Bg>
  );
};

export default App;
