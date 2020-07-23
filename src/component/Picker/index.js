import React from 'react';
import './index.less'
function swipeDirection (x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}
class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || true,
            data: [
                "夜的第一张", "夜的第二张", "夜的第三张", "夜的第四张", "夜的第五张", "夜的第六张", "夜的第八张",
            ],
            activeIndex: 0,

        }

    }

    static getDerivedStateFromProps(props) {
        return {
            ...props
        }
    }

    start = (e) => {
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }

    end = (e) => {
        this.endX = e.changedTouches[0].pageX;
        this.endY = e.changedTouches[0].pageY;
        const { data } = this.state
        const r = swipeDirection(this.startX, this.endX, this.startY, this.endY);
        let add = Math.floor(Math.abs(this.endY-this.startY)/30)
        const { onChange } = this.props;
        add = add === 0 ? 1 : add
        if(r === 'Up') {
            let index = this.state.activeIndex+add;
            index = index > data.length ? data.length : index;
            onChange && onChange(index)
            console.log(index, data[index])
            this.setState({
                activeIndex: index
            })
        }
        if(r === 'Down') {
            let index = this.state.activeIndex-add;
            index = index < 0 ? 0 : index;
            console.log(index, data[index])
            onChange && onChange(index)
            this.setState({
                activeIndex: index
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
        const { data, activeIndex } =this.state
        onChoose && onChoose(data[activeIndex], activeIndex)
        this.close()
    }




    render(){
        const { data, activeIndex, visible } =this.state
        console.log('render', this.state.activeIndex)
        let l = 2-activeIndex;
        if(!visible) return null
        return <div>
            <ul className="picker-header">
                <li onClick={this.close}>取消</li>
                <li onClick={this.choose}>确定</li>
            </ul>
            <div className="picker-all">
            <div className="absolute-item"></div>
            <div className="picker-con" style={{ height: data.length * 30 +'px', transform: `translate3d(0, ${l*30}px, 0)` }} onTouchStart={this.start} onTouchMove={this.move} onTouchEnd={this.end}>
                {
                    data.map(item => {
                        return <div key={item} className="picker-item">{item}</div>
                    })
                }
            </div>
        </div>
        </div>
    }
}

export default Picker
