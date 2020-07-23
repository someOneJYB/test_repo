/*
* 仅仅支持使用 TreeNode 作为子元素
* */

import React from 'react';
import TreeNode from './TreeNode';

function convertTreeToEntities(treeNode,key, entities, parentKey) {
    console.log(key, 'key---------')
    // 已经把对应的孩子和父亲key
    let entity = {
        key,
        childKey: [],
        parentKey: parentKey
    }

    entities[key] = entity;

    const { children } = treeNode.props;
    mapChildren(children, (item, index) => {
        entity['childKey'].push(key + "-" + index);
        return TreeNodeToData(item, key+"-"+index, entities, key)
    })
}

function mapChildren(children, f) {
    if(Array.isArray(children)) {
        return children.map((item, index) => f(item, index))
    }else if(children) {
        return f(children, "0");
    }

    return null;
}
// 找到父亲的 key 和放入对应的孩子的 key
function TreeNodeToData(treeNode,key, entities, parentKey) {
    // console.log(key)
    let entity = {
        key,
        childKey: [],
        parentKey: parentKey
    }

    entities[key] = entity;

    const { children } = treeNode.props;
    mapChildren(children, (item, index) => {
        entity['childKey'].push(key + "-" + index);
        return TreeNodeToData(item, key+"-"+index, entities, key)
    })
}


class Tree extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            halfCheckedKeys: props.halfCheckedKeys || [],
            checkedKeys: [],
            expandedKeys: props.defaultExpandedKeys || []
        })

        this.rendertreeNode = this.renderTreeNode.bind(this);
        this.onNodeClick = this.onNodeClick.bind(this);
        this.updateExpanded = this.updateExpanded.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        function shouldSetState(name) {
            return !(name in state);
        }
        let treeNodes = null,
            newState = {};
        if(shouldSetState('treeNodes')) {
            // 如果有 treeData 打平对象
            treeNodes = props.children;
            newState.treeNodes = treeNodes;
            const entities = {};
            for(let i = 0, len = treeNodes.length; i < len; i++) {
                const node = treeNodes[i];
                convertTreeToEntities(node, i + "", entities, null);
            }
            newState.keyEntities = entities;
            return newState;
        }

        return null;
    }


    renderTreeNode(child, key){
        console.log(child, 'llllll')
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

    onNodeClick(halfCheckedKeys, checkedKeys) {
        console.log(halfCheckedKeys, checkedKeys,'halfCheckedKeys, checkedKeys')
        this.setState({
            halfCheckedKeys,
            checkedKeys
        })
    }

    updateExpanded(expandedKeys) {
        this.setState({
            expandedKeys
        })
    }

    render() {
        // 自己形成的 react 的节点
        const { treeNodes } = this.state;
        console.log(treeNodes, 'expandedKeys: props.defaultExpandedKeys || []')
        return (
            <div>
                {treeNodes.map((item, index) => this.renderTreeNode(item, index + ""))}
            </div>
        )
    }
}

Tree.TreeNode = TreeNode;

export default Tree;
