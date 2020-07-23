import React, { Component } from 'react'
import './index.less'

class Vertical extends Component {
    constructor(props) {
        super(props)
        this.timer =  null;
        this.state ={
            activeIndex: 0,
        }
    }


    start = ()  => {
        const { auto, duration } = this.props
        setTimeout(()=>{auto && this.autoPlay()}, duration*1000*3.5)
    }

    componentDidMount() {
        const { auto } = this.props
        auto && this.autoPlay()
    }

    touchStart = (e) => {
        this.clearTimer()
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }

    componentWillUnmount() {
        this.clearTimer()
    }

    autoPlay = () => {
        this.stop = false;
        const { duration } = this.props;
        if(window.requestAnimationFrame) {
            return this.timer = requestAnimationFrame(this.playWithRaf)
        }else {
            this.timer = setInterval(()=>{this.playInterVal()}, duration*1000*3)
        }
    }

    addIndex = (width, length, duration) => {
        let { activeIndex, direction } = this.state;
        const durationTime = duration*0.8*1000
        if(activeIndex === length-2) {
            activeIndex++
            this.setState({
                activeIndex: activeIndex,
                direction: -(activeIndex+1)*width+'px',
                extraStyle: {}
            },() => {
                setTimeout(()=>{
                    this.setState({
                        direction: '0px',
                        extraStyle: {
                            transition: 'none',
                            transform: 'translateY(0)'
                        }
                    }, ()=>this.start())
                }, durationTime)
            })
            return

        } else {
            ++activeIndex;
            activeIndex = activeIndex > length-1 ? 0: activeIndex;
            if(activeIndex === 0)  {
                if(parseInt(direction) === 0) {
                    this.setState({
                        activeIndex: activeIndex,
                        direction: -(activeIndex+1)*width+'px',
                        extraStyle: {}
                    },()=>this.start())
                } else {
                    this.setState({
                        activeIndex: activeIndex,
                        direction: `${-(length+1)*width}px`,
                        extraStyle: {}
                    }, () => {
                        setTimeout(()=>this.setState({
                            extraStyle: {
                                transition: 'none',
                                transform: `translateY(${-(1)*width}px)`
                            }
                        }, ()=>this.start()), durationTime)
                    })
                }
                return
            } else {
                this.setState({
                    activeIndex: activeIndex,
                    direction: -(activeIndex+1)*width+'px',
                    extraStyle: {}
                }, ()=>this.start())
            }

        }
    }


    minusIndex = (width, length, duration) => {
        let { activeIndex } = this.state;
        const durationTime = duration*0.8*1000
        if (activeIndex === 0) {
            activeIndex = length -  1;
            this.setState({
                activeIndex,
                direction: '0px',
                extraStyle: {}
            }, ()=> setTimeout(
                () => this.setState({
                    activeIndex,
                    direction: `${-(length) * width}px`,
                    extraStyle: {
                        transition: 'none',
                        transform: `translateY(${-(length) * width + 'px'})`
                    }
                }, () => this.start()), durationTime));
            return;
        } else {
            activeIndex--
            activeIndex = activeIndex < 0 ? 0 : activeIndex;
            this.setState({
                activeIndex,
                extraStyle: {},
                direction: -(activeIndex+1)*width+'px'
            }, ()=>{
                this.start();
            })
        }
    }

    playWithRaf = () => {
        if(this.stop) return
        let { height, imageList, duration } = this.props
        height = parseInt(height);
        clearTimeout(this.excute)
        this.excute = setTimeout(()=>{
            this.addIndex(height, imageList.length, duration)
        }, duration*5000)
    }


    playInterVal = () => {
        if(this.stop) return
        let { activeIndex } = this.state;
        let { width, imageList } = this.props
        width = parseInt(width);
        console.log(activeIndex)
        if(0 <= activeIndex  <=  imageList.length) {
            activeIndex++
        }
        if(activeIndex === imageList.length+1) {
            this.setState({
                activeIndex: 0,
                extraStyle: {
                    transition: 'none',
                    transform: 'translateY(0)'
                }
            }, ()=>this.start())
            return;
        }

        this.setState({
            activeIndex,
            extraStyle: {},
            direction: -activeIndex*width+'px'
        },()=>this.start())
    }

    clearTimer = () => {
        clearTimeout(this.excute);
        this.stop = true;
        // console.log(this.stop)
        if(!window.cancelAnimationFrame) {
            clearInterval(this.timer)
        } else {
            cancelAnimationFrame(this.timer)
        }
    }

    goto =  (index) => {
        // this.clearTimer()
        // let { width } = this.props
        // width = parseInt(width);
        // this.setState({
        //     activeIndex: index,
        //     direction: -index*width+'px',
        //     extraStyle: {}
        // },()=>{
        //     this.start()
        // })
    }

    touchEnd = (e) => {
        this.clearTimer()
        let { height, imageList, duration } = this.props
        const length = imageList.length
        this.endX = e.changedTouches[0].pageX;
        this.endY = e.changedTouches[0].pageY;
        const r = this.swipeDirection(this.startX, this.endX, this.startY, this.endY);
        height = parseInt(height);
        console.log(r)
        if(r === "Up") {
            return this.minusIndex(height, length, duration)
        }
        if(r === "Down") {
            return this.addIndex(height, length, duration)
        }
    }



    swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');

    }



    render() {
        let { imageList = [], parentClass = '', height, width, dot, duration } = this.props;
        width = parseInt(width);
        height = parseInt(height)
        const length =  imageList.length
        const { direction = -height*(this.state.activeIndex+1)+'px', extraStyle =  {}, activeIndex } = this.state;

        const item = imageList[imageList.length - 1]
        const item1 =  imageList[0]
        const style = { height: parseInt(height)+'px', width: parseInt(width)+'px' }
        return (
            <div className={`con  ${parentClass}`} style={style} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} onTouchCancel={this.touchCancel}>
                <div className="bag-v"
                     style={{ height: parseInt(height)*(length+2)+'px', transition: `transform ${duration}s ease-out`, transform: `translateY(${direction})`, ...extraStyle}}>
                    <div key={imageList.length} className={`son  ${item.classy}`} style={{ backgroundImage:`url(${item.url})`, ...item.style, height, width }}>{item.children || null}</div>
                    {
                        imageList.map(({ url = '', style = {}, classy = '', children = '' }, index) => {
                            return <div key={url ||  index} className={`son  ${classy}`} style={{ backgroundImage:`url(${url})`, ...style, height, width}}>{children}</div>
                        })
                    }
                    <div key={-1} className={`son  ${item1.classy}`} style={{ backgroundImage:`url(${item1.url})`, ...item1.style, height, width}}>{item1.children || null}</div>
                </div>
                {
                    dot &&  <ul className="dot-con-v">
                        {
                            imageList.map((item, index) => {
                                return <li onClick={e => this.goto(index)} key={index} className={`dot ${activeIndex%length === index ? 'active' : ''}`}></li>
                            })
                        }
                    </ul>
                }
            </div>
        )
    }
}

export default Vertical
