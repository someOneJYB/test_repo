import React, { Component } from 'react';
import './index.less'

function addParentHalf(halfCheckedKeys, checkedKeys, track, key) {
    let node = track[key];
    let parent = node ? node.parentKey : null;
    console.log(parent, 'start', track[key], key)
    if(!parent) {
        return
    }

    if(track[parent].childKey.length) {
        for(let i = 0; i < track[parent].childKey.length; i++) {
            console.log(parent, 'parent')
            if(checkedKeys.includes(track[parent].childKey[i]) || halfCheckedKeys.includes(track[parent].childKey[i])) {
                halfCheckedKeys.push(parent)
                break;
            }
        }
        console.log(parent, '0-1parent')
        addParentHalf(halfCheckedKeys, checkedKeys, track, parent )
    }
}
function findParent(son, parentKey, track) {
    while(son.parentKey) {
        if(son.parentKey === parentKey) return true
        son = track[son.parentKey]
    }
    return false;
}

function findSon(parent, childKey, track) {
    if(!parent.childKey.length) return false;
    if(parent.childKey.include(childKey)) return true;
    for(let i = 0; i<parent.childKey.length;i++) {
        return findSon(parent.childKey[i], childKey, track)
    }
}
function addChildChecked(checkedKeys, key, node, track) {
    let ind = checkedKeys.indexOf(key);
    if(ind === -1) {
        checkedKeys.push(key)
    }
    if(node && node.childKey.length) {
        node.childKey.forEach(i => {
            addChildChecked(checkedKeys, i, track[i], track)
        })
    }
}
function removeChildChecked(checkedKeys, key, node, track) {
    let ind = checkedKeys.indexOf(key);
    checkedKeys.splice(ind, 1)
    if(node && node.childKey.length) {
        node.childKey.forEach(i => {
            removeChildChecked(checkedKeys, i, track[i], track)
        })
    }
}
function removeChildHalfChecked(checkedKeys, key, node, track) {
    let ind = checkedKeys.indexOf(key);
    checkedKeys.splice(ind, 1)
    if(node && node.childKey.length) {
        node.childKey.forEach(i => {
            removeChildHalfChecked(checkedKeys, i, track[i], track)
        })
    }
}

function removeParentHalfChecked(checkedKeys, key, node, track) {
    let ind = checkedKeys.indexOf(key);
    checkedKeys.splice(ind, 1)
    if(node && node.parentKey) {
        removeParentHalfChecked(checkedKeys, node.parentKey, track[node.parentKey], track)
    }
}
class TreeNode extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...props
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            ...this.state,
            ...nextProps,
        })
    }

    onNodeClick = (halfCheckedKeys, checkedKeys) => {
        this.setState({
            halfCheckedKeys,
            checkedKeys
        })
    }

    updateExpanded = (expandedKeys) => {
        this.setState({
            expandedKeys,
        })
    }

    renderChildren = (child={props:{}}, key) => {
        // console.log('render node', child)
        return React.cloneElement(child, {
            Key: key,
            initKey: child.key,
            isHalfChecked: this.state.halfCheckedKeys.includes(key),
            isChecked: this.state.checkedKeys.includes(key),
            isExpanded: this.state.expandedKeys.includes(child.key),
            halfCheckedKeys: this.state.halfCheckedKeys,
            checkedKeys: this.state.checkedKeys,
            expandedKeys: this.state.expandedKeys,
            keyEntities: this.state.keyEntities,
            onNodeClick: this.onNodeClick,
            updateExpanded: this.updateExpanded,
            isSingle: !('children' in child.props)
        })
    }

    onNodeClick = (halfCheckedKeys, checkedKeys) => {
        this.props.onNodeClick(halfCheckedKeys, checkedKeys)
    }

    renderChild = () => {
        const { children, Key } = this.props;
        if(!children) return null
        if(Array.isArray(children)){
            console.log(children)
            return children.map((item, index) => {
                return this.renderChildren(item, Key+'-'+index)
            })
        } else {
            return this.renderChildren(children, Key+'-'+0)
        }
    }


    sendExpand = () => {
        const { expandedKeys, initKey } = this.state;
        let index = expandedKeys.indexOf(initKey);
        if(index > -1) {
            expandedKeys.splice(index, 1);
            this.props.updateExpanded(expandedKeys)
        }else {
            expandedKeys.push(initKey)
            this.props.updateExpanded(expandedKeys)
        }

    }

    change = () => {
        // 点击判断当前是否是否被点击，同时孩子元素被选中，另外需要处理父亲元素是否需要处理为半选择的状态
        // 点击节点选中先把子节点从选中中删除，然后寻找父节点从半选状态中删除再遍历父节点作为半选状态
        let { Key, keyEntities, checkedKeys, halfCheckedKeys } = this.props;
        if(checkedKeys.indexOf(Key)> -1) {
            console.log('remove')
            removeChildChecked(checkedKeys, Key, keyEntities[Key], keyEntities);
            removeParentHalfChecked(halfCheckedKeys, Key, keyEntities[Key], keyEntities);
            removeChildHalfChecked(halfCheckedKeys, Key, keyEntities[Key], keyEntities);
            addParentHalf(halfCheckedKeys, checkedKeys, keyEntities, Key);
            let s = new Set(halfCheckedKeys)
            halfCheckedKeys = Array.from(s);
            return this.props.onNodeClick(halfCheckedKeys, checkedKeys)
        } else {
            addChildChecked(checkedKeys, Key, keyEntities[Key], keyEntities);
            addParentHalf(halfCheckedKeys, checkedKeys, keyEntities, Key);
            let s = new Set(halfCheckedKeys)
            halfCheckedKeys = Array.from(s);
            return this.props.onNodeClick(halfCheckedKeys, checkedKeys)
        }
    }


    render() {
        const { isExpanded, isChecked, isHalfChecked, isSingle } = this.state
        console.log(this.state.isHalfChecked, this.props, isChecked)
        return <div className={`tree-node ${isSingle ? 'single' :  ' '}`}>
            <div className={`angle ${isExpanded ? 'expand' :  ''}  ${isSingle ? '' :  'hasChild'}`} onClick={this.sendExpand}></div>
            <input className={`check-node ${isHalfChecked ? 'half-checked' :  ''} ${isChecked ? 'checked' :  ''}`} type="checkbox" onClick={this.change}/>
            <span>
                {this.state.title}
            </span>
            {
                isExpanded && this.renderChild()
            }
        </div>

    }
}
export default TreeNode
