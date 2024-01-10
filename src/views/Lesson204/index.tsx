import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";

// import '../../../public/static/CesiumEcharts/EchartsLayer_1.js';
function Lesson204() {
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
     * 鼠标事件
     */
    const myMouseEvent = () => {
        if (!viewer) {
            return;
        }
        // 处理用户输入事件。可以添加自定义函数，以便在用户输入输入时执行。
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        let ellipsoid = viewer.scene.globe.ellipsoid; //得到当前三维场景的椭球体

        let longitudeString: string | number | null = null;
        let latitudeString: string | number | null = null;
        let height: string | number | null = null;
        let cartesian = null;
        let mouse_state = document.getElementById("mouse_state");//显示状态信息

        // 设置要对输入事件执行的函数。

        // 1、MOUSE_MOVE
        handler.setInputAction(function (movement: any) {
            // 通过指定的椭球体或者地图对应的坐标系，将鼠标的二维坐标转换为对应的椭球三维坐标
            cartesian = viewer?.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian && viewer) {
                // 将笛卡尔坐标系转为地理坐标
                let cartographic = ellipsoid.cartesianToCartographic(cartesian);
                console.log(cartographic, 'cartographic')
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);
                //获取相机高度
                // height = Math.ceil(viewer.camera.positionCartographic.height).toFixed(3);
                // 获取海拔
                Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [Cesium.Cartographic.fromDegrees(Number(longitudeString), Number(latitudeString))])
                    .then(function (updatedPositions) {
                        height = updatedPositions[0].height.toFixed(3);
                        // console.log("海拔高度: " + height + " 米");
                        if (mouse_state) {
                            mouse_state.innerText = '移动：(' + longitudeString + ', ' + latitudeString + "," + "海拔高度: " + height + " 米" + ')';
                        }
                    });

            } else {
                if (mouse_state) {
                    mouse_state.innerText = "";
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 2、LEFT_CLICK
        handler.setInputAction(function (movement: any) {
            cartesian = viewer?.camera.pickEllipsoid(movement.position, ellipsoid);//movement.endPosition
            if (cartesian && viewer) {
                //将笛卡尔坐标转换为地理坐标
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);
                if (mouse_state) {
                    mouse_state.innerText = 'LEFT_CLICK：(' + longitudeString + ', ' + latitudeString + "," + height + ')';
                }
            } else {
                if (mouse_state) {
                    mouse_state.innerText = "";
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // 3、LEFT_DOUBLE_CLICK
        handler.setInputAction(function (movement: any) {
            console.log(106, movement)
            cartesian = viewer?.camera.pickEllipsoid(movement.position, ellipsoid);//movement.endPosition
            if (cartesian && viewer) {
                //将笛卡尔坐标转换为地理坐标
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(3);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(3);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);
                if (mouse_state) {
                    mouse_state.innerText = 'LEFT_DOUBLE_CLICK：(' + longitudeString + ', ' + latitudeString + "," + height + ')';
                }
            } else {
                if (mouse_state) {
                    mouse_state.innerText = "";
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // 4、LEFT_DOWN
        // 5、LEFT_UP
        // 6、鼠标WHEEL
    }

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
        console.log(viewer)
        defaultCameraPosition();
        // 鼠标事件  相关的
        myMouseEvent();
        // 退出当前页面时，销毁
        return () => {
            if (csmViewerRef.current) {
                csmViewerRef.current.destroy();
                csmViewerRef.current = null;
            }
        };
    }, [csmViewerRef]);

    return (
        <div>
            <div
                className="csm-viewer-container"
                id="csm-viewer-container"
                style={{height: '100vh'}}
            >
            </div>
            <div id="mouse_state"
                 style={{
                     position: 'absolute',
                     left: 0,
                     top: 0,
                     width: '300px',
                     height: '100px',
                     zIndex: 1000,
                     color: 'red'
                 }}></div>
        </div>

    )
}

export default Lesson204;
