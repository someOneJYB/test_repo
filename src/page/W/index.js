import React, { Component } from 'react'
import { connect } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom'
import Bundle from './bundle'
let index = 0
/**
 * 公共懒加载函数
 * @param {function}} loader 加载组件
 */
const ViewLoader = (loader) => {
    console.log('loader', loader)
    // 感觉是因为重新 走了 loader 逻辑， 因为 require 会有缓存所以就直接获取缓存值，就是一个缓存值，很快就可以获取到
    return (props) => {
        return <Bundle load={loader}>
            {/* eslint-disable-next-line no-confusing-arrow,no-confusing-arrow,no-confusing-arrow */}
            {View => View ? <View {...props} /> : <Loading />}
        </Bundle>
    }}
class Input extends React.Component {
    componentWillUnmount() {
        console.log('unmount')
    }

    componentDidMount() {
        console.log('input didmount')
    }

    render() {
        console.log('render input')
        // 不会被卸载
        // return this.props.s()
        // 会被卸载
        return React.createElement(this.props.s);
    }
}

/**
 * @function 路由校验去重复
 * @param {Array} arr 路由数组
 */
const E = ViewLoader(require('../views/App'))
// console.log('e', E.toString())
// let index = 0;
function uniqArr(arr) {
    let obj = {}
    let temp = []
    for (let i = 0, l = arr.length; i < l; i++) {
        if (!obj[arr[i].path]) {
            obj[arr[i].path] = 1
            temp.push(arr[i])
        } else {
            throw new Error(`路由${arr[i].path}重复,请检查路由`)
        }
    }
    return temp
}
class F extends React.Component {
    componentWillUnmount() {
        console.log(' f unmount')
    }
    componentDidMount() {
        console.log('f didmount')
    }

    render() {
        return <div>我是 F 嗷嗷</div>
    }
}

// 尽享缓存在render的时候，组件A不会被unmount再mount
// const A = ViewLoader(require('xxxxx'))
class Root extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: index,
        }
    }

    handleClick = () => {
        this.setState({
            a: index++,
        })
    }

    componentWillUnmount() {
        // eslint-disable-next-line no-console
        console.log('unmount')
    }

    log = () => {
        console.log('log');

    }

    hhh = () => <div>hahahahahhahah</div>

    cp = () => () => <div>xdcfgvbhjknlm,;hj<F>1234567 drhfihrei53e874gfiubefjerbfmrbjk fhiurehgithr</F></div>

    renderF = () => React.createElement(this.hhh)

    cell = () => () => <F/>

    renderHigh = () => () => <F/>
    render() {
        console.log('render father', this.state.a)
        return (
            <Router {...this.props} >
                <div className="content">
                    {ViewLoader(require('../views/MyTest'))()}
                    {ViewLoader(require('../views/App'))()}
                    <Route exact path='/testform' component={this.cp()} />
                    {this.log()}
                    <div onClick={this.handleClick}>请疯狂点击我</div>
                    <Input s={this.cell()}/>
                    {/*{this.renderF()}*/}
                    {/*{this.renderHigh()()}*/}
                </div>
            </Router>
        )
    }
}

Root.propTypes = {
    history: PropTypes.object.isRequired,
}

function update(state) {

}
export default connect(update)(Root)
