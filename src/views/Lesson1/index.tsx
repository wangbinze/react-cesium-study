import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";
function Page1() {
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    const viewerContainerRef = useRef(null);

    // 中国的坐标
    const chinaPosition = {
        longitude: 116.395645038,
        latitude: 39.9299857781,
        height: 7000000,
    };
    // 指定相机默认位置
    const defaultCameraPosition = () =>{
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
    useEffect(() => {
        if (viewerContainerRef.current && !csmViewerRef.current) {
            // Cesium 要求的Token  如果没有 则无法加载地球
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
            csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
                navigationHelpButton:false,
                // 以下为常用配置

                // 底部时间轴（默认为true）
                // timeline: false,
                // 动画小部件（左下角时间动画小组件）（默认为true）
                // animation: false,
                // 右下角全屏按钮（默认为true）
                // fullscreenButton: false,
                // 右上角搜索按钮（默认为true）
                // geocoder: false,
                // 右上角主页按钮（默认为true）
                // homeButton: false,
                // 用于显示地理位置和实体信息的弹出式信息框组件。它通常用于显示与地图上选定的实体或位置相关的详细信息（默认为true）
                // infoBox: false,
                // 右上角按钮，用于选择场景模式（sceneMode），即选择是显示 3D 场景还是 2D 场景。（默认为true）
                // sceneModePicker: false,
                // 用于在地球上选择对象时显示选中的指示器。当用户在地球上点击或选择一个对象时，selectionIndicator 会在选择的位置显示一个指示器，以突显所选对象的位置。（默认为true）
                // selectionIndicator: false,
                // navigationInstructionsInitiallyVisible: false,
                // 设置初始场景模式，默认为3D，基本不需要修改
                // sceneMode: Cesium.SceneMode.SCENE3D,
                // 用于控制是否显示底图选择器。底图选择器允许用户切换底图图层，例如不同的地图服务或影像图层。（默认为true）
                // baseLayerPicker: false,
            });
            defaultCameraPosition();
        }

        // 退出当前页面时，销毁
        return () => {
            if (csmViewerRef.current) {
                csmViewerRef.current.destroy();
                csmViewerRef.current = null;
            }
        };
    }, [viewerContainerRef]);


    return (
        <div
            className="csm-viewer-container"
            id="csm-viewer-container"
            ref={viewerContainerRef}
            style={{ height: '100vh' }}
        ></div>
    )
}

export default Page1;