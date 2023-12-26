/*
/!*
import * as Cesium from "cesium";

// 引入自定义图片,铁轨
import loadMisson from "../../assets/images/huoche.png";

const defaultColor = Cesium.Color.TRANSPARENT;
const defaultImage = loadMisson;
const defaultImageimageW = 40;
const defaultAnimation = false;
const defaultDuration = 1000;

function ImageLineMaterial(opt) {
    opt = Cesium.defaultValue(opt, Cesium.defaultValue.EMPTY_OBJECT);
    this._definitionChanged = new Cesium.Event();
    // 定义材质变量
    this._color = undefined;
    this._colorSubscription = undefined;
    this._backgroundColor = undefined;
    this._backgroundColorSubscription = undefined;
    this._image = undefined;
    this._imageSubscription = undefined;
    this._imageW = undefined;
    this._imageWSubscription = undefined;
    this._animation = undefined;
    this._animationSubscription = undefined;
    this._duration = undefined;
    this._durationSubscription = undefined;
    // 变量初始化
    this.color = opt.color || defaultColor; // 颜色
    this.backgroundColor = opt.backgroundColor || defaultColor; // 颜色
    this._image = opt.image || defaultImage; // 材质图片
    this.imageW = opt.imageW || defaultImageimageW;
    this.animation = opt.animation || defaultAnimation;
    this.duration = opt.duration || defaultDuration;
    this._time = undefined;
}
// 材质类型
ImageLineMaterial.prototype.getType = function (time) {
    return 'ImageLine';
};
// 这个方法在每次渲染时被调用，result的参数会传入glsl中。
ImageLineMaterial.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
    result.backgroundColor = Cesium.Property.getValueOrClonedDefault(
        this._backgroundColor,
        time,
        defaultColor,
        result.backgroundColor
    );
    result.image = this._image;
    result.imageW = this._imageW;
    result.animation = this._animation;
    if (this._time === undefined) {
        this._time = new Date().getTime();
    }
    result.time = ((new Date().getTime() - this._time) % this._duration) / this._duration;
    return result;
};

ImageLineMaterial.prototype.equals = function (other) {
    return (
        this === other ||
        (other instanceof ImageLineMaterial &&
            Cesium.Property.equals(this._color, other._color) &&
            Cesium.Property.equals(this._backgroundColor, other._backgroundColor))
    );
};

Object.defineProperties(ImageLineMaterial.prototype, {
    isConstant: {
        get: function get() {
            return false;
        },
    },
    definitionChanged: {
        get: function get() {
            return this._definitionChanged;
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    backgroundColor: Cesium.createPropertyDescriptor('backgroundColor'),
    image: Cesium.createPropertyDescriptor('image'),
    imageW: Cesium.createPropertyDescriptor('imageW'),
    animation: Cesium.createPropertyDescriptor('animation'),
    duration: Cesium.createPropertyDescriptor('duration'),
});

// eslint-disable-next-line no-import-assign
Cesium.ImageLineMaterialProperty = ImageLineMaterial;
Cesium.Material.ImageLineMaterialProperty = 'ImageLineMaterialProperty';
// 写到Cesium对象上，就可以像其他MaterialProperty一样使用了
Cesium.Material.ImageLineType = 'ImageLine';
Cesium.Material.ImageLineMaterialSource = `

varying float v_polylineAngle;
mat2 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(
      c, s,
      -s, c
  );
}

#extension GL_OES_standard_derivatives : enable
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
    float s = st.s/ (abs(fwidth(st.s)) * imageW * czm_pixelRatio);
    float t = st.t;
    s = s-time;//增加运动效果
    vec4 colorImage = texture2D(image, vec2(fract(s), t));
    material.diffuse = colorImage.rgb;
    return material;
}
    `;

Cesium.Material._materialCache.addMaterial('PolylineTrailLink', {
    fabric: {
        type: 'PolylineTrailLink',
        uniforms: {
            // uniforms参数跟我们上面定义的参数以及getValue方法中返回的result对应，这里值是默认值
            color: new Cesium.Color(255.0, 255.0, 255.0, 1),

            image: loadMisson,
            imageW: 1,
            animation: false,
            duration: 30,
            time: 0,
        },
        // source编写glsl，可以使用uniforms参数，值来自getValue方法的result
        source: Cesium.Material.ImageLineMaterialSource,
    },
    translucent: function translucent() {
        return true;
    },
});

export const ImageLineMate = new Cesium.ImageLineMaterialProperty({
    image: loadMisson,
}); // 使用我们自定义的材质
*!/

import * as Cesium from 'cesium';
import loadMisson from "../../assets/images/666.png";


function PolylineTrailLinkMaterialProperty(color, duration, d) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration || 3000;
    this._time = (new Date()).getTime();
    this._d = d;
    this.isTranslucent = function () {
        return true;
    }
}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return 'PolylineTrailLink';
}
PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration * this._d;
    return result;
}
PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineTrailLinkMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}


Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
Cesium.Material.PolylineTrailLinkImage = loadMisson;
/!*Cesium.Material.PolylineTrailLinkSource = "\
    czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
            return material;\n\
        }";*!/
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: -20
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function (material) {
        return true;
    }
});
export const ImageLineMate = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.WHITE, 3000,1); // 使用我们自定义的材质
*/
