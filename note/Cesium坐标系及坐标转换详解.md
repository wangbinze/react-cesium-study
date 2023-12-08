# 坐标系相关介绍
## 1、平面坐标系（Cartesian2）
`new Cesium.Cartesian2(x, y);`
二维笛卡尔坐标系。屏幕左上角为原地，x右为正，y下为正。
## 2、笛卡尔空间直角坐标系-世界坐标（Cartesian3）
`new Cesium.Cartesian(x, y, z);`
坐标原点在椭球的中心。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32423127/1701938153497-e57cb613-df2a-4530-b309-7e08e4e1b2e1.png#averageHue=%23fbfbfa&clientId=uc95a3d15-f187-4&from=paste&height=182&id=u06ed9c44&originHeight=279&originWidth=413&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19848&status=done&style=none&taskId=ud05b99a8-6f72-42ad-9d44-4ee8bdc21b8&title=&width=270)
## 3、弧度（Cartographic）
`new Cesium.Cartographic(longitude, latitude, height);`
> 注：这里的经纬度是用弧度表示的，经纬度其实就是角度。弧度即角度对应弧长是半径的倍数。（弧度是由半径所夹的弧长除以半径得到的。）
> 角度-->弧度：π / 180 × 角度
> 弧度-->角度：180 / π × 弧度

## 4、经纬度（longitude，latitude）
地理坐标系，坐标原点在椭球的球心。

1. **经度（Longitude）：** 经度是指地球表面上一个点与本初子午线（通常为格林尼治子午线）之间的角度。它用度（°）来度量，以东经为正，西经为负，范围是-180°到+180°。
2. **纬度（Latitude）：** 纬度是指地球表面上一个点距离赤道的角度。它同样用度（°）来度量，以北纬为正，南纬为负，范围是-90°到+90°。
## 5、WGS84坐标系

# 坐标转换
## 1、经纬度 --> 世界坐标（Cartesian3）
> 第一种方式：直接转换
> `Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result)`

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| longitude | Number |  | 经度，以度为单位 |
| latitude | Number |  | 纬度，以度为单位 |
| height | Number | 0.0 | 可选椭圆体上方的高度，以米为单位。 |
| ellipsoid | Ellipsoid | Ellipsoid.WGS84 | 可选位置所在的椭球体。 |
| result | Cartesian3 |  | 可选存储结果的对象。 |


---

> 第二种方式：先转换成弧度再转换
> let ellipsoid = viewer.scene.globe.ellipsoid;
> let cartographic = Cesium.Cartographic.fromDegrees(lng,lat,alt);
> - **lng** 是经度，以度为单位。
> - **lat** 是纬度，以度为单位。
> - **alt** 是相对椭球体的高度（或海拔），以米为单位。
> 
let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);

## 2、世界坐标 --> 经纬度
> var ellipsoid = viewer.scene.globe.ellipsoid;
> var cartesian3 = new Cesium.cartesian3(x,y,z);
> var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
> var lat = Cesium.Math.toDegrees(cartograhphic.latitude);
> var lng = Cesium.Math.toDegrees(cartograhpinc.longitude);
> var alt = cartographic.height;

## 3、弧度和经纬度
> 经纬度转弧度：
> Cesium.Math.toRadians(degrees);	// 将度数转换为弧度。
> 弧度转经纬度：
> Cesium.Math.toDegrees(radians);  // 将弧度转换为度数。

## 4、屏幕坐标和世界坐标相互转换
> 屏幕坐标-->世界坐标
> let pick1 = new Cesium.Cartesian2(0, 0);
> let cartesian = viewer.scene.globe.pick(viewer.camera.getPockRay(pick1), viewer.scene);
> 注意：屏幕坐标一定要在地球上，否则生成出的cartesian对象是undefined


---

> 世界坐标 --> 屏幕坐标
> Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position));
> 结果是Cartesian2对象，取出X,Y即为屏幕坐标。

## 5、Cartesian2
> Cesium.Cartesian2.formCartesian3(cartesian[, result]);
> 从现有的 Cartesian3 创建一个 Cartesian2 实例。这只是简单地采用笛卡尔 3 的 x 和 y 属性并删除 z。
> result：存储结果的对象（cartesian2）

## 6、Cartesian3
> 经纬度坐标（WGS84）--> Cartesian3
> Cesium.Cartesian3.fromDegrees (longitude, latitude, height , ellipsoid , result )


---

> 弧度坐标 --> Cartesian3
> Cesium.Cartesian3.fromRadians (longitude, latitude, height , ellipsoid , result )

## 7、Cartographic
> Cartesian3 --> Cartographic
> Cesium.Cartographic.fromCartesian(cartesian[, ellipsoid, result]) → Cartographic


---

> 经纬度坐标（WGS84） --> Cartographic
> Cesium.Cartographic.fromDegrees (longitude, latitude[, height , result]) → Cartographic


---

> 经纬度坐标和弧度也可以通过Cesium.Math来转换
> Cesium.Math.toDegrees(radians) → Number
> Cesium.Math.toRadians(degrees) → Number


---

> 经纬度转换到笛卡尔坐标系后就能运用计算机图形学中的仿射变换知识进行空间位置变换如平移旋转缩放。
> Cesium为我们提供了很有用的变换工具类：Cesium.Cartesian3（相当于Point3D）Cesium.Matrix3（3x3矩阵，用于描述旋转变换）Cesium.Matrix4（4x4矩阵，用于描述旋转加平移变换），Cesium.Quaternion（四元数，用于描述围绕某个向量旋转一定角度的变换）。

