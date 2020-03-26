import React from 'react';
import App from "../App";

class X extends React.Component {
    componentDidMount(){
        console.log('X didmount')
        document.getElementById('btn-reactandnative').addEventListener('click', (e) => {
            console.log('原生+react 事件:   father 原生事件执行');
            // e.stopPropagation();
        }, true);
        document.getElementById('btn-confirm').addEventListener('click', (e) => {
            console.log('原生+react 事件:   son 原生事件执行');
            // e.stopPropagation();
        }, true);

    }

    handleNativeAndReact = (e) => {
        console.log('原生+react 事件:  当前执行react事件 father');
    }

    handleClick=(e)=>{
        console.log('阻止冒泡钱')
        // e.stopPropagation();
        console.log(e, 'e122')
        console.log('button click son');
    }
    render(){
        console.log('x render')
        return (
            <div className="pageIndex"><p>react event!!!</p>
                <div id="btn-reactandnative" onClick={this.handleNativeAndReact}>
                    原生 + react 事件
                    <button id="btn-confirm" onClick={this.handleClick}>react 事件</button>
                </div>
            </div>
        )
    }

}

export default X
