import React from 'react';
import {
    Node,
    CheckBox,
    Item,
    Triangle,
    Show
} from './style'
import {
    mapChildren,
    conductCheck,
    arrAdd,
    arrDel
} from './util';

class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.myShow = React.createRef();

        this.onNodeClick = this.onNodeClick.bind(this);
        this.onSwitcherClick = this.onSwitcherClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            showHeight:this.myShow.current.clientHeight,
            nodeHeight:this.myShow.current.clientHeight
        })
    }

    renderTreeNode(child, key){
        return React.cloneElement(child, {
            key,
            Key: key,
            initKey: child.key,
            isHalfChecked: this.props.halfCheckedKeys.includes(key),
            isChecked: this.props.checkedKeys.includes(key),
            isExpanded: this.props.expandedKeys.includes(child.key),
            halfCheckedKeys: this.props.halfCheckedKeys,
            checkedKeys: this.props.checkedKeys,
            expandedKeys: this.props.expandedKeys,
            keyEntities: this.props.keyEntities,
            onNodeClick: this.props.onNodeClick,
            updateExpanded: this.props.updateExpanded,
            isSingle: !('children' in child.props)
        })
    }

    renderSwitcher() {
        return (
            <Triangle
                onClick = {this.onSwitcherClick}
                isSingle = {this.props.isSingle}
                isExpanded = {this.props.isExpanded}
            ></Triangle>
        )
    }

    onNodeClick() {
        console.log('onNodeClick')
        console.log(this.props.keyEntities[this.props.Key],this.props.keyEntities,this.props.Key)
        let halfCheckedKeys = arrDel(this.props.halfCheckedKeys, this.props.Key).arr,
            checkedKeys = [...(this.props.checkedKeys)];
        // 如果父亲的被点击则全体子元素被选中
        let addNodeChild = (parentNode) => {
            console.log(checkedKeys, parentNode.key, 'hahaha', this.props.keyEntities)
            checkedKeys = arrAdd(checkedKeys, parentNode.key);
            parentNode.childKey.forEach((key) => {
                console.log(this.props.keyEntities, key, 'jih')
                addNodeChild(this.props.keyEntities[key]);
            })
        }
        // 从被选中的状态中移除
        let delNodeChild = (parentNode) => {
            checkedKeys = arrDel(checkedKeys, parentNode.key).arr;
            halfCheckedKeys = arrDel(halfCheckedKeys, parentNode.key).arr;
            parentNode.childKey.forEach((key) => {
                delNodeChild(this.props.keyEntities[key]);
            })
        }

        let delNodeParent = (node) => {
            checkedKeys = arrDel(checkedKeys, node.key).arr;
            if(node.parentKey) {
                delNodeParent(this.props.keyEntities[node.parentKey])
            }
        }



        if(checkedKeys.includes(this.props.Key)) {
            // 选中状态取消选中
            console.log('取消选中')
            delNodeChild(this.props.keyEntities[this.props.Key]);
            delNodeParent(this.props.keyEntities[this.props.Key]);
        }else {
            // 选中状态
            console.log('选中', this.props.Key)
            addNodeChild(this.props.keyEntities[this.props.Key]);
        }
console.log(checkedKeys, halfCheckedKeys, 'checkedKeys, halfCheckedKey')
        const checkStatus = {checkedKeys, halfCheckedKeys};
        const checkedStatus = conductCheck(this.props.Key, checkStatus, this.props.keyEntities);
        this.props.onNodeClick(checkedStatus.halfCheckedKeys, checkedStatus.checkedKeys);
    }

    onSwitcherClick() {
        let expandedKeys;
        if(this.props.expandedKeys.includes(this.props.initKey)) {
            expandedKeys = arrDel(this.props.expandedKeys, this.props.initKey).arr;
        }else {
            expandedKeys = arrAdd(this.props.expandedKeys, this.props.initKey);
        }
        this.props.updateExpanded(expandedKeys);
    }

    renderCheckbox() {
        return (
            <CheckBox
                isChecked = {this.props.isChecked}
                isHalfChecked = {this.props.isHalfChecked}
                onChange = {() => this.onNodeClick(this)}
            ></CheckBox>
        )
    }

    renderItem() {
        return (
            <Item>
                {this.props.title}
            </Item>
        );
    }

    renderChildren() {
        const { children, Key } = this.props;
        // console.log(children)
        // 在这里处理 父亲key+自身的索引，从而获得对应 key 处理到
        return (
            <Show
                isExpanded = {this.props.isExpanded}
                ref={this.myShow}
            >
                {mapChildren(children,(item, index) => this.renderTreeNode(item, Key+"-"+index))}
            </Show>
        );
    }

    render() {
        console.log(this.props.keyEntities, 'this.props.keyEntities')
        return (
            <Node>
                {this.renderSwitcher()}
                {this.renderCheckbox()}
                {this.renderItem()}
                {this.renderChildren()}
            </Node>
        )
    }
}

export default TreeNode;
