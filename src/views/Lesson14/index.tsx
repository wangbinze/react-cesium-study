import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";

function Lesson14() {
    let viewer: Cesium.Viewer | null = null;
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    // 中国的坐标
    const chinaPosition = {
        longitude: 116.395645038,
        latitude: 39.9299857781,
        height: 7000000,
    };
    const defaultCameraPosition = () => {
        csmViewerRef.current?.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
            duration: 2.
        });
    }

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            terrainProvider: Cesium.createWorldTerrain(),
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        drawLine();
        // 退出当前页面时，销毁
        return () => {
            if (csmViewerRef.current) {
                csmViewerRef.current.destroy();
                csmViewerRef.current = null;
            }
        };
    }, [csmViewerRef]);
    /**
     * 江苏到重庆的实体线
     * 重庆:106.504962,29.533155
     * 江苏:118.767413,32.041544
     */
    const drawLine = () => {
        if (!viewer) return;
        const cqToJsline = viewer.entities.add({
            name: "重庆到江苏",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                    106.504962, 29.533155,
                    118.767413, 32.041544
                ]),
                width: 10,
                clampToGround: true,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 99999999999999),
                /**
                 * 主要进行自定义材质的设置
                 * Entity 的xxxGraphics的material属性为 MaterialProperty 或 Color类型
                 * Primitive 的appearance（或继承类）的material属性为 Material类型
                 *
                 * https://github.com/CesiumGS/cesium/wiki/Fabric
                 */
                material: Cesium.Color.YELLOW.withAlpha(0.5),
            }
        })
        /*polyline.material = new Cesium.Material({
            fabric : {
                type : 'Color',
                uniforms : {
                    color : new Cesium.Color(1.0, 0.0, 0.0, 0.5)
                }
            }
        });*/

    }
    return (
        <div
            className="csm-viewer-container"
            id="csm-viewer-container"
            style={{height: '100vh'}}
        ></div>
    )
}

export default Lesson14;
