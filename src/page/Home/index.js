import React, { useState } from 'react'
import Btn from '../../component/Mbtn'

export default function Home() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    console.log('点击', count)
    function handleClick() {
        console.log('btn')
        setTimeout(()=> {
            console.log('count', count)
        }, 2000)
    }
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <Btn text={count}/>
            <div onClick={handleClick}>count 值的变化</div>
        </div>
    );
}
