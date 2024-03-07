// ThreeComponents.js

import * as THREE from 'three';

import simulationVertex from './shaders/simulation/vertex.glsl';
import simulationDropFragment from './shaders/simulation/drop_fragment.glsl';
import simulationUpdateFragment from './shaders/simulation/update_fragment.glsl';

import waterVertex from './shaders/water/vertex.glsl';
import waterFragment from './shaders/water/fragment.glsl';

import environmentMappingVertex from './shaders/environment_mapping/vertex.glsl';
import environmentMappingFragment from './shaders/environment_mapping/fragment.glsl';

import causticsWaterVertex from './shaders/caustics/water_vertex.glsl';
import causticsWaterFragment from './shaders/caustics/water_fragment.glsl';

import environmentVertex from './shaders/environment/vertex.glsl';
import environmentFragment from './shaders/environment/fragment.glsl';

import debugVertex from './shaders/debug/vertex.glsl';
import debugFragment from './shaders/debug/fragment.glsl';


const loadFile = (filename) => {
    return new Promise((resolve, reject) => {
        const loader = new THREE.FileLoader();
        loader.load(filename, (data) => {
            resolve(data);
        });
    });
}

export class WaterSimulation {
    // WaterSimulation 类的定义...
    constructor(options) {
        const waterSize = options.waterSize;
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);
        this._geometry = new THREE.PlaneGeometry(2, 2);
        this._targetA = new THREE.WebGLRenderTarget(waterSize, waterSize, {type: THREE.FloatType});
        this._targetB = new THREE.WebGLRenderTarget(waterSize, waterSize, {type: THREE.FloatType});
        this.target = this._targetA;

        const shadersPromises = [
            loadFile(simulationVertex),
            loadFile(simulationDropFragment),
            loadFile(simulationUpdateFragment),
        ];
        this.loaded = Promise.all(shadersPromises)
            .then(([vertexShader, dropFragmentShader, updateFragmentShader]) => {
                const dropMaterial = new THREE.RawShaderMaterial({
                    uniforms: {
                        center: {value: [0, 0]},
                        radius: {value: 0},
                        strength: {value: 0},
                        texture: {value: null},
                    },
                    vertexShader: vertexShader,
                    fragmentShader: dropFragmentShader,
                });
                const updateMaterial = new THREE.RawShaderMaterial({
                    uniforms: {
                        delta: {value: [1 / 216, 1 / 216]},  // TODO: Remove this useless uniform and hardcode it in shaders?
                        texture: {value: null},
                    },
                    vertexShader: vertexShader,
                    fragmentShader: updateFragmentShader,
                });

                this._dropMesh = new THREE.Mesh(this._geometry, dropMaterial);
                this._updateMesh = new THREE.Mesh(this._geometry, updateMaterial);
            });
    }

    addDrop(renderer, x, y, radius, strength) {
        this._dropMesh.material.uniforms['center'].value = [x, y];
        this._dropMesh.material.uniforms['radius'].value = radius;
        this._dropMesh.material.uniforms['strength'].value = strength;

        this._render(renderer, this._dropMesh);
    }

    stepSimulation(renderer) {
        this._render(renderer, this._updateMesh);
    }

    _render(renderer, mesh) {
        // Swap textures
        const _oldTarget = this.target;
        const _newTarget = this.target === this._targetA ? this._targetB : this._targetA;

        const oldTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(_newTarget);

        mesh.material.uniforms['texture'].value = _oldTarget.texture;

        // TODO Camera is useless here, what should be done?
        renderer.render(mesh, this._camera);

        renderer.setRenderTarget(oldTarget);

        this.target = _newTarget;
    }
}

export class Water {
    // Water 类的定义...
    constructor(options) {
        const light = options.light;
        const skybox = options.skybox;
        const waterGeometry = options.waterGeometry;
        const waterPosition = options.waterPosition;

        this.geometry = waterGeometry;

        const shadersPromises = [
            loadFile(waterVertex),
            loadFile(waterFragment)
        ]

        this.loaded = Promise.all(shadersPromises)
            .then(([vertexShader, fragmentShader]) => {
                this.material = new THREE.ShaderMaterial({
                    uniforms: {
                        light: {value: light},
                        water: {value: null},
                        envMap: {value: null},
                        skybox: {value: skybox},
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                });
                this.material.extensions = {
                    derivatives: true
                };

                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.position.set(
                    waterPosition.x,
                    waterPosition.y,
                    waterPosition.z
                );
            });
    }

    setHeightTexture(waterTexture) {
        this.material.uniforms['water'].value = waterTexture;
    }

    setEnvMapTexture(envMap) {
        this.material.uniforms['envMap'].value = envMap;
    }
}

export class EnvironmentMap {
    // EnvironmentMap 类的定义...
    constructor() {
        this.size = 1024;
        this.target = new THREE.WebGLRenderTarget(this.size, this.size, {type: THREE.FloatType});

        const shadersPromises = [
            loadFile(environmentMappingVertex),
            loadFile(environmentMappingFragment)
        ]

        this._meshes = [];

        this.loaded = Promise.all(shadersPromises)
            .then(([vertexShader, fragmentShader]) => {
                this._material = new THREE.ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                });
            });
    }

    setGeometries(geometries) {
        this._meshes = [];

        for (let geometry of geometries) {
            this._meshes.push(new THREE.Mesh(geometry, this._material));
        }
    }

    render(renderer, options) {
        const black = options.black;
        const lightCamera = options.lightCamera;

        const oldTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(this.target);
        renderer.setClearColor(black, 0);
        renderer.clear();

        for (let mesh of this._meshes) {
            renderer.render(mesh, lightCamera);
        }

        renderer.setRenderTarget(oldTarget);
    }
}

export class Caustics {
    // Caustics 类的定义...
    constructor(options) {
        const waterSize = options.waterSize;
        const light = options.light;

        this.target = new THREE.WebGLRenderTarget(
            waterSize * 3.0,
            waterSize * 3.0,
            {type: THREE.FloatType}
        );

        this._waterGeometry = new THREE.PlaneGeometry(2, 2, waterSize, waterSize);

        const shadersPromises = [
            loadFile(causticsWaterVertex),
            loadFile(causticsWaterFragment)
        ]

        this.loaded = Promise.all(shadersPromises)
            .then(([waterVertexShader, waterFragmentShader]) => {
                this._waterMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        light: {value: light},
                        env: {value: null},
                        water: {value: null},
                        deltaEnvTexture: {value: null},
                    },
                    vertexShader: waterVertexShader,
                    fragmentShader: waterFragmentShader,
                    transparent: true,
                });
                this._waterMaterial.blending = THREE.CustomBlending;

                // Set the blending so that:
                // Caustics intensity uses an additive function
                this._waterMaterial.blendEquation = THREE.AddEquation;
                this._waterMaterial.blendSrc = THREE.OneFactor;
                this._waterMaterial.blendDst = THREE.OneFactor;

                // Caustics depth does not use blending, we just set the value
                this._waterMaterial.blendEquationAlpha = THREE.AddEquation;
                this._waterMaterial.blendSrcAlpha = THREE.OneFactor;
                this._waterMaterial.blendDstAlpha = THREE.ZeroFactor;


                this._waterMaterial.side = THREE.DoubleSide;
                this._waterMaterial.extensions = {
                    derivatives: true
                };

                this._waterMesh = new THREE.Mesh(this._waterGeometry, this._waterMaterial);
            });
    }

    setDeltaEnvTexture(deltaEnvTexture) {
        this._waterMaterial.uniforms['deltaEnvTexture'].value = deltaEnvTexture;
    }

    setTextures(waterTexture, envTexture) {
        this._waterMaterial.uniforms['env'].value = envTexture;
        this._waterMaterial.uniforms['water'].value = waterTexture;
    }

    render(renderer, options) {
        const black = options.black;
        const lightCamera = options.lightCamera;

        const oldTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(this.target);
        renderer.setClearColor(black, 0);
        renderer.clear();

        renderer.render(this._waterMesh, lightCamera);

        renderer.setRenderTarget(oldTarget);
    }
}

export class Environment {
    // Environment 类的定义...
    constructor(options) {
        // 需要的参数
        const light = options.light;
        const lightCamera = options.lightCamera;

        const shadersPromises = [
            loadFile(environmentVertex),
            loadFile(environmentFragment)
        ];

        this._meshes = [];

        this.loaded = Promise.all(shadersPromises).then(([vertexShader, fragmentShader]) => {
            this._material = new THREE.ShaderMaterial({
                uniforms: {
                    light: {value: light},
                    caustics: {value: null},
                    lightProjectionMatrix: {value: lightCamera.projectionMatrix},
                    lightViewMatrix: {value: lightCamera.matrixWorldInverse}
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            });
        });
    }

    setGeometries(geometries) {
        this._meshes = [];

        for (let geometry of geometries) {
            this._meshes.push(new THREE.Mesh(geometry, this._material));
        }
    }

    updateCaustics(causticsTexture) {
        this._material.uniforms['caustics'].value = causticsTexture;
    }

    addTo(scene) {
        for (let mesh of this._meshes) {
            scene.add(mesh);
        }
    }
}

export class Debug {
    // Debug 类的定义...
    constructor() {
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);
        this._geometry = new THREE.PlaneGeometry();

        const shadersPromises = [
            loadFile(debugVertex),
            loadFile(debugFragment)
        ];

        this.loaded = Promise.all(shadersPromises)
            .then(([vertexShader, fragmentShader]) => {
                this._material = new THREE.RawShaderMaterial({
                    uniforms: {
                        texture: {value: null},
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                });
                this._mesh = new THREE.Mesh(this._geometry, this._material);
                this._material.transparent = true;
            });
    }

    draw(renderer, texture) {
        this._material.uniforms['texture'].value = texture;
        const oldTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(null);
        renderer.render(this._mesh, this._camera);

        renderer.setRenderTarget(oldTarget);
    }
}
