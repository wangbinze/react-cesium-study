import React, {useEffect, useRef} from "react";
import * as Cesium from "cesium";

function Page1() {
    const csmViewerRef = useRef<null | Cesium.Viewer>(null);
    const viewerContainerRef = useRef(null);

    useEffect(() => {
        if (viewerContainerRef.current && !csmViewerRef.current) {
            // Cesium 要求的Token  如果没有 则无法加载地球
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZmRjY2ZkNC00M2I5LTQwMDktODA0ZS01NmY5ODBkYmUzOGMiLCJpZCI6NjM0OCwiaWF0IjoxNzAxODI3ODI3fQ.ukQm5Q1hF9UFwOJNnw_R6otKl7tQbwX13EkE2hSEEZI";
            csmViewerRef.current = new Cesium.Viewer("csm-viewer-container");
        }
        console.log(csmViewerRef.current);
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