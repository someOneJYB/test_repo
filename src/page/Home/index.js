import React, { useState, useEffect } from 'react'
import Btn from '../../component/Mbtn'

import './index.less'
export default function Home() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState({a: 0});
    console.log('点击', count)
    function handleClick() {
        console.log('btn')
        setTimeout(()=> {
            console.log('count', count)
        }, 2000)
    }
    // 在每次外部
    useEffect(function() {
        setTimeout(()=> {
            console.log('count', count)
        }, 2000)
    }, [count]);
    return (
        <div>
            <p className="text">You clicked {count.a} times</p>
            <button onClick={() => setCount({a: count.a + 1})}>
                Click me
            </button>
            <Btn text={count.a}/>
            <div onClick={handleClick}>count 值的变化12453647</div>
        </div>
    );
}
