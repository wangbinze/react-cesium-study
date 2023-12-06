/*
 * @Author: wangbinze 269929127@qq.com
 * @Date: 2023-12-06 10:47:42
 * @LastEditors: wangbinze 269929127@qq.com
 * @LastEditTime: 2023-12-06 11:05:09
 * @FilePath: \cesium-in-react-master\craco.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const CracoCesiumPlugin = require("craco-cesium")

module.exports = {
    plugins: [
      { 
        plugin:CracoCesiumPlugin()
      }
    ]
  };