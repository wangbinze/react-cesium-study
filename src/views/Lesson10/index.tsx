import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

// let planeEntities = [];
function Lesson10() {
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
     * 加载点云数据
     */
    const loadPointCloud = async () => {
        console.log('加载点云数据');
        const globe = csmViewerRef.current?.scene.globe;
        let edgeStylingEnabled = true;
        let clippingPlanesEnabled = true;
        const viewModel = {
            debugBoundingVolumesEnabled: false,
            edgeStylingEnabled: true,
            exampleTypes: ['Point Cloud'],
            currentExampleType: 'Point Cloud',
        };
        if (csmViewerRef.current) {
            const clippingPlanes = new Cesium.ClippingPlaneCollection({
                planes : [
                    new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), 5.0)
                ],
                // edgeColor: Cesium.Color.fromCssColorString('#FF0000'),
                // edgeWidth: 1.0
                edgeWidth: edgeStylingEnabled ? 1.0 : 0.0,
                edgeColor: Cesium.Color.WHITE,
                enabled: clippingPlanesEnabled,
            });
            const tileSet = new Cesium.Cesium3DTileset({
                url: 'dianyun/tileset.json',
                clippingPlanes : clippingPlanes
            });
            csmViewerRef.current.scene.primitives.add(tileSet);

            // 为剪切面创建一个实体，使得看起像是有一面墙
            // const planEntity = csmViewerRef.current?.entities.add({
            //     rectangle: {
            //         coordinates: rectangle,
            //         fill: false,
            //         outline: true,
            //         outlineColor: Cesium.Color.WHITE,
            //     },
            // })
            setTimeout(() => {
                console.log('zoomTo');
                csmViewerRef.current?.zoomTo(tileSet);

                tileSet.debugShowBoundingVolume =
                    viewModel.debugBoundingVolumesEnabled;
                const boundingSphere = tileSet.boundingSphere;
                console.log(boundingSphere,'boundingSphere--')
                const radius = boundingSphere.radius;
                console.log(radius,'radius--')
                const plane = clippingPlanes.get(0);
                console.log(plane,'plane--')
                const planeEntity = csmViewerRef.current?.entities.add({
                    position: boundingSphere.center,
                    plane: {
                        dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 1.5),
                        material: Cesium.Color.WHITE.withAlpha(0.2),
                        plane: new Cesium.CallbackProperty(
                            createPlaneUpdateFunction(plane),
                            false
                        ),
                        outline: true,
                        outlineColor: Cesium.Color.YELLOW,
                    },
                });
            }, 2000);
        }
    }
    let targetY = 0.0;
    // function createPlaneUpdateFunction(plane) {
    //     return function () {
    //         plane.distance = targetY;
    //         return plane;
    //     };
    // }
    const createPlaneUpdateFunction = (plane: Cesium.ClippingPlane) => {
        return function () {
            plane.distance = targetY;
            return plane;
        };
    }
    useEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
        csmViewerRef.current = new Cesium.Viewer("csm-viewer-container", {
            infoBox: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        // defaultCameraPosition();
        loadPointCloud();
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

export default Lesson10;
