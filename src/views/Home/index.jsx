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
        {id: 3, name: '第3课', content: 'Lesson3,绘制形状,Entity'}
    ]
    const handleClick = (item) => {
        console.log(item)
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
            default:
                break;
        }
    }
    return (
        <div>
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