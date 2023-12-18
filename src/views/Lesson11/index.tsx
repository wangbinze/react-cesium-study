import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";


function Lesson11() {
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
    /**
     * 插值划线
     */
    const drawPolyline = () => {
        console.log('drawPolyline')
        if (!viewer) {
            return;
        }
        // 控制点
        const controls = [
            Cesium.Cartesian3.fromDegrees(110, 10),
            Cesium.Cartesian3.fromDegrees(111, 11),
            Cesium.Cartesian3.fromDegrees(112, 9),
            Cesium.Cartesian3.fromDegrees(114, 10),
            Cesium.Cartesian3.fromDegrees(113, 8)
        ];

        for (let i = 0; i < controls.length; i++) {
            viewer.entities.add({
                position: controls[i],
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 10
                }
            });
        }
        viewer.zoomTo(viewer.entities);

        // CatmullRomSpline
        let spline1 = new Cesium.CatmullRomSpline({
            points: controls,
            times: [0.0, 0.25, 0.5, 0.75, 1],
        });
        console.log(spline1, 'spline1');

        let positions1 = [];
        for (let i = 0; i <= 100; i++) {
            let cartesian3 = spline1.evaluate(i / 100);
            positions1.push(cartesian3);
            viewer.entities.add({
                position: cartesian3,
                point: {
                    color: Cesium.Color.BLUE,
                    pixelSize: 6
                }
            });
        }

        viewer.entities.add({
            name: 'CatmullRomSpline',
            polyline: {
                positions: positions1,
                width: 3,
                material: Cesium.Color.WHITE
            }
        });

        // HermiteSpline
        let spline2 = Cesium.HermiteSpline.createNaturalCubic({
            times: [0.0, 0.25, 0.5, 0.75, 1],
            points: controls
        });
        let positions2: Cesium.Cartesian3[] = [];
        for (let i = 0; i <= 1000; i++) {
            let cartesian3: number | Cesium.Cartesian3 = spline2.evaluate(i / 1000);
            if (typeof cartesian3 === "number") return;
            positions2.push(cartesian3);
            viewer.entities.add({
                position: cartesian3,
                point: {
                    color: Cesium.Color.WHITE,
                    pixelSize: 6
                }
            });
        }
        viewer.entities.add({
            name: 'HermiteSpline',
            polyline: {
                positions: positions2,
                width: 3,
                material: Cesium.Color.RED
            }
        });
        // LinearSpline
        let spline3 = new Cesium.LinearSpline({
            times: [0.0, 0.25, 0.5, 0.75, 1],
            points: controls
        });

        let positions3: Cesium.Cartesian3[] = [];
        for (let i = 0; i <= 100; i++) {
            let cartesian3: number | Cesium.Cartesian3 = spline3.evaluate(i / 100);
            if (typeof cartesian3 === "number") return;
            positions3.push(cartesian3);
            viewer.entities.add({
                position: cartesian3,
                point: {
                    color: Cesium.Color.YELLOW,
                    pixelSize: 6
                }
            });
        }

        viewer.entities.add({
            name: 'LinearSpline',
            polyline: {
                positions: positions3,
                width: 3,
                material: Cesium.Color.GREEN
            }
        });
    }

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        drawPolyline();
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

export default Lesson11;
