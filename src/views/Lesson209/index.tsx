import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import './index.css';
import * as THREE from 'three';


type _3DObject = {
    threeMesh: THREE.Group | null; // 更改类型注解
    minWGS84: number[] | null;
    maxWGS84: number[] | null;
};

function create3DObject(): _3DObject {
    return {
        threeMesh: null,
        minWGS84: null,
        maxWGS84: null
    };
}

interface ThreeObject {
    threeMesh: THREE.Group | null;
    minWGS84: [number, number] | null;
    maxWGS84: [number, number] | null;
}

function Lesson209() {
    let viewer: Cesium.Viewer | null = null;
    const [cesiumContainer, setCesiumContainer] = useState<HTMLElement | null>(null);
    const [threeContainer, setThreeContainer] = useState<HTMLElement | null>(null);
    const _3Dobjects = useRef<_3DObject[]>([]);
    let minWGS84: number[] | null = [115.23, 39.55];
    let maxWGS84: number[] | null = [116.23, 41.55];
    const [three, setThree] = useState({
        renderer: new THREE.WebGLRenderer({alpha: true}),
        camera: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000),
        scene: new THREE.Scene()
    });

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
    }, [])
    useEffect(() => {
        initCesium();
        initThree();
        init3DObject();

        loop();
        return () => {
            if (viewer) {
                viewer.destroy();
                viewer = null;
            }
        }
    }, [cesiumContainer, threeContainer])

    const initCesium = () => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox: false,
            // terrainProvider:  Cesium.Terrain.fromWorldTerrain(),
            // terrain: Cesium.Terrain.fromWorldTerrain(), // 地形数据
            // terrainProvider: Cesium.createWorldTerrain(),
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
        console.log('加载了吗')
    }
    const initThree = () => {
        const fov = 45;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const near = 1;
        const far = 10 * 1000 * 1000;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        const renderer = new THREE.WebGLRenderer({alpha: true});
        setThree({renderer, camera, scene});
    }
    useEffect(() => {
        threeContainer?.appendChild(three.renderer.domElement);
    }, [three, threeContainer])
    useEffect(() => {
    }, [threeContainer])
    const init3DObject = () => {
        if (!viewer) return;
        // Cesium 实体
        addPolygonEntity(viewer, minWGS84, maxWGS84);
        addBoxEntity(viewer);
        // Three 实体
        addBoxGeometry();
        // Three


    }
    const addPolygonEntity = (viewer: Cesium.Viewer, minWGS84: number[] | null, maxWGS84: number[] | null) => {
        if (!minWGS84 || !maxWGS84) return
        viewer.entities.add({
            name: 'Polygon',
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights([
                    minWGS84[0], minWGS84[1], 0,
                    maxWGS84[0], minWGS84[1], 0,
                    maxWGS84[0], maxWGS84[1], 0,
                    minWGS84[0], maxWGS84[1], 0,
                ])),
                material: Cesium.Color.RED.withAlpha(0.2)
            }
        })
    }
    const addBoxEntity = (viewer: Cesium.Viewer) => {
        if (!minWGS84 || !maxWGS84) return
        viewer.entities.add({
            name: 'Box',
            position: Cesium.Cartesian3.fromDegrees(
                (minWGS84[0] + maxWGS84[0]) / 2,
                (minWGS84[1] + maxWGS84[1]) / 2 - 0.5,
                7000
            ),
            box: {
                dimensions: new Cesium.Cartesian3(16000.0, 16000.0, 16000.0),
                material: Cesium.Color.RED.withAlpha(0.5),
                fill: true,
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1.0,
            },
        })
    }
    const addBoxGeometry = () => {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshNormalMaterial()
        const dodecahedronMesh = new THREE.Mesh(geometry, material)
        dodecahedronMesh.scale.set(15000, 15000, 15000) // scale object to be visible at planet scale
        dodecahedronMesh.position.z += 7000.0 // translate "up" in Three.js space so the "bottom" of the mesh is the handle
        dodecahedronMesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system
        let dodecahedronMeshYup = new THREE.Group()
        dodecahedronMeshYup.add(dodecahedronMesh)
        three.scene.add(dodecahedronMeshYup) // don’t forget to add it to the Three.js scene manually
        let _3DOB = create3DObject();
        _3DOB.threeMesh = dodecahedronMeshYup;
        // 立方体的中心位置
        _3DOB.minWGS84 = minWGS84;
        _3DOB.maxWGS84 = maxWGS84;
        _3Dobjects.current.push(_3DOB);
    }

    const renderCesium = () => {
        if (!viewer) return;
        viewer.render();
    }


    const renderThreeObj = (viewer:any) => {
        if (!viewer) return;
        // 这段话有问题

        // debugger
        if (viewer.camera.frustum instanceof Cesium.PerspectiveFrustum) {
            let currentThree = three;
            currentThree.camera.fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy); // ThreeJS FOV is vertical
            setThree(currentThree);
        }
        let cartToVec = function (cart: any) {
            return new THREE.Vector3(cart.x, cart.y, cart.z);
        };
        for (let id in _3Dobjects.current) {
            minWGS84 = _3Dobjects.current[id].minWGS84;
            maxWGS84 = _3Dobjects.current[id].maxWGS84;
            if (!minWGS84 || !maxWGS84) return
            let center = Cesium.Cartesian3.fromDegrees(
                (minWGS84[0] + maxWGS84[0]) / 2,
                (minWGS84[1] + maxWGS84[1]) / 2
            );
            // get forward direction for orienting model
            let centerHigh = Cesium.Cartesian3.fromDegrees(
                (minWGS84[0] + maxWGS84[0]) / 2,
                (minWGS84[1] + maxWGS84[1]) / 2,
                1
            );

            let bottomLeft = cartToVec(
                Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1])
            );
            let topLeft = cartToVec(
                Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
            );
            let latDir = new THREE.Vector3()
                .subVectors(bottomLeft, topLeft)
                .normalize();
            const objects = _3Dobjects.current;
            if (objects) {
                for (let id in objects) {
                    const obj = objects[id];
                    if (obj && obj.threeMesh) {
                        obj.threeMesh.position.copy(center);
                        obj.threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z);
                        obj.threeMesh.up.copy(latDir);
                    }
                }
            }
        }

        three.camera.matrixAutoUpdate = false;
        const cvm = viewer.camera.viewMatrix;
        const civm = viewer.camera.inverseViewMatrix;

        three.camera.lookAt(0, 0, 0);
        three.camera.matrixWorld.set(
            civm[0],
            civm[4],
            civm[8],
            civm[12],
            civm[1],
            civm[5],
            civm[9],
            civm[13],
            civm[2],
            civm[6],
            civm[10],
            civm[14],
            civm[3],
            civm[7],
            civm[11],
            civm[15]
        );

        three.camera.matrixWorldInverse.set(
            cvm[0],
            cvm[4],
            cvm[8],
            cvm[12],
            cvm[1],
            cvm[5],
            cvm[9],
            cvm[13],
            cvm[2],
            cvm[6],
            cvm[10],
            cvm[14],
            cvm[3],
            cvm[7],
            cvm[11],
            cvm[15]
        );
        if (!cesiumContainer) return;
        let width = cesiumContainer.clientWidth;
        let height = cesiumContainer.clientHeight;

        let aspect = width / height;
        three.camera.aspect = aspect;
        three.camera.updateProjectionMatrix();
        three.renderer.setSize(width, height);
        three.renderer.clear();
        three.renderer.render(three.scene, three.camera);
    }
    const loop = () => {
        requestAnimationFrame(loop);
        renderCesium();
        renderThreeObj(viewer);
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
