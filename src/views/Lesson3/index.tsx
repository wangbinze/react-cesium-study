import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Lesson3() {
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

    // 绘制图形
    /**
     * Cesium 可绘制图形种类非常多
     * 基本都是以实体的方式进行绘制
     * Entity API 绘制空间数据，例如点、标记、标签、线条、模型、形状和体积等
     * 实体是一种特殊的对象，它可以包含多个属性，例如位置、旋转、缩放、颜色、纹理、边界等
     * 实体的属性可以动态更新，例如位置、旋转、缩放、颜色、纹理、边界等
     *
     */
    /**
     * box  矩形
     * ellipses  椭圆
     * corridor  走廊
     * cylinder  圆柱体
     * polygon  多边形
     * polyline  折线
     * polylineVolume  折线体
     * rectangle  矩形
     * ellipsoid  椭球体
     * wall  实体墙
     * https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/
     */
    const drawGraph = () => {
        /**
         * 绘制一个点
         * 绘制的点，会正对屏幕（相机），在旋转地球时，可能会存在有部分会被地球所遮挡
         * show: true  设置实体的可见性
         * 具体options 参考文档
         */
        csmViewerRef.current?.entities.add({
            // 位置
            position: Cesium.Cartesian3.fromDegrees(116.395645038, 39.9299857781, 700),
            point: {
                pixelSize: 100,
                // 颜色有多种方式进行绘制
                // color: Cesium.Color.RED,
                // color: Cesium.Color.fromCssColorString('#ffffff'),
                color: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.5),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                // show: true,
                // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // 点的大小，单位为米
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 1000000, 0.1),
            }
        })
        /**
         * 绘制一条线
         *
         */
        csmViewerRef.current?.entities.add({
            polyline: {
                // 线是有一个，或者多个点组成的，所以坐标为positions，且是一个有多个点的经纬度所组合成的数组 fromDegreesArrayHeights，根据数据顺序进行画点连线
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([116.395645038, 39.9299857781, 700, 117.395645038, 39.9299857781, 700, 118.395645038, 30.9299857781, 700, 119.395645038, 49.9299857781, 700]),
                // 线的颜色，可设置透明度
                material: Cesium.Color.RED.withAlpha(0.7),
                // 线的宽度
                width: 5,
            }
        })
        /**
         * 绘制一个面
         * 矩形：rectangle，多边形：polygon，圆形：ellipse，道路：corridor 等
         */

        /**
         * 绘制一个圆，圆和椭圆是同样的 ellipse 放大后会发现，边缘其实依旧是由线段组成的
         */
        csmViewerRef.current?.entities.add({
            // 位置
            position: Cesium.Cartesian3.fromDegrees(116.395645038, 39.9299857781),
            ellipse: {
                // 短半轴，必须要小于长半轴
                semiMinorAxis: 500.0,
                // 长半轴
                semiMajorAxis: 500.0,
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        })
    }

    useEffect(() => {
        if (viewerContainerRef.current && !csmViewerRef.current) {
            // Cesium 要求的Token  如果没有 则无法加载地球
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
            csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
                // 用于显示地理位置和实体信息的弹出式信息框组件。它通常用于显示与地图上选定的实体或位置相关的详细信息（默认为true）
                infoBox: false,
                //  地形
                terrainProvider: Cesium.createWorldTerrain(),
            });

            defaultCameraPosition();
            drawGraph();
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

export default Lesson3;