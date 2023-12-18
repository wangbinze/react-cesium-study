import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";
// import * as CesiumHeatmap from '../../../public/static/CesiumHeatmap/CesiumHeatmap';
import {CesiumHeatmap, HeatmapPoint} from "cesium-heatmap-es6"
// import CesiumHeatmap from 'cesium-heatmap';

function Lesson9() {
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
     * 热力图
     */
    const thermalMap = () => {
        // const script = document.createElement('script');
        // script.src = '/static/CesiumHeatmap/CesiumHeatmap.js'; // 路径相对于 public 目录
        // document.body.appendChild(script);
        // script.onload = () => {
        //     // 初始化 CesiumHeatmap
        //     console.log(window.CesiumHeatmap);
        // };
        //设定热力图的四至范围
        let bounds = {
            west: 116.13833844,
            east: 116.13956899,
            south: 37.43582929,
            north: 37.43706916
        };
        // 设置一些随机的效果，这个可根据实际数据进行开发
        let data = [
            {

                "x": 116.1383442264,

                "y": 37.4360048372,

                "value": 76

            }, {

                "x": 116.1384363011,

                "y": 37.4360298848,

                "value": 63

            }, {

                "x": 116.138368102,

                "y": 37.4358360603,

                "value": 1

            }, {

                "x": 116.1385627739,

                "y": 37.4358799123,

                "value": 21

            }, {

                "x": 116.1385138501,

                "y": 37.4359327669,

                "value": 28

            }, {

                "x": 116.1385031219,

                "y": 37.4359730105,

                "value": 41

            }, {

                "x": 116.1384127393,

                "y": 37.435928255,

                "value": 75

            }, {

                "x": 116.1384551116,

                "y": 37.4359450132,

                "value": 3

            }, {

                "x": 116.1384927196,

                "y": 37.4359158649,

                "value": 45

            }, {

                "x": 116.1384938639,

                "y": 37.4358498311,

                "value": 45

            }, {

                "x": 116.1385183299,

                "y": 37.4360213794,

                "value": 93

            }, {

                "x": 116.1384007925,

                "y": 37.4359860133,

                "value": 46

            }, {

                "x": 116.1383604844,

                "y": 37.4358298672,

                "value": 54

            }, {

                "x": 116.13851025,

                "y": 37.4359098303,

                "value": 39

            }, {

                "x": 116.1383874733,

                "y": 37.4358511035,

                "value": 34

            }, {

                "x": 116.1384981796,

                "y": 37.4359355403,

                "value": 81

            }, {

                "x": 116.1384504107,

                "y": 37.4360332348,

                "value": 39

            }, {

                "x": 116.1385582664,

                "y": 37.4359788335,

                "value": 20

            }, {

                "x": 116.1383967364,

                "y": 37.4360581999,

                "value": 35

            }, {

                "x": 116.1383839615,

                "y": 37.436016316,

                "value": 47

            }, {

                "x": 116.1384082712,

                "y": 37.4358423338,

                "value": 36

            }, {

                "x": 116.1385092651,

                "y": 37.4358577623,

                "value": 69

            }, {

                "x": 116.138360356,

                "y": 37.436046789,

                "value": 90

            }, {

                "x": 116.138471893,

                "y": 37.4359184292,

                "value": 88

            }, {

                "x": 116.1385605689,

                "y": 37.4360271359,

                "value": 81

            }, {

                "x": 116.1383585714,

                "y": 37.4359362476,

                "value": 32

            }, {

                "x": 116.1384939114,

                "y": 37.4358844253,

                "value": 67

            }, {

                "x": 116.138466724,

                "y": 37.436019121,

                "value": 17

            }, {

                "x": 116.1385504355,

                "y": 37.4360614056,

                "value": 49

            }, {

                "x": 116.1383883832,

                "y": 37.4358733544,

                "value": 82

            }, {

                "x": 116.1385670669,

                "y": 37.4359650236,

                "value": 25

            }, {

                "x": 116.1383416534,

                "y": 37.4359310876,

                "value": 82

            }, {

                "x": 116.138525285,

                "y": 37.4359394661,

                "value": 66

            }, {

                "x": 116.1385487719,

                "y": 37.4360137656,

                "value": 73

            }, {

                "x": 116.1385496029,

                "y": 37.4359187277,

                "value": 73

            }, {

                "x": 116.1383989222,

                "y": 37.4358556562,

                "value": 61

            }, {

                "x": 116.1385499424,

                "y": 37.4359149305,

                "value": 67

            }, {

                "x": 116.138404523,

                "y": 37.4359563326,

                "value": 90

            }, {

                "x": 116.1383883675,

                "y": 37.4359794855,

                "value": 78

            }, {

                "x": 116.1383967187,

                "y": 37.435891185,

                "value": 15

            }, {

                "x": 116.1384610005,

                "y": 37.4359044797,

                "value": 15

            }, {

                "x": 116.1384688489,

                "y": 37.4360396127,

                "value": 91

            }, {

                "x": 116.1384431875,

                "y": 37.4360684409,

                "value": 8

            }, {

                "x": 116.1385411067,

                "y": 37.4360645847,

                "value": 42

            }, {

                "x": 116.1385237178,

                "y": 37.4358843181,

                "value": 31

            }, {

                "x": 116.1384406464,

                "y": 37.4360003831,

                "value": 51

            }, {

                "x": 116.1384679169,

                "y": 37.4359950456,

                "value": 96

            }, {

                "x": 116.1384194314,

                "y": 37.4358419739,

                "value": 22

            }, {

                "x": 116.1385049792,

                "y": 37.4359574813,

                "value": 44

            }, {

                "x": 116.1384097378,

                "y": 37.4358598672,

                "value": 82

            }, {

                "x": 116.1384993219,

                "y": 37.4360352975,

                "value": 84

            }, {

                "x": 116.1383640499,

                "y": 37.4359839518,

                "value": 81

            }];
        //设置最大最小值
        let valueMin = 0;
        let valueMax = 100;
        //创建热力图
        if (!csmViewerRef.current) return;
        const earthHeatMap = new CesiumHeatmap(csmViewerRef.current, {
            zoomToLayer: true,
            points: data,
            heatmapDataOptions: {max: valueMax, min: valueMin},
            heatmapOptions: {
                maxOpacity: 1,
                minOpacity: 0
            }
        })
    }

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        defaultCameraPosition();
        thermalMap();
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

export default Lesson9;
