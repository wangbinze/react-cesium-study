import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import './index.css';
import {Cartographic, sampleTerrain as cesiumSampleTerrain} from "cesium";
import WaterFaceImage from '../../assets/images/waterNormals.jpg';

interface Window {
    Viewer?: Cesium.Viewer;
}

function Lesson208() {
    let viewer: Cesium.Viewer | null = null;
    // 中国的坐标
    const chinaPosition = {
        longitude: 116.395645038,
        latitude: 39.9299857781,
        height: 7000000,
    };


    const defaultCameraPosition = () => {
        if (!viewer) {
            return;
        }
        // 直接设置视角位置
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
            orientation: {
                // heading: Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
                // pitch: Cesium.Math.toRadians(45.0),    // default value (looking down)
                // roll: 0.0                             // default value
            }
        });
        // 禁用地下模式
        // viewer.scene.underground = false;
        // 禁用碰撞检测
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
    }
    /**
     *
     */

    useEffect( () => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        viewer = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider:  Cesium.Terrain.fromWorldTerrain(),
            // terrain: Cesium.Terrain.fromWorldTerrain(), // 地形数据
            terrainProvider: Cesium.createWorldTerrain(),
            // terrainProvider: new Cesium.EllipsoidTerrainProvider(),
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
        });
        defaultCameraPosition();
        // topographicExcavation(viewer)
        drawWater(viewer)
        // drawWater2(viewer)
        // 退出当前页面时，销毁，这个操作导致了viewer 异常了
        return () => {
            if (viewer) {
                viewer.destroy();
                viewer = null;
            }
        };

    }, []);
    const topographicExcavation = (viewer: any) => {
        const globe = viewer?.scene.globe;
        console.log('topographicExcavation');
        const data = [
            // 115.0807721,25.6962075,123.50411925319528,
            // 115.0769243,25.5853114,391.4619431829342,
            // 115.0158997,25.5671937,145.2873444756412,
            // 115.0519922,25.6965834,153.51679073673898
            116.416497, 30.934256, 775.89,
            116.427392, 30.962941, 1084.88,
            116.434838, 30.932608, 900.43,
            116.462994, 30.923081, 771.42,
            116.437571, 30.916044, 906.39,
            116.44977, 30.894487, 776.06,
            116.424183, 30.908752, 727.02,
            116.402218, 30.898406, 593.08,
            116.414309, 30.918806, 588.78,
            116.387022, 30.933539, 700.65
        ]
        const points1 = [];

        // const points = []
        for (let i = 0; i < data.length; i += 3) {
            const longitude = data[i];
            const latitude = data[i + 1];
            const height = data[i + 2]; // 如果高度不存在，则默认为0

            const cartesianPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            points1.push(cartesianPosition);
        }
        // console.log(points1, 'points1--');
        // const availability = viewer.terrainProvider.availability;
        // const samplePositions = [Cartographic.fromDegrees(115.0807721, 25.6962075,)];
        // const level = availability.computeMaximumLevelAtPosition(samplePositions[0]);
        // const result = cesiumSampleTerrain(viewer.terrainProvider, level, samplePositions);
        // console.log(result, 'result');
        // // 使用 sampleTerrain 函数查询地形高度
        // Cesium.sampleTerrain(viewer.terrainProvider, 11, [Cesium.Cartographic.fromDegrees(115.0519922, 25.6965834)])
        //     .then(function (updatedPositions) {
        //         const height = updatedPositions[0].height;
        //         console.log('地形高度:', height);
        //     })
        //     .catch(function (error) {
        //         console.error('查询地形高度时发生错误:', error);
        //     });
        // viewer?.camera.flyTo({
        //     // destination 有两种方式进行位置的确定，不过我们比较常用的是笛卡尔3坐标
        //     // destination : Cesium.Rectangle.fromDegrees(west, south, east, north),
        //     destination: Cesium.Cartesian3.fromDegrees(
        //         116.416497, 30.934256, 775.89
        //     ),
        // });
        // 将经纬度数组转换为Cartesian3数组
        const points = [
            new Cesium.Cartesian3(-1715292.6999753984, 4993153.157628936, 3566663.752912529),
            new Cesium.Cartesian3(-1715285.8150713604, 4993167.072601330, 3566647.6921528564),
            // new Cesium.Cartesian3(-1715286.5985765400, 4993181.309761941, 3566627.519787549),
            new Cesium.Cartesian3(-1715299.0249209427, 4993191.177501195, 3566607.861264360),
            new Cesium.Cartesian3(-1715349.5762367432, 4993176.675656664, 3566603.878289345),
            new Cesium.Cartesian3(-1715375.5538853381, 4993159.990032478, 3566614.671147202),
            new Cesium.Cartesian3(-1715370.1945772346, 4993141.041835706, 3566643.580587877),
            new Cesium.Cartesian3(-1715359.7019716015, 4993131.063945592, 3566662.468046927),
            new Cesium.Cartesian3(-1715321.9141253997, 4993137.762602262, 3566671.205164391)
        ];
        console.log(points, 'points');
        // 生成平面
        const pointsLength = points1.length;
        const clippingPlanes = [];
        for (let i = 0; i < pointsLength; ++i) {
            const nextIndex = (i + 1) % pointsLength;
            let midpoint = Cesium.Cartesian3.add(
                points1[i],
                points1[nextIndex],
                new Cesium.Cartesian3()
            );
            midpoint = Cesium.Cartesian3.multiplyByScalar(
                midpoint,
                0.5,
                midpoint
            );

            const up = Cesium.Cartesian3.normalize(
                midpoint,
                new Cesium.Cartesian3()
            );
            let right = Cesium.Cartesian3.subtract(
                points1[nextIndex],
                midpoint,
                new Cesium.Cartesian3()
            );
            right = Cesium.Cartesian3.normalize(right, right);

            let normal = Cesium.Cartesian3.cross(
                right,
                up,
                new Cesium.Cartesian3()
            );
            normal = Cesium.Cartesian3.normalize(normal, normal);

            // Compute distance by pretending the plane is at the origin
            const originCenteredPlane = new Cesium.Plane(normal, 0.0);
            const distance = Cesium.Plane.getPointDistance(
                originCenteredPlane,
                midpoint
            );

            clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
        }
        globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 10.0,
            edgeColor: Cesium.Color.WHITE,
            enabled: true,
        });
        globe.backFaceCulling = true;
        globe.showSkirts = true;
    }

    const drawWater = (viewer: any) => {
        const dataJson5 = [
            110.7172652174168, 21.24550029799148,
            110.6552237616494, 20.9124422233336,
            110.6387190830724, 20.84369677545872,
            110.512086111178, 20.86794052284,
            110.4495218470698, 20.81689760828859,
            110.4641796824779, 20.75651171924614, 110.5026962525778,
            20.63275336867186, 110.5502628123184, 20.49737398110115,
            110.5206433924831, 20.35427287093482, 110.442513167023,
            20.24617444500447, 110.4350613388615, 20.15642420472142,
            110.4664383333915, 20.12398875327125, 110.6178489455185,
            20.15923305452574, 110.7391013484406, 20.20842862611186,
            110.7400816370037, 20.13094107041199, 110.8144245581643,
            20.04338276333401, 110.9130471257874, 20.03832954466434,
            111.0460872442236, 19.99090426239735, 111.0330859407705, 19.794451361955,
            111.0791974011426, 19.6010367624328, 110.9446536957005,
            19.48920533411561, 110.8855228952326, 19.43127554199984,
            110.8021366256702, 19.29321410067346, 110.7317438104836,
            19.15453867087677, 110.6660002143143, 19.04666067564288,
            110.6144051156303, 18.88462656963907, 110.1757985585796,
            18.32771767625299, 109.6895032525586, 18.04596280474967,
            108.9234400121051, 18.1750880674673, 108.5705788080848,
            18.52543215334329, 108.5487355588797, 19.11455774384939,
            109.3407469189648, 20.05969771959047, 110.0499535790507,
            20.09437038577707, 109.6697973570326, 20.62260088480988,
            109.7121892073225, 21.27557331818143, 108.9698758323984,
            21.44657676389689, 107.9402938244351, 21.23581939570613,
            107.0213106578835, 20.50533179093041, 106.2709399690526,
            19.71187047419853, 105.947658576001, 18.90473316567473,
            106.8790063311428, 17.53411561581692, 107.9278413883173,
            16.72889606331464, 109.3741605332586, 14.45131110520155,
            109.4483951931221, 11.91721332792438, 105.6998058486601,
            8.652056135300963, 106.6369707330367, 4.742768858880013,
            108.7337615346742, 1.111382732121251, 109.4059381169592,
            2.205907349022499, 110.8097224958609, 1.691143883258416,
            111.0907265409561, 2.144901105363279, 111.1697364503964,
            2.875174472573347, 112.5684700088194, 3.195531935791278,
            113.2207898616273, 3.847585535314201, 113.680276824181,
            4.438365367182475, 115.2545583492935, 5.499874400053415,
            116.0526113227968, 6.243503520209835, 116.6706154755357,
            7.223564517947985, 116.7187069665926, 7.637050311308563,
            117.3562258876635, 8.95409010749783, 118.5813452587068,
            10.24461413748934, 120.3198201826728, 12.53994061158468,
            120.2694328236141, 13.62791385457383, 119.5590063217547,
            15.72499522276298, 120.1803287875175, 17.31149330461274,
            120.3831263509657, 18.59457098839602, 121.3814702960342,
            18.71883187452283, 122.983627211994, 18.44213548350287,
            122.5116263564539, 16.42088201080955, 127.5690012244449,
            18.94809337441878, 127.2864044881284, 26.11377250594184,
            129.4980057292055, 29.14272715887351, 130.1285442123733,
            31.0572893106278, 129.8562987227416, 32.19505710558644,
            129.2874380978333, 32.91533598797872, 128.7688574198611,
            32.42886593928516, 128.5057972234554, 32.60365771276466,
            128.9177640043845, 33.08445320181205, 129.1311640366051,
            33.79909653914542, 129.0641675411192, 34.14628832968512,
            126.9345412020097, 33.3547249767021, 126.4410984089068,
            33.12690993492499, 126.1186382033041, 33.2432236535327,
            126.1260744551443, 33.33097037060102, 126.1729972378292,
            33.39485673560299, 126.3727878678109, 33.51676642247667,
            126.7447631890878, 33.57987168455143, 127.0039907349397,
            33.51521282504016, 126.9345123654386, 33.35497737060471,
            127.0042097810584, 33.51536624109879, 126.9345432575616,
            33.35489831422225, 129.0563146369913, 34.14192298303561,
            128.3604021637855, 34.5020163693404, 126.3794059746007, 33.9538293900145,
            125.649345005044, 34.72299679051083, 126.3534831426781,
            35.43557412823808, 126.4380404194776, 36.10398666403377,
            126.1065663960256, 36.79264873925298, 125.6375637606045,
            37.58608542323266, 124.6551387969174, 37.70582659072332,
            124.8918397654559, 38.67532632816649, 125.0222067705555,
            39.26296394546826, 124.5449446837465, 39.55740255946583,
            123.8183145511701, 39.64317876238317, 123.1230528831873,
            39.50774419824549, 120.9830266372475, 38.63726084406844,
            121.3893784192545, 39.76588635835908, 121.9555686933531,
            40.39878863262246, 121.432884169857, 40.72332361066729,
            121.0253031320063, 40.53644055279649, 119.9929341437114,
            39.93240196835358, 119.4222021124818, 39.63096299375724,
            119.3826719344683, 39.32010578632391, 118.7410314782671,
            38.96656597367924, 117.8369095306357, 38.7692707382452,
            118.3876232460048, 38.25378753705839, 119.1025346750316,
            38.07765261197544, 119.5519290191693, 37.25812380051543,
            120.2559265223781, 37.82841913132298, 121.0626808527236,
            37.8878059236469, 121.7493505796411, 37.59436678678578,
            122.7676670484322, 37.55233717902067, 122.7144469399368,
            36.82303580592454, 121.7517642953527, 36.67629307804528,
            120.5804872017132, 35.91511023901059, 119.5192834012738,
            34.99240408195224, 120.753350096515, 33.62422487013446,
            122.7578485922797, 30.93514605680612, 122.091931215354,
            28.87901430423079, 122.5399480098992, 28.70849546074082,
            122.0787054244661, 25.13354217836228, 121.8749160211661,
            24.83627440631575, 121.901416374195, 24.61860864233116,
            121.7077743045747, 24.12993572560243, 121.6042255402984,
            23.82977388869771, 121.5621356201696, 23.54337775771082,
            121.3552241108776, 22.99379067351368, 121.0127620285543,
            22.53758619923361, 120.9314912788777, 22.30652304766835,
            120.8710060345781, 21.86183117541105, 120.7005854228683,
            21.90165758313406, 120.6583228064667, 22.00726015589642,
            120.6816243764179, 22.11624826571018, 120.6268546053654,
            22.28459167029778, 120.2761959161922, 22.53006337473405,
            120.1933922469295, 22.78349507327082, 120.1142191191093,
            22.93993808791792, 120.0303659583144, 23.05844894497249,
            120.1454646112977, 23.80533771685406, 121.0616173917317,
            25.12603860251518, 121.3092969277009, 25.17544261256877,
            121.5268827247626, 25.31028778735333, 122.080136285778,
            25.13208978017574, 122.5399341272472, 28.70849443293068,
            122.0919312830857, 28.87901476286116, 121.7510756933617,
            28.16077463943791, 120.9938616770084, 27.49083826121396,
            120.180288767839, 26.40142577710374, 120.0823070536024,
            25.48478230691195, 118.9467454708497, 24.61432371276663,
            117.6128022756437, 23.68653007823287, 116.1399547121381,
            22.73025166035091, 114.79453412012, 22.3134580237432,
            112.6505648234173, 21.49158355898957, 110.7172652174168,
            21.24550029799148,
        ];
        console.log(dataJson5.length)
        viewer.scene.globe.terrainExaggeration = 8.0;

        // 流动水面效果
        // viewer.scene.primitives.add(
        //     new Cesium.Primitive({
        //         geometryInstances: new Cesium.GeometryInstance({
        //             // geometry: new Cesium.RectangleGeometry({
        //             //     rectangle: Cesium.Rectangle.fromDegrees(
        //             //         113.95, 22.48,
        //             //         113.99, 22.52
        //             //     ),
        //             //     vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        //             // }),
        //             geometry: new Cesium.PolygonGeometry({
        //                 polygonHierarchy: new Cesium.PolygonHierarchy(
        //                     Cesium.Cartesian3.fromDegreesArray(dataJson5)
        //                 ),
        //                 vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        //                 height: 0,  // 设置底部高度
        //                 extrudedHeight: 100  // 设置顶部高度
        //             }),
        //         }),
        //         appearance: new Cesium.EllipsoidSurfaceAppearance({
        //             material: new Cesium.Material({
        //                 fabric: {
        //                     type: "Water",
        //                     uniforms: {
        //                         baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.5),
        //                         normalMap: WaterFaceImage,
        //                         frequency: 1000.0,
        //                         animationSpeed: 0.1,
        //                         amplitude: 10,
        //                         specularIntensity: 10
        //                     }
        //                 }
        //             })
        //         }),
        //     })
        // );
        // viewer?.camera.flyTo({
        //     // destination 有两种方式进行位置的确定，不过我们比较常用的是笛卡尔3坐标
        //     // destination : Cesium.Rectangle.fromDegrees(west, south, east, north),
        //     destination: Cesium.Cartesian3.fromDegrees(
        //         113.95, 22.48,10000
        //     ),
        // });

        // viewer.scene.primitives.add(
        //     new Cesium.Primitive({
        //         geometryInstances: new Cesium.GeometryInstance({
        //             geometry: new Cesium.PolygonGeometry({
        //                 polygonHierarchy: new Cesium.PolygonHierarchy(
        //                     Cesium.Cartesian3.fromDegreesArray(dataJson5)
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
        //                         baseWaterColor: new Cesium.Color(64 / 255.0, 157 / 255.0, 253 / 255.0, 0.1),
        //                         // baseWaterColor: new Cesium.Color(0, 139, 139, 0.1),  // 水的基本颜色
        //                         normalMap: WaterFaceImage,  // 法线贴图，用于模拟水面波纹效果
        //                         frequency: 1000.0,  // 水波纹的频率
        //                         animationSpeed: 0.01,  // 水的流动动画速度
        //                         amplitude: 10,  // 波纹振幅
        //                         specularIntensity: 10  // 镜面反射强度
        //                     }
        //                 }
        //             })
        //         }),
        //     })
        // );
        // // 启用或禁用地下模式
        // viewer.scene.underground = true;
        // // 设置地球透明
        // viewer.scene.globe.translucency.enabled = false;
        // // 地形放大（夸张）
        // viewer.scene.globe.terrainExaggeration = 8.0;
        // viewer.scene.globe.translucency.frontFaceAlphaByDistance =
        //     new Cesium.NearFarScalar(400.0, 0.3, 8000, 0.3);
    }

    const drawWater2 = (viewer: any) => {
        // 创建水体的几何体
        const rectangle = Cesium.Rectangle.fromDegrees(0, 0, 10, 10);
        const height = 11000; // 设置水体的高度

// 创建水体的外观
        const primitive = new Cesium.GroundPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.RectangleGeometry({
                    rectangle: rectangle,
                    height: height,
                    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                }),
                id: 'waterBody', // 设置水体的ID
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true, // 设置为true，使水体不贴地
                material: new Cesium.Material({
                    fabric: {
                        type: 'Water',
                        uniforms: {
                            normalMap: 'path/to/normalMap.jpg', // 设置水体的法线贴图
                        },
                    },
                }),
            }),
        });

// 将水体添加到场景中
        viewer.scene.primitives.add(primitive);
    }
    return (
        <div>
            <div
                id="csm-viewer-container"
                style={{height: '100vh'}}
            >
            </div>
        </div>
    )
}

export default Lesson208;
