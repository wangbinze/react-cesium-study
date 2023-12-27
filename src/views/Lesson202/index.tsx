import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import globalImagery from "../../assets/images/globe.jpg" // 全球地magery
function Lesson202() {
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
     * 使用自定义数据源(地图)
     *
     * 实例如下,可能无法加载,数据源问题或者token问题
     */
    const setDataSource = () => {
        console.log(25)
        if (!viewer) return;
        // ArcGisMapServerImageryProvider
        let esriMap = new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            enablePickFeatures: false
        });
        let osmMap = new Cesium.UrlTemplateImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        });
        //MapboxImageryProvider  提供了mapbox.satellite、mapbox.streets、mapbox.streets-basic 三种风格 basic不行
        /*let mboxMap = new Cesium.MapboxImageryProvider({
            mapId: 'mapbox.satellite',
        });*/

        //WebMapTileServiceImageryProvider--天地图
        let tdtMap = new Cesium.WebMapTileServiceImageryProvider({
            url: 'http://t0.tianditu.com/img_w/wmts?',
            layer: 'img',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'w',
            credit: new Cesium.Credit('天地图全球影像服务'),
            maximumLevel: 18
        });
        //天地图注记
        let tdtVectormap = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
            layer: "tiandituImgMarker",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "tiandituImgMarker",
            maximumLevel: 18 //不能超过18
        });

        //全球1 2级
        let globeLocalmap = new Cesium.UrlTemplateImageryProvider({
            url: './sampledata/imagery/globe/tiles' //
        });

        //--------------------------------设置ProviderViewModel-----------------------
        let providerViewModels = [];
        let esriMapModel = new Cesium.ProviderViewModel({
            name: 'esri Maps',
            iconUrl: Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/esriWorldImagery.png'),
            tooltip: 'ArcGIS 地图服务 \nhttps://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            creationFunction: function () {
                return esriMap;
            }
        });
        providerViewModels.push(esriMapModel);

        let osmMapModel = new Cesium.ProviderViewModel({
            name: 'osm Maps',
            iconUrl: Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip: 'openstreetmap 地图服务 \nhttps://a.tile.openstreetmap.org/',
            creationFunction: function () {
                return osmMap;
            }
        });
        providerViewModels.push(osmMapModel);

        // let mboxMapModel = new Cesium.ProviderViewModel({
        //     name: 'mapbox Maps',
        //     iconUrl: Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/mapboxSatellite.png'),
        //     tooltip: 'mapbox 地图服务',
        //     creationFunction: function () {
        //         return mboxMap;
        //     }
        // });
        // providerViewModels.push(mboxMapModel);

        let tdtMapModel = new Cesium.ProviderViewModel({
            name: '天地图影像',//tdt Maps
            iconUrl: "sampledata/images/tdt.jpg",//Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/tdt.jpg'),
            tooltip: '天地图 地图服务\nhttp://t0.tianditu.com/img_w/wmts',
            creationFunction: function () {
                return tdtMap;
            }
        });
        providerViewModels.push(tdtMapModel);

        let tdtvMapModel = new Cesium.ProviderViewModel({
            name: '天地图注记',//tdtv Maps
            iconUrl: "sampledata/images/tdt.jpg",//Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/tdt.jpg'),
            tooltip: '天地图注记 地图服务\nhttp://t0.tianditu.com/img_w/wmts',
            creationFunction: function () {
                return tdtVectormap;
            }
        });
        providerViewModels.push(tdtvMapModel);

        let globeLocalMapModel = new Cesium.ProviderViewModel({
            name: '本地影像',//globelocal Maps
            iconUrl: "sampledata/images/tdt.jpg",// Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/tdt.jpg'),
            tooltip: '本地全球 地图服务',
            creationFunction: function () {
                return globeLocalmap;
            }
        });
        providerViewModels.push(globeLocalMapModel);

        new Cesium.Viewer('csm-viewer-container', {
            //        imageryProvider:globemap, //指定此项 则必须设置： baseLayerPicker: false
            contextOptions: {
                webgl: {
                    alpha: true
                }
            },
            creditContainer: "csm-viewer-container",
            selectionIndicator: false,
            animation: false,  //是否显示动画控件
            //        baseLayerPicker: false, //是否显示图层选择控件
            imageryProviderViewModels: providerViewModels,//自定义扩展
            geocoder: false, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            sceneModePicker: true, //是否显示投影方式控件
            navigationHelpButton: false, //是否显示帮助信息控件
            infoBox: false,  //是否显示点击要素之后显示的信息
            fullscreenButton: true
        });
    }
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            terrainProvider: Cesium.createWorldTerrain(),
            // 是否显示图层选择控件
            // baseLayerPicker: false
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        setDataSource();
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

export default Lesson202;
