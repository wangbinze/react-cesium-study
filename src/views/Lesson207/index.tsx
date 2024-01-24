import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import './index.css';


interface Window {
    Viewer?: Cesium.Viewer;
}

function Lesson207() {
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
            terrainProvider: Cesium.createWorldTerrain(),
            // terrain: Cesium.Terrain.fromWorldTerrain(),
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
        // 退出当前页面时，销毁，这个操作导致了viewer 异常了
        return () => {
            if (viewer) {
                viewer.destroy();
                viewer = null;
            }
        };

    }, []);
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

export default Lesson207;
