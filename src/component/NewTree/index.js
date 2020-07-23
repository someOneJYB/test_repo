import React, { Component } from 'react';
import { mapChildren } from './util';

// 主要是收集 children 并打平
// function nodeToData(node, key, track, parentKey) {
//     let data = {
//         key,
//         childrenKeys: [],
//         parentKey,
//     }
//     track[key] = data;
//     let child = node.props.children;
//     mapChildren(child, (item, index) => {
//         data['childKey'].push(key + "-" + index);
//         return TreeNodeToData(item, key+"-"+index, track, key)
//     })
// }
// TreeNodeToData(treeNode, key, track, parentKey)
function TreeNodeToData(treeNode, key, track, parentKey) {
    // console.log(key)
    let data = {
        key,
        childKey: [],
        parentKey: parentKey,
    }
    if(!treeNode) return;
    track[key] = data;
    const { children } = treeNode.props;
    mapChildren(children, (item, index) => {
        data['childKey'].push(key + "-" + index);
        return TreeNodeToData(item, key+"-"+index, track, key)
    })
}
class Trees extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkedKeys: props.checkedKeys || [],
            halfCheckedKeys: props.halfCheckedKeys || [],
            expandedKeys: props.defaultExpandedKeys || []
        };
    }

    componentDidMount() {
        let nodeTrack = {};
        let { children } = this.props;
        console.log(children)
        children.map((item, index) => {
            TreeNodeToData(item, index+'', nodeTrack, null)
        })
        console.log(nodeTrack)
        // 所有的信息都在这里
        this.setState({
            nodeTrack: nodeTrack,
        })
    }

    onNodeClick = (halfCheckedKeys, checkedKeys) => {
        console.log(halfCheckedKeys, checkedKeys,'halfCheckedKeys, checkedKeys')
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

    renderChildren = (child, key) => {
        return React.cloneElement(child, {
            Key: key+'',
            initKey: child.key,
            isHalfChecked: this.state.halfCheckedKeys.includes(key+''),
            isChecked: this.state.checkedKeys.includes(key+''),
            isExpanded: this.state.expandedKeys.includes(child.key),
            halfCheckedKeys: this.state.halfCheckedKeys,
            checkedKeys: this.state.checkedKeys,
            expandedKeys: this.state.expandedKeys,
            keyEntities: this.state.nodeTrack,
            onNodeClick: this.onNodeClick,
            updateExpanded: this.updateExpanded,
            isSingle: !('children' in child.props)
        })
    }


    render() {
        const { children } = this.props;
        return (<div>
            {
                !Array.isArray(children) ? this.renderChildren(children, 0) : children.map((i, idex) => {
                    return this.renderChildren(i, idex)
                })
            }
        </div>)
    }
}
export default Trees
