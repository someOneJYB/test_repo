import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import Message from './context'
import Counter from './closures'
import usePrevious from './usePrevious'
import Test from './file'
import defineHook from './defineHook'
import './hehehe.less'
// 有state的 function component 执行 setXX 的时候会重新 render，重新执行整个函数
// 有没有第二个参数。useEffect hook 接受两个参数，第一个是要执行的代码，第二个是一个数组，指定一组依赖的变量，其中任何一个变量发生变化时，此 effect 都会重新执行一次。有没有返回值。 useEffect 的执行代码中可以返回一个函数，在每一次新的 render 进行前或者组件 unmount 之时，都会执行此函数，进行清理工作。
// useEffect 第二个参数是空数组的时候setCount 无法在 useEffect 中得到值，只会默认初始值。加上第二个值的话会在这个值变化的时候执行
// 会在每次 render 的时候必定执行一次。如果返回了函数，那么在下一次 render 之前或组件 unmount 之前必定会运行一次返回函数的代码。如果指定了依赖数组，且不为空，则当数组里的每个元素发生变化时，都会重新运行一次。如果数组为空，则只在第一次 render 时执行一次，如果有返回值，则同 3。如果在 useEffect 中更新了 state，且没有指定依赖数组，或 state 存在于依赖数组中，就会造成死循环。
// useEffect 中会导致出现闭包行为
// useEffect 第一次被渲染的时候都会触发，但是在无第二个参数的时候只要执行了 render 都会执行，但是如果有依赖的话只在依赖变化的时候执行，空数组的话或者[undefined]在第一次 render 时候执行就不会执行，返回一个函数的话在unmount触发
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
// 不使用 memo 的话就会在 Child 组件 onChange 触发的时候也会导致 render，所以 useCallback 要结合 React.memo
const Child1 = function({val, onChange}) {
    console.log('render1...', val);

    return <input value={val} onChange={onChange} />;
}
const Child = React.memo(function({val, onChange}) {
    console.log('render...', val);

    return <input value={val} onChange={onChange} />;
});
export default function Home() {
    console.log('home render')
    const [val1, setVal1] = useState('val1');
    const [val2, setVal2] = useState('val2');
    // useCallback + Recat.memo 可以放置子组件重复渲染
    const onChange1 = useCallback( evt => {
        console.log('onChange1')
        console.log(evt.target.value)
        setVal1(evt.target.value);
    }, []);
//
    const onChange2 = useCallback( evt => {
        console.log('onChange2')
        console.log(evt.target.value)
        setVal2(evt.target.value);
    }, []);

    // const [text, updateText] = useState('');
    // const [state, dispatch] = useReducer(myReducer, { num: 0 })
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const [title, setTitle] = useState('hahaha');
    console.log('点击', count)
    const latestCount = useRef(count);
    // 在每次外部
    // const handleSubmit = useCallback(() => {
    //     console.log(text, 'text');
    // }, [text]);
    useEffect(() => {
        // Set the mutable latest value
        latestCount.current = count;
        if (mount) {
            console.log('did update')
        }
        console.log('只要变化就有我')
        setTimeout(()=> {
            // 满足了要求不再是必包
            console.log('count', latestCount.current)
        }, 2000)
        // 连续点击三次重新渲染的时候会依此输出1 2 3 而不是三次3这个就是必报的问题
    }, );
    useEffect(function() {
        if(!mount) {
            mount = true
            console.log('初始化123')
            console.log('didMount')
        }
        // console.log('effect')
        // setTimeout(()=> {
        //     console.log('count', count)
        // }, 2000)
        // 返回函数让mount在unmount时候被卸载
        return () => {
            mount = false;
            console.log('unmount啦啦啦啦辣')
        }
    }, []);

    let [number,setNumber] = useState(0);
    function alertNumber(){
        setTimeout(()=>{
            // alert 只能获取到点击按钮时的那个状态
            alert(number);
        },3000);
    }
    console.log(count, '现在的count')
    const prevCount = usePrevious(count)
    console.log(prevCount,'之前的count')
    return (
        <AppContext.Provider value={{
            username: 'superawesome'
        }}>
            <Test/>
            <Child val={val1} onChange={onChange1}/>
            <ComputeComponent/>
            <Child1 val={val2} onChange={onChange2}/>
            <Message/>
            <p className="p-text">You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
            {defineHook(title)}
            <div onClick={() => setTitle(title + 'wocao')}>点击我改变title</div>
            <p>number：{number}</p>
            {/*<div onClick={()=>dispatch({ type: 'countUp' })}>useReducer {state.num}</div>*/}
            <button onClick={()=>setNumber(number+1)}>+</button>
            <button onClick={alertNumber}>打印目前的按钮状态</button>
            <div>日了狗</div>
            <ParentComponent1/>
            <Counter/>
            <ParentComponent/>
        </AppContext.Provider>
    );
}
const ChildrenComponent = memo(({ handleChildren }) => {
    console.log('ChildrenComponent rending');
    return <div onClick={handleChildren}>ChildrenComponent </div>;
});
const ComputeComponent = () => {
    const [count, setCount] = useState(100);
    const [changeNum, setChangeNum] = useState(100);
    // useMemo主要是使用防止内部函数每一次都执行，如果依赖的属性没有变化被 useMemo 修饰的函数就不会在 render 时候执行
    const computeValue = useMemo(() => computeExpensiveValue(count), [count]);
    function computeExpensiveValue(count) {
        console.log('computeExpensiveValue 被执行');
        //比较大计算
        const array = new Array(count).fill(count);
        return array.reduce((currentTotal, item) => {
            return currentTotal + item;
        }, 0);
    }
    const handleSetCount = () => {
        setCount(preCount => preCount * 2);
    };
    const handleChangeNum = () => {
        setChangeNum(preCount => preCount * 2);
    };
    return (
        <div>
            <div>{computeValue}</div>
            <div onClick={handleSetCount}>addCount{count} </div>
            <div onClick={handleChangeNum}> add changeNum {changeNum}</div>
        </div>
    );
};
const ParentComponent1 = () => {
    const [count, setCount] = useState(1);
    const [updateChildrenComponentNum, setUpdateChildrenComponentNum] = useState(
        0
    );
    const handleChildren = updateChildrenComponentNum => {
        console.log(
            'clicked ChildrenComponent updateChildrenComponentNum ' +
            updateChildrenComponentNum
        );
    };
    const handleChildrenCallback = useCallback(() => {
        handleChildren(updateChildrenComponentNum);
    }, [updateChildrenComponentNum]);

    const handleParent = () => {
        console.log('clicked ParentComponent');
        setCount(preCount => preCount + 1);
        if (count % 3 === 0) setUpdateChildrenComponentNum(preNum => preNum + 1);
    };

    return (
        <div>
            <div onClick={handleParent}>ParentComponent --count =={count} </div>
            <ChildrenComponent6 handleChildren={handleChildrenCallback} />
        </div>
    );
};

const ChildrenComponent6 = memo(({ handleChildren }) => {
    console.log('ChildrenComponent rending');
    return <div onClick={handleChildren}>ChildrenComponent </div>;
});
// 但是因为每一次返回一个新的执行空间所以 handleChildren 函数一直都是一个新的引用，所以在 mome 中认为是新的参数，所以需要的是使用 useCallback 让函数保持住引用只在特定变化的时候才变化，这样就可以保证子组件随着函数的引用变化导致不必要的重新渲染
const ParentComponent = () => {
    const [count, setCount] = useState(0);
    const handleChildren = () => {
        console.log('clicked ChildrenComponent');
    };

    const handleParent = () => {
        console.log('clicked ParentComponent');
        setCount(preCount => preCount + 1);
    };

    return (
        <div>
            <div onClick={handleParent}>ParentComponent --count =={count} </div>
            <ChildrenComponent handleChildren={handleChildren} />
        </div>
    );
};
