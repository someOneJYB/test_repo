import React from 'react';
import TreeNode from "./TreeNode";

export function convertTreeToEntities(treeNode,key, entities, parentKey) {
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
        return convertTreeToEntities(item, key+"-"+index, entities, key)
    })
}

export function convertDataToTree(treeData) {
    let defaultExpanded = [];
    function dataToTree(treeData, node) {
        if(node.isExpanded) {
            defaultExpanded.push(node.key);
        }
        if(node.children.length === 0) {
            return (
                <TreeNode
                    title={node.title}
                    key={node.key}
                >

                </TreeNode>
            )
        }else {
            return (
                <TreeNode
                    title={node.title}
                    key={node.key}
                >
                    {node.children.map((key) => {
                        return dataToTree(treeData, treeData[key]);
                    })}
                </TreeNode>
            )
        }
    }
    let treeNode = Object.keys(treeData).map((key) => {
        let node = treeData[key];
        if(!node.parent) {
            return dataToTree(treeData, node);
        }
    })
    treeNode = treeNode.filter(item => item)
    return {treeNode, defaultExpanded};
}

export function mapChildren(children, f) {
    if(Array.isArray(children)) {
        return children.map((item, index) => f(item, index))
    }else if(children) {
        return f(children, "0");
    }

    return null;
}

export function arrAdd(arr, val) {
    let temp = [...arr];
    temp.push(val);

    return temp;
}

export function arrDel(arr, val) {
    let temp = [...arr];
    let index = temp.indexOf(val);

    if(index === -1) {
        return {isSuccess:false, arr:arr};
    }else {
        temp.splice(index, 1);
        return {isSuccess:true, arr:temp};
    }
}

export function conductCheck(clickKey, checkStatus, keyEntities) {
    console.log(clickKey, checkStatus, keyEntities, 'clickKey, checkStatus, keyEntities')
    const checkedKeys = {},
        halfCheckedKeys = {};
    (checkStatus.checkedKeys || []).forEach((key) => {
        checkedKeys[key] = true;
    });
    (checkStatus.halfCheckedKeys || []).forEach((key) => {
        halfCheckedKeys[key] = true;
    });
    console.log(checkedKeys, halfCheckedKeys, 'conduct')
    let conduct = (parentNode) => {
        let checked = true,
            halfChecked = false;
        let { childKey } = parentNode;
        // console.log(children)
        // 判断是否被点击halfChecked状态，否则设置为false
        console.log('parentNode.key', parentNode.key)
        if(childKey.length > 0) {
            mapChildren(childKey, (key) => {
                console.log(key, 'key')
                // 儿子被半选中的状态或者儿子是被选中的状态, 使用 checked 默认为true是因为需要把半选的状态设置为true
                if((key in checkedKeys && checkedKeys[key]) || (key in halfCheckedKeys && halfCheckedKeys[key])) {
                    console.log(key, 'key true')
                    halfChecked = true;
                }
                if(!(key in checkedKeys) || !checkedKeys[key]) {
                    // 不是激活太
                    checked = false;
                }
            })
        }else{
            return ;
        }
        // halfCheckedKeys 属性是做什么的，半选的定义是选择子元素之后，父亲元素被定义为半选状态
        halfCheckedKeys[parentNode.key] = halfChecked;
        checkedKeys[parentNode.key] = checked;
        console.log('parentNode.key', halfCheckedKeys, checkedKeys)
    }
    let conductDown = (currNode) => {
        // 取消是从第一个被取消开始的所以无论位置在哪里位置的被取消都无法阻止只要同一级别的元素是选中的就会让被选中
        let { childKey } = currNode;
        conduct(currNode);
        mapChildren(childKey, (key) => conductDown(keyEntities[key]));
    }

    let conductUp = (currNode) => {
        conduct(currNode);
        console.log(checkedKeys,
            halfCheckedKeys, 'checkedKeys = {},\n' +
            '        halfCheckedKeys = {};')
        if(currNode.parentKey) {
            // 处理半选的父元素
            conductUp(keyEntities[currNode.parentKey]);
        }
    }
    const currNode = keyEntities[clickKey];
    console.log(currNode)
    // 想上寻找父元素
    conductUp(currNode);
    // 向下寻找子元素
    conductDown(currNode);
// 找到处理到的半选的父亲元素，和被选择的元素
    let temp = {
        halfCheckedKeys: Object.keys(halfCheckedKeys).filter((item) => halfCheckedKeys[item]),
        checkedKeys: Object.keys(checkedKeys).filter((item) => checkedKeys[item])
    };
    console.log('temp', temp)
    return temp;
}
