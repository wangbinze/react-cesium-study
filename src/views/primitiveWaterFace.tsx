/**
 * PrimitiveWaterFace
 * 海面水波纹理
 */
import React, {useEffect} from "react";
import PrimitiveWaterFace from "./waterFace";
import {useCesium} from "resium";
import WaterFaceImage from '../../assets/images/waterNormals.png'
import Earthspec1k from '../../assets/images/earthspec1k.jpg'
import smokeImg from '../../assets/images/smoke.png'
import circular_particle from '../../assets/images/circular_particle.png'
import * as Cesium from "cesium";
import {dataJson5, dataJson10, dataJsonFog, dataJsonFog1} from './haiyuData'
import {Cartesian3} from "cesium";
// import {
//     Cartesian3,
//     EllipsoidSurfaceAppearance,
//     GeometryInstance,
//     PolygonGeometry,
//     PolygonHierarchy,
//     Primitive
// } from "cesium";

// let lastStage = null;

// 大雾
export const PrimitiveWaterFaceC: React.FC = (): JSX.Element => {
    const {viewer} = useCesium();
    const rainParticleSize = 15.0;
    const rainRadius = 100000.0;
    const rainImageSize = new Cesium.Cartesian2(
        rainParticleSize,
        rainParticleSize * 2.0
    );
    let rainGravityScratch = new Cesium.Cartesian3();
    useEffect(() => {
        if (viewer) {
            console.log('加载了');
            addWaterFace();
            // addRainEffect();
            // addFogEffect();
            // addWaterFace1();
        }
        return () => {
            console.log('卸载了')
        };
    }, [viewer]);

    useEffect(() => {
        if (viewer) {
            // 创建用于绘制的 Cartesian3 数组
            const positions: Cesium.Cartesian3[] = [];
            for (let i = 0; i < dataJsonFog.length; i += 3) {
                const longitude = dataJsonFog[i];
                const latitude = dataJsonFog[i + 1];
                const height = dataJsonFog[i + 2];
                const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                positions.push(position);
            }

            // 添加多边形，这个是用来确定需要添加雾的范围的
            // viewer.entities.add({
            //     polygon: {
            //         hierarchy: new Cesium.PolygonHierarchy(positions),
            //         material: Cesium.Color.BLUE.withAlpha(1),  // 设置面的颜色和透明度
            //     },
            // });
            /*
            viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(dataJsonFog1)
                    ),
                    height: 0.0,
                    // extrudedHeight: -10000.0,
                    material: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.2),
                    clampToGround: true,
                    classificationType: Cesium.ClassificationType.BOTH,
                },
            });
            */
        }
    }, [viewer]);

    /*
    useEffect(() => {
        if (viewer) {
            // 获取相机对象
            const camera = viewer.camera;
            // 监听相机位置的变化
            viewer.scene.postRender.addEventListener(function () {
                // 获取相机的位置
                const cameraPosition = camera.positionWC;
                // 打印相机的位置
                console.log('相机位置:', cameraPosition);
            });
        }
    }, [viewer]);
    */
    /**
     * 添加水波纹理 function
     */
    const addWaterFace = () => {
        // 方法1
        /*
        const primitive = PrimitiveWaterFace({
            'viewer': viewer,
            'normalMapUrl': WaterFaceImage,
            'DegreesArrayHeights': dataJson5
        });
        */

        const worldRectangle = viewer.scene.primitives.add(
            new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.RectangleGeometry({
                        rectangle: Cesium.Rectangle.fromDegrees(
                            -180.0,
                            -90.0,
                            180.0,
                            90.0
                        ),
                        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    }),
                }),
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                    aboveGround: true,
                }),
                show: true,
            })
        );

        worldRectangle.appearance.material = new Cesium.Material({
            fabric: {
                type: "Water",
                uniforms: {
                    specularMap: Earthspec1k,
                    normalMap: Cesium.buildModuleUrl(
                        WaterFaceImage
                    ),
                    frequency: 1000.0,  // 水波纹的频率
                    animationSpeed: 0.06,  // 水的流动动画速度
                    amplitude: 20,  // 波纹振幅
                    specularIntensity: 10,  // 镜面反射强度
                    baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.5),
                },
            },
        });
        //   worldRectangle.appearance = new Cesium.MaterialAppearance({
        //       material: new Cesium.Material({
        //           fabric: {
        //               uniforms: {
        //                   iTime: 0,
        //               },
        //               source:`
        //   const int NUM_STEPS = 8;
        // const float PI     = 3.141592;
        // const float EPSILON  = 1e-3;
        // //#define EPSILON_NRM (0.1 / iResolution.x)
        // #define EPSILON_NRM (0.1 / 200.0)
        //
        // // sea
        // const int ITER_GEOMETRY = 3;
        // const int ITER_FRAGMENT = 5;
        // const float SEA_HEIGHT = 0.6;
        // const float SEA_CHOPPY = 4.0;
        // const float SEA_SPEED = 1.8;
        // const float SEA_FREQ = 0.16;
        // const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
        // const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
        // //#define SEA_TIME (1.0 + iTime * SEA_SPEED)
        //
        // const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);
        //
        // // math
        // mat3 fromEuler(vec3 ang) {
        //   vec2 a1 = vec2(sin(ang.x),cos(ang.x));
        //   vec2 a2 = vec2(sin(ang.y),cos(ang.y));
        //   vec2 a3 = vec2(sin(ang.z),cos(ang.z));
        //   mat3 m;
        //   m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
        //   m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
        //   m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
        //   return m;
        // }
        // float hash( vec2 p ) {
        //   float h = dot(p,vec2(127.1,311.7));
        //   return fract(sin(h)*43758.5453123);
        // }
        // float noise( in vec2 p ) {
        //   vec2 i = floor( p );
        //   vec2 f = fract( p );
        //   vec2 u = f*f*(3.0-2.0*f);
        //   return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
        //            hash( i + vec2(1.0,0.0) ), u.x),
        //         mix( hash( i + vec2(0.0,1.0) ),
        //            hash( i + vec2(1.0,1.0) ), u.x), u.y);
        // }
        //
        // // lighting
        // float diffuse(vec3 n,vec3 l,float p) {
        //   return pow(dot(n,l) * 0.4 + 0.6,p);
        // }
        // float specular(vec3 n,vec3 l,vec3 e,float s) {
        //   float nrm = (s + 8.0) / (PI * 8.0);
        //   return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
        // }
        //
        // // sky
        // vec3 getSkyColor(vec3 e) {
        //   e.y = max(e.y,0.0);
        //   return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4);
        // }
        //
        // // sea
        // float sea_octave(vec2 uv, float choppy) {
        //   uv += noise(uv);
        //   vec2 wv = 1.0-abs(sin(uv));
        //   vec2 swv = abs(cos(uv));
        //   wv = mix(wv,swv,wv);
        //   return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
        // }
        //
        // float map(vec3 p) {
        //   float freq = SEA_FREQ;
        //   float amp = SEA_HEIGHT;
        //   float choppy = SEA_CHOPPY;
        //   vec2 uv = p.xz; uv.x *= 0.75;
        //
        //   float d, h = 0.0;
        //   float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        //   for(int i = 0; i < ITER_GEOMETRY; i++) {
        //     d = sea_octave((uv+SEA_TIME)*freq,choppy);
        //     d += sea_octave((uv-SEA_TIME)*freq,choppy);
        //     h += d * amp;
        //     uv *= octave_m; freq *= 1.9; amp *= 0.22;
        //     choppy = mix(choppy,1.0,0.2);
        //   }
        //   return p.y - h;
        // }
        //
        // float map_detailed(vec3 p) {
        //   float freq = SEA_FREQ;
        //   float amp = SEA_HEIGHT;
        //   float choppy = SEA_CHOPPY;
        //   vec2 uv = p.xz; uv.x *= 0.75;
        //
        //   float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        //
        //   float d, h = 0.0;
        //   for(int i = 0; i < ITER_FRAGMENT; i++) {
        //     d = sea_octave((uv+SEA_TIME)*freq,choppy);
        //     d += sea_octave((uv-SEA_TIME)*freq,choppy);
        //     h += d * amp;
        //     uv *= octave_m; freq *= 1.9; amp *= 0.22;
        //     choppy = mix(choppy,1.0,0.2);
        //   }
        //   return p.y - h;
        // }
        //
        // vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
        //   float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
        //   fresnel = pow(fresnel,3.0) * 0.65;
        //
        //   vec3 reflected = getSkyColor(reflect(eye,n));
        //   vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12;
        //
        //   vec3 color = mix(refracted,reflected,fresnel);
        //
        //   float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
        //   color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
        //
        //   color += vec3(specular(n,l,eye,60.0));
        //
        //   return color;
        // }
        //
        // // tracing
        // vec3 getNormal(vec3 p, float eps) {
        //   vec3 n;
        //   n.y = map_detailed(p);
        //   n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
        //   n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
        //   n.y = eps;
        //   return normalize(n);
        // }
        //
        // float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
        //   float tm = 0.0;
        //   float tx = 1000.0;
        //   float hx = map(ori + dir * tx);
        //   if(hx > 0.0) return tx;
        //   float hm = map(ori + dir * tm);
        //   float tmid = 0.0;
        //   for(int i = 0; i < NUM_STEPS; i++) {
        //     tmid = mix(tm,tx, hm/(hm-hx));
        //     p = ori + dir * tmid;
        //     float hmid = map(p);
        //     if(hmid < 0.0) {
        //       tx = tmid;
        //       hx = hmid;
        //     } else {
        //       tm = tmid;
        //       hm = hmid;
        //     }
        //   }
        //   return tmid;
        // }
        //
        //      vec4 czm_getMaterial(vec2 vUv)
        //      {
        //       vec2 uv = vUv;
        //       uv = vUv * 2.0 - 1.0;
        //
        //       float time = iTime * 0.3 + 0.0*0.01;
        //
        //
        //       // ray
        //       vec3 ang = vec3(0, 1.2, 0.0);
        //         vec3 ori = vec3(0.0,3.5,0);
        //       vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
        //       dir = normalize(dir) * fromEuler(ang);
        //
        //       // tracing
        //       vec3 p;
        //       heightMapTracing(ori,dir,p);
        //       vec3 dist = p - ori;
        //       vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
        //       vec3 light = normalize(vec3(0.0,1.0,0.8));
        //
        //       // color
        //       vec3 color = mix(
        //         getSkyColor(dir),
        //         getSeaColor(p,n,light,dir,dist),
        //         pow(smoothstep(0.0,-0.05,dir.y),0.3));
        //
        //          return vec4( pow(color,vec3(0.75)), 1.0 );
        //      }
        //   `,
        //           }
        //       }),
        //       translucent: true,
        //       vertexShaderSource: `
        //   attribute vec3 position3DHigh;
        //   attribute vec3 position3DLow;
        //   attribute float batchId;
        //   attribute vec2 st;
        //   attribute vec3 normal;
        //   varying vec2 v_st;
        //   varying vec3 v_positionEC;
        //   varying vec3 v_normalEC;
        //
        //   void main() {
        //       v_st = st;
        //
        //       vec4 p = czm_computePosition();
        //
        //       v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
        //       v_normalEC = czm_normal * normal;                         // normal in eye coordinates
        //
        //       gl_Position = czm_modelViewProjectionRelativeToEye * p;
        //   }
        //               `,
        //       fragmentShaderSource: `
        // varying vec2 v_st;
        // varying vec3 v_positionEC;
        // varying vec3 v_normalEC;
        //
        // void main()  {
        //   vec3 positionToEyeEC = -v_positionEC;
        //   vec3 normalEC = normalize(v_normalEC);
        //   czm_materialInput materialInput;
        //   materialInput.normalEC = normalEC;
        //   materialInput.positionToEyeEC = positionToEyeEC;
        //   materialInput.st = v_st;
        //   vec4 color = czm_getMaterial(v_st);
        //
        //   gl_FragColor = color;
        //
        //
        // }
        //           `,
        //   })
        // 流动水面效果  方法2  但是没有第一种效果看起来好
        // viewer.scene.primitives.add(
        //     new Cesium.Primitive({
        //         geometryInstances: new Cesium.GeometryInstance({
        //             geometry: new Cesium.PolygonGeometry({
        //                 polygonHierarchy: new Cesium.PolygonHierarchy(
        //                     Cesium.Cartesian3.fromDegreesArray(dataJson10)
        //                 ),
        //                 vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        //                 height: 0,  // 设置底部高度，水面起始高度
        //                 extrudedHeight: 100  // 设置顶部高度，水面结束高度
        //             }),
        //         }),
        //         appearance: new Cesium.EllipsoidSurfaceAppearance({
        //             material: new Cesium.Material({
        //                 fabric: {
        //                     type: "Water",  // 使用水面效果的材质
        //                     uniforms: {
        //                         // baseWaterColor: new Cesium.Color(0, 139, 139, 0.2),  // 水的基本颜色
        //                         baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.2),
        //                         normalMap: WaterFaceImage,  // 法线贴图，用于模拟水面波纹效果
        //                         frequency: 1000.0,  // 水波纹的频率
        //                         animationSpeed: 0.06,  // 水的流动动画速度
        //                         amplitude: 10,  // 波纹振幅
        //                         specularIntensity: 10  // 镜面反射强度
        //                     }
        //                 }
        //             })
        //         }),
        //     })
        // );
        /*
        viewer.scene.primitives.add(
            new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: new Cesium.PolygonGeometry({
                        polygonHierarchy: new Cesium.PolygonHierarchy(
                            Cesium.Cartesian3.fromDegreesArray(dataJson10)
                        ),
                        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                        height: 0,  // 设置底部高度，水面起始高度
                        extrudedHeight: 100  // 设置顶部高度，水面结束高度
                    }),
                }),
                appearance: new Cesium.EllipsoidSurfaceAppearance({
                    material : new Cesium.Material({
                        fabric : {
                            type : 'Water',
                            uniforms : {
                                // baseWaterColor:new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                                // blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                                // specularMap: 'gray.jpg',
                                normalMap: WaterFaceImage,
                                frequency: 1000.0,
                                animationSpeed: 0.01,
                                amplitude: 10.0
                            }
                        }
                    }),
                    fragmentShaderSource: 'varying vec3 v_positionMC;\n' +
                        'varying vec3 v_positionEC;\n' +
                        'varying vec2 v_st;\n' +
                        'void main()\n' +
                        '{\n' +
                        'czm_materialInput materialInput;\n' +
                        'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
                        '#ifdef FACE_FORWARD\n' +
                        'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
                        '#endif\n' +
                        'materialInput.s = v_st.s;\n' +
                        'materialInput.st = v_st;\n' +
                        'materialInput.str = vec3(v_st, 0.0);\n' +
                        'materialInput.normalEC = normalEC;\n' +
                        'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
                        'vec3 positionToEyeEC = -v_positionEC;\n' +
                        'materialInput.positionToEyeEC = positionToEyeEC;\n' +
                        'czm_material material = czm_getMaterial(materialInput);\n' +
                        '#ifdef FLAT\n' +
                        'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
                        '#else\n' +
                        'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n' +
                        'gl_FragColor.a=0.2;\n' +
                        '#endif\n' +
                        '}\n'
                }),
            })
        );
        */

        /*
       const waterPrimitive = new Primitive({
            // id:data[i][IDField]||generateUUID(),
            show: true,// 默认隐藏
            allowPicking:false,
            geometryInstances : new GeometryInstance({
                geometry : new PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(dataJson10)
                    ),
                    extrudedHeight: 0, // 注释掉此属性可以只显示水面
                    perPositionHeight : true // 注释掉此属性水面就贴地了
                })
            }),
            // 可以设置内置的水面shader
            appearance : new EllipsoidSurfaceAppearance({
                material : new Cesium.Material({
                    fabric : {
                        type : 'Water',
                        uniforms : {
                            // baseWaterColor:new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                            // blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                            // specularMap: 'gray.jpg',
                            normalMap: WaterFaceImage,
                            frequency: 1000.0,
                            animationSpeed: 0.01,
                            amplitude: 10.0
                        }
                    }
                }),
                fragmentShaderSource: 'varying vec3 v_positionMC;\n' +
                    'varying vec3 v_positionEC;\n' +
                    'varying vec2 v_st;\n' +
                    'void main()\n' +
                    '{\n' +
                    'czm_materialInput materialInput;\n' +
                    'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
                    '#ifdef FACE_FORWARD\n' +
                    'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
                    '#endif\n' +
                    'materialInput.s = v_st.s;\n' +
                    'materialInput.st = v_st;\n' +
                    'materialInput.str = vec3(v_st, 0.0);\n' +
                    'materialInput.normalEC = normalEC;\n' +
                    'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
                    'vec3 positionToEyeEC = -v_positionEC;\n' +
                    'materialInput.positionToEyeEC = positionToEyeEC;\n' +
                    'czm_material material = czm_getMaterial(materialInput);\n' +
                    '#ifdef FLAT\n' +
                    'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
                    '#else\n' +
                    'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n' +
                    'gl_FragColor.a=0.4;\n' +
                    '#endif\n' +
                    '}\n'
            })
        });
       viewer.scene.primitives.add(waterPrimitive)
       */

        /**
         * 地下透视效果
         * 会导致很多问题，比如polyline自定义的线材材质，不同的视角，会导致呈现白色的情况
         */
        // 设置鼠标进去地下,禁用相机与地形的碰撞检测
        // viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
        // 启用或禁用地下模式
        // viewer.scene.underground = false;
        // 设置地球透明
        // viewer.scene.globe.translucency.enabled = true;
        // 地形放大（夸张）
        // viewer.scene.globe.terrainExaggeration = 8.0;

        /**
         * 关闭以下，使得到底海底时，更加清晰
         */
        // viewer.scene.highDynamicRange = false; // 关闭高动态范围渲染
        // viewer.scene.skyAtmosphere.show = false; // 关闭大气
        // viewer.scene.skyBox.show = false; // 关闭天空盒
        // viewer.scene.fog.enabled = false; // 关闭雾
        /**
         * near:400.0 是近距离（摄像机到地球表面的距离）的阈值，单位是米。
         * nearVale:0.5 是在近距离阈值以下时的透明度。这里是 0.5，表示地球表面将部分透明。
         * far:8000 是远距离的阈值，单位是米。
         * farVale:0.9 是在远距离阈值以上时的透明度。这里是 0.9，表示地球表面将非常透明。
         */
        // viewer.scene.globe.translucency.frontFaceAlphaByDistance =
        //     new Cesium.NearFarScalar(400.0, 0.8, 8000, 0.8);

    }

    /*
    const addWaterFace1 = () => {
        console.log('22222')
        // 创建多边形
        const polugon1 = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(dataJsonFog1)
            ),
            extrudedHeight: 0,
            height: 0,
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            closeBottom: true,
        })
        const polugon2 = viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(dataJsonFog1)
                ),
                height: 0.0,
                // extrudedHeight: -10000.0,
                material: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.2),
                clampToGround: true,
                classificationType: Cesium.ClassificationType.BOTH,
            },
        });
        const Water_Material = new Cesium.Material({
            fabric: {
                type: "Water",
                uniforms: {
                    normalMap: WaterFaceImage,
                    frequency: 1000.0,
                    specularIntensity: 10,  // 镜面反射强度
                    animationSpeed: 0.01,
                    amplitude: 10.0,
                    // baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.5),
                }
            }
        })

        const Water = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polugon1
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true,
                // material: Water_Material
            }),
            show: true
        })

        viewer.scene.primitives.add(Water)
    }
    */

    /**
     * 添加雨水效果 function
     */
    const addRainEffect = () => {
        // setTimeout(() => {
        //     viewer.scene.camera.setView({
        //         destination:  Cartesian3.fromDegrees(
        //             118.7060821, 20.9246509, 0
        //         ),
        //         orientation: {
        //             heading: 4.731089976107251,
        //             pitch: -0.32003481981370063,
        //         },
        //     });
        // }, 1000);
        viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: Cesium.Matrix4.fromTranslation(
                    Cartesian3.fromDegrees(
                        118.7060821, 20.9246509, 0
                    )
                ),
                speed: -1.0,
                lifetime: 15.0,
                emitter: new Cesium.SphereEmitter(rainRadius),
                startScale: 1.0,
                endScale: 0.0,
                image: smokeImg,
                emissionRate: 9000.0,
                startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
                endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
                imageSize: rainImageSize,
                updateCallback: rainUpdate,
            })
        );
        viewer.scene.skyAtmosphere.hueShift = -0.8;
        viewer.scene.skyAtmosphere.saturationShift = -0.7;
        viewer.scene.skyAtmosphere.brightnessShift = -0.33;
        viewer.scene.fog.density = 0.001;
        viewer.scene.fog.minimumBrightness = 0.8;
    }

    const rainUpdate = function (particle: any, dt: any) {
        rainGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            rainGravityScratch
        );
        rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
            rainGravityScratch,
            -1050.0,
            rainGravityScratch
        );

        particle.position = Cesium.Cartesian3.add(
            particle.position,
            rainGravityScratch,
            particle.position
        );

        const distance = Cesium.Cartesian3.distance(
            viewer.scene.camera.position,
            particle.position
        );
        if (distance > rainRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha =
                Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1);
        }
    };

    /**
     * 添加雾的效果
     */
    const addFogEffect = () => {
        console.log('执行了添加雾的效果,局部的1');
        // viewer.scene.fog.enable = true;
        // viewer.scene.fog.density = 0.0005;
        // viewer.scene.fog.minimumBrightness = 0.0;
        // viewer.scene.globe.showGroundAtmosphere = false;

        const fragmentShaderSource = `
          float getDistance(sampler2D depthTexture, vec2 texCoords) 
          { 
              float depth = czm_unpackDepth(texture(depthTexture, texCoords)); 
              if (depth == 0.0) { 
                  return czm_infinity; 
              } 
              vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); 
              return -eyeCoordinate.z / eyeCoordinate.w; 
          } 
          float interpolateByDistance(vec4 nearFarScalar, float distance) 
          { 
              float startDistance = nearFarScalar.x; 
              float startValue = nearFarScalar.y; 
              float endDistance = nearFarScalar.z; 
              float endValue = nearFarScalar.w; 
              float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
              return mix(startValue, endValue, t); 
          } 
          vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
          { 
              return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
          } 
          uniform sampler2D colorTexture; 
          uniform sampler2D depthTexture; 
          uniform vec4 fogByDistance; 
          uniform vec4 fogColor; 
          in vec2 v_textureCoordinates; 
          void main(void) 
          { 
              float distance = getDistance(depthTexture, v_textureCoordinates); 
              vec4 sceneColor = texture(colorTexture, v_textureCoordinates); 
              float blendAmount = interpolateByDistance(fogByDistance, distance); 
              vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); 
              out_FragColor = alphaBlend(finalFogColor, sceneColor); 
          }
      `;

        const postProcessStage = viewer.scene.postProcessStages.add(
            new Cesium.PostProcessStage({
                fragmentShader: fragmentShaderSource,
                uniforms: {
                    fogByDistance: new Cesium.Cartesian4(10, 0.0, 20000, 1.0),
                    fogColor: new Cesium.Color(0.27, 0.5, 0.7, 0.5),
                },
            })
        );
    };
    return (
        <>
        </>
    );
};
