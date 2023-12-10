import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Lesson2() {
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    const viewerContainerRef = useRef(null);

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

    // 地图影像集合
    const imageryList = {
        // 天地图
        tdtImagery: new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=e378319b5250eff0fdd562f3aa190e62",
            layer: "img",
            style: "default",
            format: "tiles",
            tileMatrixSetID: "w",
            credit: new Cesium.Credit('天地图全球影像服务'),
            subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            maximumLevel: 18,
        }),
        // 高德影像
        gaodeImagery: new Cesium.UrlTemplateImageryProvider({
            url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        }),
        // ArcGIS
        esriImagery: new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        }),
    }
    useEffect(() => {
        if (viewerContainerRef.current && !csmViewerRef.current) {
            // Cesium 要求的Token  如果没有 则无法加载地球
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
            csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
                navigationHelpButton: false,
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
                infoBox: false,
                // 右上角按钮，用于选择场景模式（sceneMode），即选择是显示 3D 场景还是 2D 场景。（默认为true）
                // sceneModePicker: false,
                // 用于在地球上选择对象时显示选中的指示器。当用户在地球上点击或选择一个对象时，selectionIndicator 会在选择的位置显示一个指示器，以突显所选对象的位置。（默认为true）
                // selectionIndicator: false,
                // navigationInstructionsInitiallyVisible: false,
                // 设置初始场景模式，默认为3D，基本不需要修改
                // sceneMode: Cesium.SceneMode.SCENE3D,
                // 用于控制是否显示底图选择器。底图选择器允许用户切换底图图层，例如不同的地图服务或影像图层。（默认为true）
                // baseLayerPicker: false,
                // imageryProvider   地图影响
                // imageryProvider: imageryList.tdtImagery,

                // terrainProvider     地形
                terrainProvider: new Cesium.CesiumTerrainProvider({
                    url: Cesium.IonResource.fromAssetId(1),  //放入地形服务器的地址
                    requestVertexNormals: true,  //增加法线，提高光照效果
                    requestWaterMask: true   //增加水面特效
                }),
                // terrainProvider: Cesium.createWorldTerrain(),
            });
            /*
            * 关于地图和地形的修改
            */
            // 1、从右上角的地图选择中可以看出，Cesium内置了较多的地图，其中默认
            // 选择使用的是bing maps aerial
            // 2、在国内或者根本项目的不同，大多数情况下是需要进行地图的修改的，设置自己需要的默认地图
            // 3、在cesium中，地图的修改分为两种，一种是通过修改地图的资源，使用官方的资源，还有一种就是自定义地图
            // 4、修改地图的资源，需要通过Cesium.Ion.defaultAccessToken来设置token，然后通过Cesium.Ion.fromAssetId来加载地图资源
            // 5、
            /*const layer = csmViewerRef.current.imageryLayers.addImageryProvider(
                // 此id来自于 cesium ion  从 ion 获取的，单大部分项目基本不会使用这种方式，必须要使用外网
                // https://ion.cesium.com/assetdepot/354307     有很多cesium 官方所提供的数据
                new Cesium.IonImageryProvider({ assetId: 3812 })
            );*/


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
            style={{height: '100vh'}}
        ></div>
    )
}

export default Lesson2;