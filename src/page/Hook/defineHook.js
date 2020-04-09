import React, { useState, useEffect } from 'react'
let changed = 0
export default function(titleId) {
    console.log('自定义的')
    const [title, setTitle] = useState(titleId)
    useEffect(() => {
        setTitle(`变化次数${++changed}`)
    }, [titleId])

    return <p>{title}</p>;
}
