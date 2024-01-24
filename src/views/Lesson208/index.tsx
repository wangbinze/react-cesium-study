import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import './index.css';
import {Cartographic, sampleTerrain as cesiumSampleTerrain} from "cesium";


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

    }
    /**
     *
     */

    useEffect(() => {
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
            projectionPicker: false, // * 透视投影和正投影之间切换
            requestRenderMode: true, // * 在指定情况下进行渲染,提高性能
        });
        defaultCameraPosition();
        topographicExcavation(viewer)
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
