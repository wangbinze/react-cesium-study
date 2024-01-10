import React, {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import "./index.css";
import PlotDraw from "./plot";

// 态势标绘按钮类型
const btnList = [
    {
        name: "钳击",
        activeName: "doubleArrow",
    },
    {
        name: "直箭头",
        activeName: "straightArrow",
    },
    {
        name: "细直箭头",
        activeName: "fineArrow",
    },
    {
        name: "突击方向",
        activeName: "assaultDirection",
    },
    {
        name: "进攻方向",
        activeName: "attackArrow",
    },
    {
        name: "进攻方向（尾）",
        activeName: "tailedAttackArrow",
    },
    {
        name: "分队战斗行动",
        activeName: "squadCombat",
    },
    {
        name: "分队战斗行动（燕尾）",
        activeName: "tailedSquadCombat",
    },
    {
        name: "删除",
        activeName: "delete",
    },
]
const SituationPlotting = () => {
    let draw;
    // useEffect(() => {
    //     if (window.Viewer) {
    //         draw = new PlotDraw();
    //     }
    // }, [window.Viewer])
    const handleClick = (activeName) => {
        draw = new PlotDraw();
        draw?.draw(activeName)
    }
    const handleDelete = () => {
        /*let handler = new Cesium.ScreenSpaceEventHandler(window.Viewer.scene.canvas);
        handler.setInputAction(function (movement: any) {
            let pick = window.Viewer.scene.pick(movement.position);
            if (Cesium.defined(pick) && pick.id) {
                console.log(pick.id, 'pick.id', window.Viewer.entities);
                window.Viewer.entities.remove(pick.id);
                handler.destroy();
            }
            console.log(draw)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/
    }
    return (
        <div id={"situation-plotting"}>
            {
                btnList.map(item => {
                    return (
                        <button
                            key={item.activeName}
                            onClick={() => {
                                handleClick(item.activeName)
                            }}
                        >{item.name}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default SituationPlotting;
