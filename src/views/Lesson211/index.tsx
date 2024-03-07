import React, {useEffect, useRef, useState} from "react";
import './index.css';
import * as THREE from 'three';
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// import {normalWorld} from "three/examples/jsm/nodes/accessors/NormalNode";
// import {normalWorld} from "three/examples/jsm/nodes/accessors/NormalNode";
// import {color} from "three/examples/jsm/nodes/shadernode/ShaderNode";
import waterImage from '../../assets/images/water.jpg';
import {triplanarTexture} from "three/examples/jsm/nodes/utils/TriplanarTexturesNode";
import {texture} from "three/examples/jsm/nodes/accessors/TextureNode";
import {MeshStandardNodeMaterial} from "three/examples/jsm/nodes/materials/Materials";
import {color} from "three/examples/jsm/nodes/shadernode/ShaderNode";

function Lesson211() {
    let camera, scene, renderer;
    let mixer, objects, clock;
    let model, floor, floorPosition;
    let postProcessing;
    let controls;


    useEffect(() => {
        init();
    }, []);

    const init = () => {
        // camera
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.25, 30);
        camera.position.set(3, 2, 4);

        // scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0487e2, 7, 25);
        scene.background = new THREE.Color(0x0487e2);

        // 好像要不要都一样
        camera.lookAt(0, 1, 0);

        // 光线
        const sunLight = new THREE.DirectionalLight(0xFFE499, 5);
        sunLight.castShadow = true;
        sunLight.shadow.camera.near = .1;
        sunLight.shadow.camera.far = 5;
        sunLight.shadow.camera.right = 2;
        sunLight.shadow.camera.left = -2;
        sunLight.shadow.camera.top = 1;
        sunLight.shadow.camera.bottom = -2;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.001;
        sunLight.position.set(.5, 3, .5);

        const waterAmbientLight = new THREE.HemisphereLight(0x333366, 0x74ccf4, 5);
        const skyAmbientLight = new THREE.HemisphereLight(0x74ccf4, 0, 1);

        scene.add(sunLight);
        scene.add(skyAmbientLight);
        scene.add(waterAmbientLight);

        clock = new THREE.Clock();

        // objects
        // const textureLoader = new THREE.TextureLoader();
        // const iceDiffuse = textureLoader.load(waterImage, function (texture) {
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     texture.encoding = THREE.LinearEncoding; // 指定颜色空间为 LinearEncoding
        //     // 这里可以继续处理纹理对象
        // });
        //
        //
        // const iceColorNode = triplanarTexture(texture(iceDiffuse)).add(color(0x0066ff)).mul(.8);
        //
        // const geometry = new THREE.IcosahedronGeometry(1, 3);
        // const material = new MeshStandardNodeMaterial({colorNode: iceColorNode});
        //
        // const count = 100;
        // const scale = 3.5;
        // const column = 10;
        //
        // objects = new THREE.Group();
    }
    return (
        <div>
            <canvas id="myCanvas" style={{width: '100%', height: '100%'}}></canvas>
        </div>
    )
}

export default Lesson211;
