import React, { useState, useEffect, useForceUpdate, useRef, useReducer, userContext } from 'react'
import Message from './context'
import defineHook from './defineHook'
import './hehehe.less'
// 有state的 function component 执行 setXX 的时候会重新 render，重新执行整个函数
// 有没有第二个参数。useEffect hook 接受两个参数，第一个是要执行的代码，第二个是一个数组，指定一组依赖的变量，其中任何一个变量发生变化时，此 effect 都会重新执行一次。有没有返回值。 useEffect 的执行代码中可以返回一个函数，在每一次新的 render 进行前或者组件 unmount 之时，都会执行此函数，进行清理工作。
// useEffect 第二个参数是空数组的时候setCount 无法在 useEffect 中得到值，只会默认初始值。加上第二个值的话会在这个值变化的时候执行
// 会在每次 render 的时候必定执行一次。如果返回了函数，那么在下一次 render 之前或组件 unmount 之前必定会运行一次返回函数的代码。如果指定了依赖数组，且不为空，则当数组里的每个元素发生变化时，都会重新运行一次。如果数组为空，则只在第一次 render 时执行一次，如果有返回值，则同 3。如果在 useEffect 中更新了 state，且没有指定依赖数组，或 state 存在于依赖数组中，就会造成死循环。
// useEffect 中会导致出现闭包行为
let mount = false;
import { AppContext } from './ctx'
const myReducer = (state, action) => {
    switch(action.type) {
        case('countUp'):
            return {
                ...state,
                num: state.num + 1
            }
        default:
            return state
    }
}
export default function Home() {
    console.log('home render')
    const [state, dispatch] = useReducer(myReducer, { num: 0 })
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const [title, setTitle] = useState('hahaha');
    console.log('点击', count)
    const latestCount = useRef(count);
    // 在每次外部
    useEffect(() => {
        // Set the mutable latest value
        latestCount.current = count;
        if (mount) {
            console.log('did update')
        }
        setTimeout(()=> {
            // 满足了要求不再是必包
            console.log('count', latestCount.current)
        }, 2000)
        // 连续点击三次重新渲染的时候会依此输出1 2 3 而不是三次3这个就是必报的问题
    }, );
    useEffect(function() {
        if(!mount) {
            mount = true
            console.log('didMount')
        }
        // console.log('effect')
        // setTimeout(()=> {
        //     console.log('count', count)
        // }, 2000)
        // 返回函数让mount在unmount时候被卸载
        return () => {
            mount = false;
            console.log('unmount')
        }
    }, []);
    let [number,setNumber] = useState(0);
    function alertNumber(){
        setTimeout(()=>{
            // alert 只能获取到点击按钮时的那个状态
            alert(number);
        },3000);
    }
    return (
        <AppContext.Provider value={{
            username: 'superawesome'
        }}>
            <Message/>
            <p className="p-text">You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
            {defineHook(title)}
            <div onClick={() => setTitle(title + 'wocao')}>点击我改变title</div>
            <p>number：{number}</p>
            <div onClick={()=>dispatch({ type: 'countUp' })}>useReducer {state.num}</div>
            <button onClick={()=>setNumber(number+1)}>+</button>
            <button onClick={alertNumber}>打印目前的按钮状态</button>
        </AppContext.Provider>
    );
}
