import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Lesson7() {
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

    /**
     * 绘制线
     */
    const drawLine = () => {
        // 贴地线
        const redLine = csmViewerRef.current?.entities.add({
            name: "Red line on terrain",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
                width: 5,
                material: Cesium.Color.RED,
                // 指定是否应将折线固定到地面。
                clampToGround: true,
            },
        });

        const greenRhumbLine = csmViewerRef.current?.entities.add({
            name: "Green rhumb line",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
                width: 5,
                arcType: Cesium.ArcType.RHUMB,
                material: Cesium.Color.GREEN,
            },
        });
        const glowingLine = csmViewerRef.current?.entities.add({
            name: "Glowing blue line on the surface",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
                width: 10,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    taperPower: 0.5,
                    color: Cesium.Color.CORNFLOWERBLUE,
                }),
            },
        });
        const orangeOutlined = csmViewerRef.current?.entities.add({
            name:
                "Orange line with black outline at height and following the surface",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    -75,
                    39,
                    250000,
                    -125,
                    39,
                    250000,
                ]),
                width: 5,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.ORANGE,
                    outlineWidth: 2,
                    outlineColor: Cesium.Color.BLACK,
                }),
            },
        });

        const purpleArrow = csmViewerRef.current?.entities.add({
            name: "Purple straight arrow at height",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    -75,
                    43,
                    500000,
                    -125,
                    43,
                    500000,
                ]),
                width: 10,
                arcType: Cesium.ArcType.NONE,
                material: new Cesium.PolylineArrowMaterialProperty(
                    Cesium.Color.PURPLE
                ),
            },
        });

        const dashedLine = csmViewerRef.current?.entities.add({
            name: "Blue dashed line",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    -75,
                    45,
                    500000,
                    -125,
                    45,
                    500000,
                ]),
                width: 4,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.CYAN,
                }),
            },
        });
    }
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });
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


    return (
        <div
            className="csm-viewer-container"
            id="csm-viewer-container"
            style={{height: '100vh'}}
        ></div>
    )
}

export default Lesson7;