import React, { useEffect, useRef } from 'react'
// 获取上一轮的 props 或 state
// 访问DOM节点，或者React元素
// 保持可变变量
export default function usePrevious (value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}
