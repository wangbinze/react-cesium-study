import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import globalImagery from "../../assets/images/globe.jpg" // 全球地magery
function Lesson203() {
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
     * 设置地形相关的数据
     */
    const customWorldTerrain = () => {
        let worldTerrain = Cesium.createWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true
        })
        let createWorldTerrain = Cesium.createWorldTerrain()
        let ellipsoisProvider = new Cesium.EllipsoidTerrainProvider();
        let mtdt = new Cesium.WebMapTileServiceImageryProvider({
            url: 'http://t0.tianditu.com/vec_c/wmts',
            layer: 'vec',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'c',
            maximumLevel: 18,
            credit: new Cesium.Credit('天地图全球矢量地图服务'),
        })
        return mtdt;
    }
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        /**
         *
         */
        let mtdt = customWorldTerrain();

        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
            terrainProvider: new Cesium.EllipsoidTerrainProvider(),
            // 影像
            imageryProvider: mtdt,
            // 是否显示图层选择控件
            // baseLayerPicker: false
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        // setDataSource();
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

export default Lesson203;
