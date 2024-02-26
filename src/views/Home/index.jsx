/*
 * @Author: wangbinze 269929127@qq.com
 * @Date: 2023-12-06 11:16:42
 * @LastEditors: wangbinze 269929127@qq.com
 * @LastEditTime: 2023-12-06 11:17:11
 * @FilePath: \cesium-in-react-master\src\views\Home\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {useNavigate} from "react-router-dom";
import './index.css'

function Home() {
    const navigate = useNavigate(); //
    const list = [
        {id: 1, name: '第1课', content: 'Lesson1,项目运行环境的搭建以及基本配置说明'},
        {id: 2, name: '第2课', content: 'Lesson2,地图和地形修改'},
        {id: 3, name: '第3课', content: 'Lesson3,绘制实体,Entity'},
        {id: 4, name: '第4课', content: 'Lesson4,绘制会动的线段,Polyline'},
        {id: 5, name: '第5课', content: 'Lesson5,添加模型,Model，3d titles'},
        {id: 6, name: '第6课', content: 'Lesson6,相机控制,camera'},
        {id: 7, name: '第7课', content: 'Lesson7,polyline弧段类型'},
        {id: 8, name: '第8课', content: 'Lesson8,迁徙图，飞行线'},
        {id: 9, name: '第9课', content: 'Lesson9,热力图'},
        {id: 10, name: '第10课', content: 'Lesson10,剖面'},
        {id: 11, name: '第11课', content: 'Lesson11,插值：平滑路径'},
        {id: 12, name: '第12课', content: 'Lesson12,粒子效果'},
        {id: 13, name: '第13课', content: 'Lesson13,移动四边形，polygon'},
        {id: 14, name: '第14课', content: 'Lesson14,材质设置,可移动'},
        {id: 201, name: '第201课', content: 'Lesson201,Cesium影像服务--图册功能'},
        {id: 202, name: '第202课', content: 'Lesson202,Cesium影像服务--BaseLayerPicker使用,自定义数据源'},
        {id: 203, name: '第203课', content: 'Lesson203,Cesium地形服务—在线地形'},
        {id: 204, name: '第204课', content: 'Lesson204,Cesium鼠标事件'},
        {id: 205, name: '第205课', content: 'Lesson205,绘制对象-Entity方式'},
        {id: 206, name: '第206课', content: 'Lesson206,'},
        {id: 207, name: '第207课', content: 'Lesson207,水波'},
        {id: 208, name: '第208课', content: 'Lesson208,地形开挖'},
        {id: 209, name: '第209课', content: 'Lesson209,threejs'},
    ]
    const handleClick = (item) => {
        switch (item.id) {
            case 1:
                navigate("/lesson1");
                break;
            case 2:
                navigate("/lesson2");
                break;
            case 3:
                navigate("/lesson3");
                break;
            case 4:
                navigate("/lesson4");
                break;
            case 5:
                navigate("/lesson5");
                break;
            case 6:
                navigate("/lesson6");
                break;
            case 7:
                navigate("/lesson7");
                break;
            case 8:
                navigate("/lesson8");
                break;
            case 9:
                navigate("/lesson9");
                break;
            case 10:
                navigate("/lesson10");
                break;
            case 11:
                navigate("/lesson11");
                break;
            case 12:
                navigate("/lesson12");
                break;
            case 13:
                navigate("/lesson13");
                break;
            case 14:
                navigate("/lesson14");
                break;
            case 201:
                navigate("/lesson201");
                break;
            case 202:
                navigate("/lesson202");
                break;
            case 203:
                navigate("/lesson203");
                break;
            case 204:
                navigate("/lesson204");
                break;
            case 205:
                navigate("/lesson205");
                break;

            case 206:
                navigate("/lesson206");
                break;
            case 207:
                navigate("/lesson207");
                break;
            case 208:
                navigate("/lesson208");
                break;
            case 209:
                navigate("/lesson209");
                break;
            default:
                break;
        }
    }
    return (
        <div className={'home'}>
            <h1>这是目录页面</h1>
            <ol>
                {list.map(item => {
                    return (
                        <li key={item.id}>
                            <p>{item.name}</p>
                            <p className={'list-text'} onClick={() => handleClick(item)}>{item.content}</p>
                        </li>
                    )
                })}
            </ol>
        </div>
    );
}

export default Home;
