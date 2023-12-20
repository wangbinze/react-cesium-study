import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";


function Lesson13() {
    let viewer: Cesium.Viewer | null = null;
    // 粒子相关信息
    const [viewModel, setViewModel] = useState({
        emissionRate: 5.0,
        gravity: 0.0,
        minimumParticleLife: 1.2,
        maximumParticleLife: 1.2,
        minimumSpeed: 1.0,
        maximumSpeed: 4.0,
        startScale: 1.0,
        endScale: 5.0,
        particleSize: 25.0,
    });
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
     * 粒子系统
     * new Cesium.ParticleSystem(options)
     */
    const drawParticle = () => {
        console.log('drawParticle')
        if (!viewer) {
            return;
        }
        // 先添加一个汽车模型
        const entityCar = viewer?.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.15787310614596,
                39.97862668312678),
            model: {
                uri: '/models/CesiumMilkTruck.glb',
                minimumPixelSize: 128,
                maximumScale: 2000,
            },
        });
        viewer.flyTo(entityCar);

        const particleSystem = viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                image: '/static/image/smoke.png',
                startColor: new Cesium.Color(0.0, 0.0, 1.0, 0.7),
                endColor: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
                startScale: viewModel.startScale,
                // emitterModelMatrix: computeEmitterModelMatrix()
            })
        )
    }
    const computeEmitterModelMatrix = () => {

        // return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
    }

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        drawParticle();
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

export default Lesson13;
