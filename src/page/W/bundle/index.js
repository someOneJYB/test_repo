import React, { Component } from 'react'
import './index.less'

// 常量，重试次数,每次的时间差基数
const totalTimes = 5
const timeStep = 500
class ErrorComponent extends Component {
    componentDidMount() {
        console.log('组件加载失败');
    }
    render() {
        return (
            <div>
                <div>
                    网络错误
                </div>
                <div>网络不稳定，请刷新重试</div>
            </div>
        )
    }
}
class Bundle extends Component {
    constructor(props) {
        super(props)
        this.hasUnmount = false
        console.log(new Date())
    }
// 其实已经获取到了但是认为 null
    state = {
        // short for "module" but that's a keyword in js, so "mod"
        mod: null, // 用来存储异步加载的组件
        timer: null, // 超时重新加载计时器
        times: 0, // 重试次数
    }

    componentWillMount() {
        this.load(this.props)// 加载器加载后，开始异步加载组件
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }
    componentWillUnmount() {
        this.clearTimer()// 组件卸载清除计时器
        this.hasUnmount = true
        console.log('bundle unmount')
    }
    /**
     * 清理计时器
     */
    clearTimer() {
        if (this.state.timer) {
            clearTimeout(this.state.timer)
        }
        if (!this.hasUnmount) {
            this.setState({ timer: null, times: 0 })
        }
    }

    /**
     * 异步加载函数
     * @param  {Object} props 父组件传过来的属性
     */
    load(props) {
        if (!this.hasUnmount) {
            this.setState({ mod: null })
        }
        props.load((mod) => {
            // mod 如果是 cjs 或者是 es6 打包结果不同 cjs 直接就可以使用， es6 放置在 default 里面
            if (!this.hasUnmount) {
                console.log(this.state.times)
                this.setState({
                    // handle both es imports and cjs
                    mod: mod.default ? mod.default : mod,
                })
                this.clearTimer()
            }
        })
        // 小于最大次数时候，实现超时处理
        if (this.state.times < totalTimes) {
            let timer = setTimeout(() => {
                this.load(this.props)
            }, (totalTimes - this.state.times) * timeStep)
            // 设置计时器及重试次数
            if (!this.hasUnmount) {
                this.setState({
                    timer: timer,
                    times: this.state.times + 1,
                })
            }
        } else { // 超过最大次数，显示加载失败组件
            if (!this.hasUnmount) {
                this.setState({ mod: ErrorComponent })
            }
        }
    }

    render() {
        console.log('this.state.mod', this.state.mod)
        return this.props.children(this.state.mod)
    }
}

export default Bundle
