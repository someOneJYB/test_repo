export function mapChildren(child, cb) {
    console.log('lemg', child)
    if(Array.isArray(child)) {
        child.map((i, idx) => {
            cb(i, idx)
        })
    } else {
        cb(child, 0)
    }
}
