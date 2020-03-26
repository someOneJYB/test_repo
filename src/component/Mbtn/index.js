import React from 'react';
export default function Btn(props) {
    return <Mbtn {...props} />
}
class Mbtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 1,
            num: 0,
            val: 0,
        }
    }
    componentDidMount() {
        this.setState({val: this.state.val + 1});
        console.log(this.state.val, 'first');    // 第 1 次 log

        this.setState({val: this.state.val + 1});
        console.log(this.state.val, 'second');    // 第 2 次 log
// 但是已经积累了
        setTimeout(() => {
            this.setState({val: this.state.val + 1});
            console.log(this.state.val, 'three');  // 第 3 次 log
// 异步更新执行 render
            this.setState({val: this.state.val + 1});
            console.log(this.state.val, 'four');  // 第 4 次 log
        }, 0);
    }
    componentWillUnmount() {
        console.log('unmount')
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps, prevState);
        return null
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('props', this.props, nextProps, nextContext)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log('should', nextProps, nextState, nextContext, this.props)
        return true
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log('williupdate', nextProps, nextState, this.props)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(this.props.num !== prevProps.num) {
            this.setState({
                a: this.state.a + 1,
            })
        }
        // console.log('didiupdate', prevProps, prevState, snapshot, this.props)
    }
    // click = () => {
    //     Promise.resolve().then(res => {
    //             this.setState({
    //                 num: 8
    //             })
    //             console.log('num', this.state.num)
    //     })
    // }

    render(){
        console.log('render', this.state.num)
        return <h1 onClick={this.click}>hahaha{this.props.text}</h1>
    }
}

// 生命周期的模仿写需要在 render
