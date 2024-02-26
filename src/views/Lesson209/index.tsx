import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import './index.css';
import * as THREE from 'three';

import {Cartographic, sampleTerrain as cesiumSampleTerrain} from "cesium";
import WaterFaceImage from '../../assets/images/waterNormals.jpg';
import {reflect} from "three/examples/jsm/nodes/math/MathNode";

interface Window {
    Viewer?: Cesium.Viewer;
}


function Lesson209() {
    let viewer: Cesium.Viewer | null = null;
    const [cesiumContainer, setCesiumContainer] = useState<HTMLElement | null>(null);
    const [threeContainer, setThreeContainer] = useState<HTMLElement | null>(null);
    const minWGS84 = [115.23, 39.55];
    const maxWGS84 = [116.23, 41.55];
    const _3Dobjects: any[] = [];
    // const three = {
    //     renderer: null,
    //     camera: null,
    //     scene: null
    // }
    const [three, setThree] = useState({
        renderer: new THREE.WebGLRenderer({alpha: true}),
        camera: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000),
        scene: new THREE.Scene()
    });
    const cesium = {
        viewer: null
    };

    // 默认视角
    const defaultCameraPosition = () => {
        if (!viewer) {
            return;
        }
        // 直接设置视角位置
        // 中国的坐标
        const chinaPosition = {
            longitude: 116.395645038,
            latitude: 39.9299857781,
            height: 7000000,
        };
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
        });
        // 禁用地下模式
        // viewer.scene.underground = false;
        // 禁用碰撞检测
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    }
    /**
     *
     */
    useEffect(() => {
        // boundaries in WGS84 to help with syncing the renderers
        const currentCesiumContainer = document.getElementById("cesiumContainer");
        setCesiumContainer(currentCesiumContainer)
        const currentThreeContainer = document.getElementById("ThreeContainer");
        setThreeContainer(currentThreeContainer)

        initCesium();
        initThree();
        init3DObject();

        return () => {
            if (viewer) {
                viewer.destroy();
                viewer = null;
            }
        }
    }, [])

    const initCesium = () => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox: false,
            // terrainProvider:  Cesium.Terrain.fromWorldTerrain(),
            // terrain: Cesium.Terrain.fromWorldTerrain(), // 地形数据
            terrainProvider: Cesium.createWorldTerrain(),
            // 是否显示图层选择控件
            // baseLayerPicker: false
            contextOptions: {
                webgl: {
                    alpha: true
                }
            },
            scene3DOnly: true, // * 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            useDefaultRenderLoop: true, // * 控制渲染循环
            orderIndependentTranslucency: true, // * 如果为true并且配置支持它，则使用顺序无关的半透明性
            shadows: false, // * 阴影效果
            projectionPicker: false, // *   透视投影和正投影之间切换
            requestRenderMode: true, // * 在指定情况下进行渲染,提高性能
        })

        // const center = Cesium.Cartesian3.fromDegrees(
        //     (minWGS84[0] + maxWGS84[0]) / 2,
        //     ((minWGS84[1] + maxWGS84[1]) / 2) - 1,
        //     200000
        // )
        // viewer.camera.flyTo({
        //     destination: center,
        //     orientation: {
        //         heading: Cesium.Math.toRadians(0),
        //         pitch: Cesium.Math.toRadians(-60),
        //         roll: Cesium.Math.toRadians(0)
        //     },
        //     duration: 3
        // });
        defaultCameraPosition();
    }
    const initThree = () => {
        console.log('initThree');
        if (!threeContainer) return; // 如果容器不存在，则直接返回
        const fov = 45;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const near = 1;
        const far = 10 * 1000 * 1000;

        // three.scene = new THREE.Scene();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        const renderer = new THREE.WebGLRenderer({alpha: true});
        setThree({renderer, camera, scene});

        let newThreeContainer = threeContainer.appendChild(three.renderer.domElement);
        setThreeContainer(newThreeContainer);
    }

    const init3DObject = () => {
        if (!viewer) return;
        // Cesium 实体
        viewer.entities.add({
            name: 'Polygon',
            polygon: {
                // hierarchy : new Cesium.Cartesian3.fromDegreesArray([
                //     minWGS84[0], minWGS84[1],0,
                //     maxWGS84[0], minWGS84[1],0,
                //     maxWGS84[0], maxWGS84[1],0,
                //     minWGS84[0], maxWGS84[1],0,
                // ]),
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights([
                    minWGS84[0], minWGS84[1], 0,
                    maxWGS84[0], minWGS84[1], 0,
                    maxWGS84[0], maxWGS84[1], 0,
                    minWGS84[0], maxWGS84[1], 0,
                ])),
                material: Cesium.Color.RED.withAlpha(0.2)
            }
        })

        // three 三维图形
        // Lathe geometry  车床几何
        /*
        const doubleSideMaterial = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        })
        const segments = 10;
        const points = [];
        for (let i = 0; i < segments; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * segments + 5, (i - 5) * 2));
        }
        const geometry = new THREE.LatheGeometry(points);
        const latheMesh = new THREE.Mesh(geometry, doubleSideMaterial);
        latheMesh.scale.set(1500, 1500, 1500);
        latheMesh.scale.set(1500, 1500, 1500); // scale object to be visible at planet scale
        latheMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
        latheMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
        const latheMeshYup = new THREE.Group();
        latheMeshYup.add(latheMesh)
        three.scene.add(latheMeshYup); // don’t forget to add it to the Three.js scene manually
        */

    }
    return (
        <div>
            <div
                id="cesiumContainer"
                style={{height: '100vh'}}
            >
            </div>
            <div id="ThreeContainer"></div>
        </div>
    )
}

export default Lesson209;
