import React from 'react';
import ReactDOM from 'react-dom';

class OldPortal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
        }
    }

    // 初始化时根据show属性来判断是否渲染
    componentDidMount() {
        const { show } = this.props
        if (show) {
            this.renderPortal(this.props);
        }
    }

    // 每次接受到props进行渲染与卸载操作
    componentWillReceiveProps(nextProps, nextContext) {
        const { show } = nextProps
        if (show) {
            this.renderPortal(this.props);
        } else {
            this.closePortal()
        }
    }

    // 渲染
    renderPortal(props) {
        this.remove = false
        if (!this.node) {
            // 防止多次创建node
            this.node = document.createElement('div');
        }
        // 将当前node添加到body中
        document.body.appendChild(this.node);

        ReactDOM.unstable_renderSubtreeIntoContainer(
            this,           // 上下文指定当前的实例
            props.children, // 渲染的元素为当前的children
            this.node,      // 将元素渲染到我们新建的node中,这里我们不使用第四个参数回调.
        );
    }

    // 卸载
    closePortal() {
        if(this.remove) return
        if (this.node) {
            this.remove = true
            // 卸载元素中的组件
            ReactDOM.unmountComponentAtNode(this.node)
            // 移除元素
            document.body.removeChild(this.node)
        }
    }

    render() {
        console.log('执行 potral', this.props)
        return null;
    }
}

export default OldPortal
