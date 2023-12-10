## 地图底图配置
Ceisum默认配置了一些地图，默认为Bing Maps Aerial地图。
可通过 viewer 配置 ：`baseLayerPicker: false`, 对原本右上角的地图选择进行隐藏，然后在根据项目需求，配置项目所需要的默认地图。
### 配置说明

1. 使用Cesium官方所提供的地图数据，在Cesium ion 中获取相应的数据id，进行配置。可能实际项目中采用这种方式的可能性比较小。
```javascript
const layer = csmViewerRef.current.imageryLayers.addImageryProvider(
    // 此id来自于 cesium ion  从 ion 获取的，单大部分项目基本不会使用这种方式，必须要使用外网
    // https://ion.cesium.com/assetdepot/354307     有很多cesium 官方所提供的数据
    new Cesium.IonImageryProvider({ assetId: 3812 })
);
```

2. 自定义相关地图的配置数据，进行自定义切换。
```javascript
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
```
可通过 viewer 配置：`imageryProvider: imageryList.tdtImagery`,也可以根据自己的需求，进行动态的切换。
## 地形配置
Cesium 默认没有开启地形，没有立体感。且在距离面积计算上等都会有相应的问题，所有我们需要手动开启地形。同样是通过 viewer 配置进行的。`terrainProvider`。也可以同地图配置一样。根据项目需求进行调整。
```javascript
// terrainProvider     地形
terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1),  //放入地形服务器的地址
    requestVertexNormals: true,  //增加法线，提高光照效果
    requestWaterMask: true   //增加水面特效
}),
// terrainProvider: Cesium.createWorldTerrain(),
```
