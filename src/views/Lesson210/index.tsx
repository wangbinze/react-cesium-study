import './index.css';
import {useEffect, useState} from "react";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry';
// import WhiteShark from '';
import {
    WaterSimulation,
    Water,
    EnvironmentMap,
    Caustics,
    Environment,
    Debug
} from './ThreeComponents';

// skybox  images
import TropicalSunnyDay_px from '../../assets/images/TropicalSunnyDay_px.jpg';
import TropicalSunnyDay_nx from '../../assets/images/TropicalSunnyDay_nx.jpg';
import TropicalSunnyDay_py from '../../assets/images/TropicalSunnyDay_py.jpg';
import TropicalSunnyDay_ny from '../../assets/images/TropicalSunnyDay_ny.jpg';
import TropicalSunnyDay_pz from '../../assets/images/TropicalSunnyDay_pz.jpg';
import TropicalSunnyDay_nz from '../../assets/images/TropicalSunnyDay_nz.jpg';

// import WhiteShark from '../../assets/model/WhiteShark.obj';

const Lesson210 = () => {
    const [canvas, setCanvas] = useState<HTMLElement | null>(null);
    const scene = new THREE.Scene();
    let camera: any;
    let temporaryRenderTarget: any;

    // Clock
    const clock = new THREE.Clock();

    let height = 0;
    let width = 0;
    // Colors
    const black = new THREE.Color('black');
    const white = new THREE.Color('white');

    // constants 都不需要改变的,直接申明
    const waterPosition = new THREE.Vector3(0, 0, 0.8);
    const near = 0.;
    const far = 2.0;
    const waterSize = 1024;
    // Geometries
    const waterGeometry = new THREE.PlaneGeometry(2, 2, waterSize, waterSize);

    // Environment
    const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);

    // Skybox
    // const cubetextureloader = new THREE.CubeTextureLoader();
    let skybox;

    // Create directional light   看是否需要放到 useEffect 里面
    const light = [0, 0, -1];
    const lightCamera = new THREE.OrthographicCamera(-1.2, 1.2, 1.2, -1.2, near, far);
    lightCamera.position.set(0., 0., 1.5);
    lightCamera.lookAt(0, 0, 0);

    // renderer
    let renderer: any;
    // controls
    let controls: any;

    let waterSimulation: any;
    let water: any;
    let environmentMap: any;
    let environment: any;
    let caustics: any;
    let debug: any;

    let shark: any;
    let sharkLoaded: any;
    const sharkAll: any[] = [];

    let rock1: any;
    let rock2: any;
    let plant: any;
    /**
     * 鼠标滑动需要效果的
     */
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();
    // const targetgeometry = new THREE.PlaneGeometry(2, 2);
    // for (let vertex of targetgeometry.vertices) {
    //     vertex.z = waterPosition.z;
    // }
    // const targetmesh = new THREE.Mesh(targetgeometry);

    // 获取canvas
    useEffect(() => {
        const canvas = document.getElementById('canvas');
        setCanvas(canvas);
    }, [])
    // 获取canvas后设置height和width
    useEffect(() => {
        if (!canvas) return;
        height = canvas.clientHeight;
        width = canvas.clientWidth;
        loadModel();
        init(canvas);
    }, [canvas]);
    const loadModel = () => {
        const objLoader = new OBJLoader();
        sharkLoaded = new Promise((resolve, reject) => {
            objLoader.load('./models/123.obj', (object) => {
                const modelLength = object.children.length;
                // 如果满足条件，那么去取object.children里面的数据，循环渲染
                if (object instanceof THREE.Group) {
                    // 循环object.children
                    for (let i = 0; i < modelLength; i++) {
                        const model = object.children[i];
                        if (model instanceof THREE.Mesh) {
                            const modelGeometry = model.geometry;
                            // modelGeometry.computeVertexNormals();
                            modelGeometry.scale(0.01, 0.01, 0.01);
                            modelGeometry.translate(0.2, 0., 0.35);
                            sharkAll.push(modelGeometry);
                        }
                    }
                    // @ts-ignore
                    resolve();
                }

            }, undefined, (error) => {
                console.error('An error occurred while loading the object:', error);
                reject(error);
            });
        })

        const rockLoaded = new Promise((resolve, reject) => {
            objLoader.load('./models/rockRed.obj', (object) => {
                if (object instanceof THREE.Group) {
                    const sharkObject = object.children[0]; // 假设鲨鱼是第一个子对象
                    if (sharkObject instanceof THREE.Mesh) {
                        // 检查子对象是否是一个 Mesh 对象
                        const sharkGeometry = sharkObject.geometry;
                        sharkGeometry.computeVertexNormals();
                        rock1 = new THREE.BufferGeometry().copy(sharkGeometry);
                        rock1.scale(0.05, 0.05, 0.02);
                        rock1.translate(0.2, 0., 0.1);

                        rock2 = new THREE.BufferGeometry().copy(sharkGeometry);
                        rock2.scale(0.05, 0.05, 0.05);
                        rock2.translate(-0.5, 0.5, 0.2);
                        rock2.rotateZ(Math.PI / 2.);

                        // @ts-ignore
                        resolve();
                    } else {
                        console.error('Child object is not a Mesh:', sharkObject);
                    }
                } else {
                    console.error('Loaded object is not a Group:', object);
                }
            }, undefined, (error) => {
                console.error('An error occurred while loading the object:', error);
                reject(error);
            });
        });

        const plantLoaded = new Promise((resolve, reject) => {
            objLoader.load('./models/plant.obj', (object) => {
                if (object instanceof THREE.Group) {
                    const plantObject = object.children[0];
                    if (plantObject instanceof THREE.Mesh) {
                        // 检查子对象是否是一个 Mesh 对象
                        const plantGeometry = plantObject.geometry;
                        plantGeometry.computeVertexNormals();
                        plant = plantGeometry;
                        plant.rotateX(Math.PI / 6.);
                        plant.scale(0.03, 0.03, 0.03);
                        plant.translate(-0.5, 0.5, 0.);
                        // @ts-ignore
                        resolve();
                    } else {
                        console.error('Child object is not a Mesh:', plantObject);
                    }
                } else {
                    console.error('Loaded object is not a Group:', object);
                }
                // plantGeometry = plantGeometry.children[0].geometry;
                // plantGeometry.computeVertexNormals();
                //
                // plant = plantGeometry;
                // plant.rotateX(Math.PI / 6.);
                // plant.scale(0.03, 0.03, 0.03);
                // plant.translate(-0.5, 0.5, 0.);
                //
                // resolve();
            }, undefined, (error) => {
                console.error('An error occurred while loading the object:', error);
                reject(error);
            });
        });
    }
    const loadFile = (fileName: any) => {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FileLoader();
            loader.load(fileName, (data) => {
                resolve(data);
            })
        })
    }
    const init = (canvas: any) => {
        // Create Renderer
        camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 100);
        camera.position.set(-1.5, -1.5, 1);
        camera.up.set(0, 0, 1);
        camera.position.set(0, 0, 0); // 将相机位置设置在模型内部
        camera.lookAt(0, 0, 1); // 将相机方向设置为指向模型内部
        scene.add(camera);

        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
        renderer.setSize(width, height);
        renderer.autoClear = false;

        // Create mouse Controls
        controls = new OrbitControls(
            camera,
            canvas
        );

        controls.target = waterPosition;

        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2.0 - 0.1;

        controls.minDistance = 1.5;
        controls.maxDistance = 3;

        controls.target = waterPosition;

        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2.0 - 0.1;

        controls.minDistance = 1.5;
        controls.maxDistance = 3.0;

        // Target for computing the water refraction  计算水的折射目标
        temporaryRenderTarget = new THREE.WebGLRenderTarget(width, height);

        // addSkybox();
        const cubetextureloader = new THREE.CubeTextureLoader();

        const skybox = cubetextureloader.load([
            TropicalSunnyDay_px,
            TropicalSunnyDay_nx,
            TropicalSunnyDay_py,
            TropicalSunnyDay_ny,
            TropicalSunnyDay_pz,
            TropicalSunnyDay_nz
        ]);
        scene.background = skybox;

        // 将类引入声明
        waterSimulation = new WaterSimulation({waterSize: waterSize});
        water = new Water({
            light: light,
            skybox: skybox,
            waterPosition: waterPosition,
            waterGeometry: waterGeometry
        });
        environmentMap = new EnvironmentMap();
        environment = new Environment({light: light, lightCamera: lightCamera});
        caustics = new Caustics({waterSize: waterSize, light: light});
        debug = new Debug();

        const loaded = [
            waterSimulation.loaded,
            water.loaded,
            environmentMap.loaded,
            environment.loaded,
            caustics.loaded,
            debug.loaded,
            sharkLoaded,
            // rockLoaded,
            // plantLoaded,
        ];

        Promise.all(loaded).then(() => {
            // console.log(sharkAll, 'sharkAll--123')
            const envGeometries = [floorGeometry, ...sharkAll, rock1, rock2, plant];

            // console.log(envGeometries, 'envGeometries--')
            environmentMap.setGeometries(envGeometries);
            environment.setGeometries(envGeometries);

            environment.addTo(scene);
            // water.mesh.position.set(0, 0, 1); // 或者根据需要调整水面的位置
            scene.add(water.mesh);

            caustics.setDeltaEnvTexture(1. / environmentMap.size);

            // canvas.addEventListener('mousemove', {handleEvent: onMouseMove});

            for (let i = 0; i < 5; i++) {
                waterSimulation.addDrop(
                    renderer,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    0.03,
                    (i & 1) ? 0.02 : -0.02
                );
            }

            animate();
        })
    }

    const animate = () => {
        // stats.begin();
        // 添加水花效果  放开以下注释代码，开启水花自动的效果
        // 修改可以调整水花的数量
        if (Math.random() < 0.005) {
            waterSimulation.addDrop(
                renderer,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                0.03,
                // 调整水花大小
                Math.random() * 0.08 - 0.04
            );
        }

        if (clock.getElapsedTime() > 0.032) {
            waterSimulation.stepSimulation(renderer);

            const waterTexture = waterSimulation.target.texture;
            water.setHeightTexture(waterTexture);

            environmentMap.render(renderer, {black: black, lightCamera: lightCamera});
            const environmentMapTexture = environmentMap.target.texture;

            caustics.setTextures(waterTexture, environmentMapTexture);
            caustics.render(renderer, {black: black, lightCamera: lightCamera});
            const causticsTexture = caustics.target.texture;

            environment.updateCaustics(causticsTexture);

            clock.start();
        }

        // Render everything but the refractive water 渲染除折射水以外的所有内容
        renderer.setRenderTarget(temporaryRenderTarget);
        renderer.setClearColor(white, 1);
        renderer.clear();

        water.mesh.visible = false;
        renderer.render(scene, camera);

        water.setEnvMapTexture(temporaryRenderTarget.texture);

        // Then render the final scene with the refractive water 然后使用折射水渲染最终场景
        renderer.setRenderTarget(null);
        renderer.setClearColor(white, 1);
        renderer.clear();
        water.mesh.visible = true;
        renderer.render(scene, camera);

        controls.update();

        // stats.end();

        window.requestAnimationFrame(animate);
    }

    /*const onMouseMove = (event:any) => {
        if (!canvas) return;
        console.log(event)
        const rect = canvas.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left) * 2 / width - 1;
        mouse.y = -(event.clientY - rect.top) * 2 / height + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(targetmesh);

        for (let intersect of intersects) {
            waterSimulation.addDrop(renderer, intersect.point.x, intersect.point.y, 0.03, 0.02);
        }
    }*/

    return (
        <div className="container">
            <canvas id="canvas" style={{width: "1024px", height: "800px"}}></canvas>
        </div>
    )
}
export default Lesson210;
