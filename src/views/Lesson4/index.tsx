import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Lesson4() {
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    const isConstant = false;
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
     * 坐标点数据，根据时间变化而变化
     * 参考：
     *  https://sandcastle.cesium.com/?src=HeadingPitchRoll.html&label=All
     *  https://sandcastle.cesium.com/?src=Callback%20Property.html&label=All
     *
     */
    /**
     * 方法1：使用CallbackProperty    new Cesium.CallbackProperty(callback, isConstant)
     *  - 回调函数，延迟计算
     *  - callback：计算属性时要调用的函数。
     *  - isConstant：true 当回调函数每次都返回相同的值时， false 如果该值会发生变化。
     *  -
     */
        // let options = Cesium.Cartesian3.fromDegreesArray([chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height, chinaPosition.longitude + 1, chinaPosition.latitude + 1, chinaPosition.height + 1])
    let endLongitude;
    const startTime = Cesium.JulianDate.now();
    const drawGraph = () => {
        console.log("drawGraph");
        const readLine = csmViewerRef.current?.entities.add({
            name: "readLine",
            polyline: {
                // 线的颜色
                material: Cesium.Color.YELLOW,
                // 线的宽度
                width: 10,
                // 线的类型
                // 参考：https://cesiumjs.org/Cesium/Build/Documentation/PolylineMaterialAppearance.html
                // 线的材质
                // 参考：https://cesiumjs.org/Cesium/Build/Documentation/PolylineDashMaterialProperty.html
                // 线的虚线
                positions: new Cesium.CallbackProperty(function (time: any, result) {
                    endLongitude =
                        chinaPosition.longitude +
                        0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
                    return Cesium.Cartesian3.fromDegreesArray(
                        [chinaPosition.longitude, chinaPosition.latitude, endLongitude, chinaPosition.latitude],
                        Cesium.Ellipsoid.WGS84,
                        result
                    );
                }, isConstant)
            }
        });
        // csmViewerRef.current?.zoomTo(readLine)
    }
    useEffect(() => {
        const timer = setInterval(() => {
            if (csmViewerRef.current) {
                drawGraph();
            }
        }, 10000);
        return () => {
            clearInterval(timer);
        }
    }, []);
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
            // drawGraph();
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