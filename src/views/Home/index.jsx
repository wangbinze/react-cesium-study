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
        {id: 1, name: '第一课', content: '加载地球'},
        {id: 2, name: '商品2'},
        {id: 3, name: '商品3'}
    ]
    const handleClick = (item) => {
        console.log(item)
        switch (item.id) {
            case 1:
                navigate("/page1");
                break;
            case 2:
                navigate("/page2");
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