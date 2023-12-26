import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import globalImagery from "../../assets/images/globe.jpg" // 全球地magery
function Lesson201() {
    let viewer: Cesium.Viewer | null = null;
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    // 中国的坐标
    const chinaPosition = {
        longitude: 116.395645038,
        latitude: 39.9299857781,
        height: 7000000,
    };

    // 一、SingleTileImageryProvider  单张图片服务
    /**
     * Cesium提供了SingleTileImageryProvider接口，可以加载一张图片作为地图数据，这种操作可以方便的使用在一些对影像数据没有要求的场景下。
     *
     */
    let singleTileImageryProvider = new Cesium.SingleTileImageryProvider({
        url: globalImagery,
    })

    const defaultCameraPosition = () => {
        csmViewerRef.current?.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(chinaPosition.longitude, chinaPosition.latitude, chinaPosition.height),
            duration: 2.
        });
    }
    /**
     * 多图层控制
     */
    const moreImageryProvider = () => {
        if (!viewer) return;
        /**
         * 多图层叠加
         *
         */
            //天地图影像
        const tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                layer: "tiandituImg",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "tiandituImg",
                // show: true,
                maximumLevel: 18
            });
        //天地图注记
        const tdtNoteLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
            layer: "tiandituImgMarker",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "tiandituImgMarker",
            // show: true,
            maximumLevel: 16
        });
        //三：GridImageryProvider
        const GridImagery = new Cesium.GridImageryProvider({});
        //四：TileCoordinatesImageryProvider
        const TileCoordinatesImagery = new Cesium.TileCoordinatesImageryProvider({});

        //----------------------------------多图层控制
        // 获取将在地球上渲染的图像图层的集合。
        // let imageryLayers = viewer.imageryLayers;
        // let tdtNoteLayer = imageryLayers.addImageryProvider(tdtNoteLayerProvider);//添加注记图层
        // imageryLayers.raiseToTop(tdtNoteLayer);//将注记图层置顶
        //
        //
        // let GridImageryLayer = imageryLayers.addImageryProvider(GridImagery);//添加注记图层
        // imageryLayers.raiseToTop(GridImageryLayer);//将注记图层置顶
        //
        //
        // let TileCoordinatesImageryLayer = imageryLayers.addImageryProvider(TileCoordinatesImagery);//添加注记图层
        // imageryLayers.raiseToTop(TileCoordinatesImageryLayer);//将注记图层置顶
    }
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            terrainProvider: Cesium.createWorldTerrain(),
            imageryProvider: singleTileImageryProvider,
        });
        viewer = csmViewerRef.current;
        defaultCameraPosition();
        moreImageryProvider();
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

export default Lesson201;
