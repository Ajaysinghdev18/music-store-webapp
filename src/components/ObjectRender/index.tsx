import { Spinner } from '@chakra-ui/core';
import * as _ from 'lodash';
import { FC, useRef } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
import { WebGLRenderer } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { API_SERVER } from '../../constants';

interface ObjectRenderProps {
  fieldname?: string;
  filename?: string;
  id?: string;
  url?: string;
  canAction?: boolean;
}

function loadGLTFModel(scene: any, glbPath: string, options: any) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        const obj = gltf.scene;
        obj.name = Math.random().toString();
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        obj.position.x -= 0.1;
        scene.add(obj);

        obj.traverse(function (child) {
          if (_.get(child, 'isMesh')) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        resolve(obj);
      },
      undefined,
      function (error) {
        console.log(error);
        reject(error);
      }
    );
  });
}

export const ObjectRender: FC<ObjectRenderProps> = ({ id, canAction = false }) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [renderer, setRenderer] = useState<WebGLRenderer>();

  useEffect(() => {
    const { current: container } = refContainer;
    if (container && !renderer && id) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        depth: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const scene = new THREE.Scene();
      const scale = 0.6;
      scene.position.z = 1.1;
      scene.rotation.x = -Math.PI / 2;
      scene.position.x = 0.1;
      const camera = new THREE.OrthographicCamera(-scale, scale, scale, -scale, 0.1, 1000);
      const target = new THREE.Vector3(0, 0, 0);
      const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
      scene.add(ambientLight);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target = target;
      controls.maxDistance = 4;
      controls.minDistance = 3;
      controls.enableDamping = canAction;
      controls.enablePan = canAction;
      controls.enableRotate = canAction;
      controls.enableZoom = canAction;
      loadGLTFModel(scene, `${API_SERVER}/api/v1/products/3d-object/${id}`, {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate();
        setLoading(false);
      });

      let req: any = null;
      const animate = () => {
        req = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.dispose();
      };
    }
  }, [id]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', background:'#0b1e2d' }} ref={refContainer}>
      {loading && (
        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
          <Spinner color="#00Ff00" size="xl" />
        </span>
      )}
    </div>
  );
};
