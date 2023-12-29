import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";

function Lesson205() {
    let viewer: Cesium.Viewer | null = null;
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
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
        // 飞行过去的位置
        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
        //     duration: 2.
        // });
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
        /**
         *
         */

        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            terrainProvider: Cesium.createWorldTerrain(),
            // terrainProvider: new Cesium.EllipsoidTerrainProvider(),
            // 是否显示图层选择控件
            // baseLayerPicker: false
            contextOptions: {
                webgl: {
                    alpha: true
                }
            },
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        // 退出当前页面时，销毁
        return () => {
            if (csmViewerRef.current) {
                csmViewerRef.current.destroy();
                csmViewerRef.current = null;
            }
        };
    }, [csmViewerRef]);

    return (
        <div
            className="csm-viewer-container"
            id="csm-viewer-container"
            style={{height: '100vh'}}
        >
        </div>
    )
}

export default Lesson205;
