import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd';
import { myInfo, add  } from './al.js'
import Mbtn from '../../component/Mbtn'
import Menu from './cs.js'
const s = new Menu()
s.hide()
console.log('打印一下吧', myInfo.name, add(1, 2))
class Counter extends Component {
    add = () => {
        this.props.dispatch({ type: 'INCREMENT' })
    }
    minus = () => {
        this.props.dispatch({ type: 'DECREMENT' })
    }
    render() {
        const { num } = this.props;
        return (
            <div className="app-wrapper">
                <Button>ant</Button>
                <h1>当前的数据：{num}</h1>
                <Mbtn num={num > 3}/>
                <h2 onClick={this.add}>加一</h2>
                <h2 onClick={this.minus}>减一</h2>
            </div>
        )
    }
}
function update(state) {
    console.log(state)
    return {
        num: state.num
    }
}

export default connect(update)(Counter)
