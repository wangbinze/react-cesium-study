import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Lesson4() {
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);

    // 中国的坐标
    const chinaPosition = {
        longitude: 116.395645038,
        latitude: 39.9299857781,
        height: 7000000,
    };
    // 指定相机默认位置
    const defaultCameraPosition = () => {
        // 此处的 csmViewerRef.current  就是viewer
        // console.log(csmViewerRef.current?.camera);
        csmViewerRef.current?.camera.flyTo({
            // 飞行目的地
            destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
            // 飞行持续时间，可选
            duration: 2.
            // 还有其他很多参数，都是可选的，参考文档
        });
    }

    /**
     * 绘制线，随着时间变化
     */
    const drawGraph = () => {
        console.log("drawGraph");
    }

    useEffect(() => {
        if (!csmViewerRef.current) {

            // Cesium 要求的Token  如果没有 则无法加载地球
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
            csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
                // 用于显示地理位置和实体信息的弹出式信息框组件。它通常用于显示与地图上选定的实体或位置相关的详细信息（默认为true）
                infoBox: false,
                //  地形
                terrainProvider: Cesium.createWorldTerrain(),
            });

            defaultCameraPosition();
            drawGraph();
        }

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
        ></div>
    )
}

export default Lesson4;