/*
 * @Author: wangbinze 269929127@qq.com
 * @Date: 2023-12-06 10:47:42
 * @LastEditors: wangbinze 269929127@qq.com
 * @LastEditTime: 2023-12-06 11:21:23
 * @FilePath: \cesium-in-react-master\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import {
  createHashRouter,
  RouterProvider
} from 'react-router-dom';
import './App.css';
import routers from './router/index';
// import 'cesium/Build/Cesium/Widgets/widgets.css';


const router = createHashRouter(routers);

function App() {
  return (
      <RouterProvider router={ router } />
  );
}

export default App;
