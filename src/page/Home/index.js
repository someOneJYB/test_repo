import React, { useState, useEffect } from 'react'
import Btn from '../../component/Mbtn'
import Counter from '../Counter'
import SliderPicLeft from '../../component/SliderPicLeft'
import Switch from '../../component/Switch'
import Swipers from '../../component/Swiper'
import Vertical from '../../component/VerticalCarousal'
import './index.less'
export default function Home() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState({a: 0});
    const [show, setShow] = useState(true);
    console.log('点击', count)
    function handleClick() {
        console.log('btn')
        setTimeout(()=> {
            console.log('count', count)
        }, 2000)
    }
    const clicks = () => {
        setShow(true)
    }
    const close = () => {
        setShow(false)
    }
    const getChange = (c) => {
        console.log(c)
    }
    useEffect(function() {
       console.log(show)
    });
    // 在每次外部
    useEffect(function() {
        setTimeout(()=> {
            console.log('count', count)
        }, 2000)
    }, [count]);
    console.log(show)
    return (
        <div>
            <Counter/>
            <SliderPicLeft imageList={[
                { style: {
                        backgroundColor: 'red'
                    } },
                { style:{
                        backgroundColor: 'green'
                    },

                },
                { style:{
                        backgroundColor: 'yellow'
                    },

                },
                { style:{
                        backgroundColor: 'pink'
                    },

                }
            ]} width={'300px'} height={'200px'} duration={0.6} dot auto/>
            <Switch color="blue" onChange={getChange}/>
            <SliderPicLeft width={'50px'} height={'20px'} imageList={[
                { style: {
                        backgroundColor: 'red',

                    },
                    children: '李晓明'},
                { style:{
                        backgroundColor: 'green',

                    },
                    children: '马小跳'

                },
                { style:{
                        backgroundColor: 'yellow',

                    },
                    children: '王小华'
                },
                { style:{
                        backgroundColor: 'pink',

                    },
                    children: '大傻子'
                }
            ]} dot duration={0.4} auto/>
            <div onClick={clicks}>onclick1234345678956789</div>
            <Swipers direction={'col'}/>
            <p className="text">You clicked {count.a} times</p>
            <Vertical width={'50px'} height={'20px'} imageList={[
                { style: {
                        backgroundColor: '#fff',

                    },
                    children: <div style={{textAlign: 'center'}}>户籍华</div>
                },
                { style:{
                        backgroundColor: '#fff',

                    },
                    children: <div style={{textAlign: 'center'}}>等小华</div>

                },
                { style:{
                        backgroundColor: '#fff',

                    },
                    children: <div style={{textAlign: 'center'}}>王小华</div>
                },
                { style:{
                        backgroundColor: '#fff',

                    },
                    children: <div style={{textAlign: 'center'}}>大傻子</div>
                }
            ]} auto duration={0.3}/>
            <button onClick={() => setCount({a: count.a + 1})}>
                Click me
            </button>
            <Btn text={count.a}/>
            <div onClick={handleClick}>count 值的变化12453647</div>
        </div>
    );
}
