import React from 'react'

export default class Example extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            val: 0
        }
    }
    componentDidMount() {
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val ,'p') // 第 1 次 log
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val, 'p') // 第 2 次 log
        setTimeout(() => {
            this.setState({ val: this.state.val + 1 })
            console.log(this.state.val, 'p') // 第 3 次 log
            this.setState({ val: this.state.val + 1 })
            console.log(this.state.val, 'p') // 第 4 次 log
        }, 0)
    }
    render() {
        return null
    }
}
