import React from 'react';
import './index.less'

function swipeDirection (x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

const initActiveIndex = (vIndex, data) => {
    console.log('initActiveIndex', vIndex, data)
    let v = {};
    vIndex.forEach((i,idx) => {
        v[`activeIndex${idx}`] = data[idx].indexOf(data[idx].filter(i1  => i1.value === i)[0])
    })
    return v
}

class MultyPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || true,
            data: props.data || [
                [{label: "夜的第一张", value: "夜的第一张"}, { label: "夜的第二张", value: "夜的第二张"}, { label: "夜的第三张", value: "夜的第三张"}, { label: "夜的第四张", value: "夜的第四张"}, {label: "夜的第五张", value: "夜的第五张"}, {label: "夜的第六张", value: "夜的第六张"}, {label: "夜的第八张", value: "夜的第八张"}], [{label: "春", value: "春"}, {label: "夏", value: "夏"}, {label: "秋", value: "秋"}, {label: "冬", value: "冬"}]
            ],
            col: props.col || 1,
            valueIndex: [0, 0],
            value: props.value || ["夜的第一张", "春"]
        }

    }


    componentDidMount() {
        console.log(this.state.value, 'this.state.value')
        this.setState({
            ...initActiveIndex(this.state.value, this.state.data),
        })
    }

    static getDerivedStateFromProps(props, state) {
        if(props.data !==state.data && props.data) {
            let v = initActiveIndex(props.value, props.data)
            return {
                ...props,
                ...v,
            }
        }

    }

    start = (e) => {
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }

    getValue = () => {
        let index = []
        const { state } = this;
        const { data } = state
        data.forEach((i, idx) => {
            index.push(state[`activeIndex${idx}`])
        });
        return index
    }

    end = (e, ind) => {
        this.endX = e.changedTouches[0].pageX;
        this.endY = e.changedTouches[0].pageY;
        const { data, value } = this.state
        const r = swipeDirection(this.startX, this.endX, this.startY, this.endY);
        let add = Math.floor(Math.abs(this.endY-this.startY)/30)
        const { onChange } = this.props;
        add = add === 0 ? 1 : add
        console.log(r, data)
        if(r === 'Up') {
            let index = this.state[`activeIndex${ind}`]+add;
            console.log(data[ind])
            index = index >= data[ind].length ? data[ind].length-1 : index;
            console.log(ind, index, data[ind][index])
            onChange && onChange(ind, index, data[ind][index])
            value[ind] = data[ind][index]
            console.log('index',index, ind)
            this.setState({
                [`activeIndex${ind}`]: index,
                value: [...value]
            })
        }
        if(r === 'Down') {
            let index = this.state[`activeIndex${ind}`]-add;
            index = index <= 0 ? 0 : index;
            value[ind] = data[ind][index]
            console.log(ind, index, data[ind][index])
            onChange && onChange(ind, index, data[ind][index])
            this.setState({
                [`activeIndex${ind}`]: index,
                value: [...value],
            })
        }
    }

    close = () => {
        this.setState({
            visible: false,
        })
    }

    choose = () => {
        const { onChoose } = this.props;
        const { value } =this.state
        let b = this.getValue();
        console.log(b)
        onChoose && onChoose(this.getValue(), value)
        this.close()
    }

    render(){
        const { data, visible } =this.state
        console.log(this.state)
        if(!visible) return null
        return <div>
            <ul className="picker-header">
                <li onClick={this.close}>取消</li>
                <li onClick={this.choose}>确定</li>
            </ul>
            <div className="picker-all">
                <div className="absolute-item"></div>
                {
                    data.map((item,ind) => {
                        return(
                            <div key={ind} className="picker-con" style={{ height: data[ind].length * 30 +'px', transform: `translate3d(0, ${(2-this.state[`activeIndex${ind}`])*30}px, 0)` }} onTouchStart={(e) => this.start(e, ind)} onTouchEnd={(e) => this.end(e, ind)}>
                                {
                                    item.map(it => {
                                        return <div key={it.label} className="picker-item">{it.label}</div>
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    }
}

export default MultyPicker
