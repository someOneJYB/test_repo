import React, { Component } from 'react'
import './index.less'
/*
* 缓动数据：动画 transition 的的一半是延迟展示的时间
* */
class SliderPic extends Component {
   constructor(props) {
       super(props)
       this.timer =  null;
       this.state ={
           activeIndex: 1,
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
            this.timer = setInterval(()=>{this.playInterVal()}, duration*1000*1.1)
        }
   }

   playWithRaf = () => {
       if(this.stop) return
       const { auto } = this.props
       let { activeIndex } = this.state;
       let { width, imageList } = this.props
       width = parseInt(width);
       console.log(activeIndex, this.stop)
       if(0 <= activeIndex  <=  imageList.length) {
           activeIndex++
       }
       if(activeIndex === imageList.length+1) {
           this.setState({
               activeIndex: 0,
               extraStyle: {
                   transition: 'none',
                   transform: 'translate(0)'
               }
           })
           // 在0的时候特殊处理
           setTimeout(()=>{auto && this.autoPlay()}, 0)
           return;
       }

       this.setState({
           activeIndex,
           extraStyle: {},
           direction: -activeIndex*width+'px'
       }, ()=>this.start())
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
                   transform: 'translate(0)'
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
       this.stop = true;
       console.log(this.stop)
       if(!window.cancelAnimationFrame) {
           clearInterval(this.timer)
       } else {
           cancelAnimationFrame(this.timer)
       }
   }

   goto =  (index) => {
       this.clearTimer()
       let { width } = this.props
       width = parseInt(width);
       this.setState({
           activeIndex: index,
           direction: -index*width+'px',
           extraStyle: {}
       },()=>{
           this.start()
       })
   }

   touchEnd = (e) => {
       this.clearTimer()
       let { activeIndex } = this.state;
       let { width, imageList, duration } = this.props
       const length = imageList.length
       this.endX = e.changedTouches[0].pageX;
       this.endY = e.changedTouches[0].pageY;
       const r = this.swipeDirection(this.startX, this.endX, this.startY, this.endY);
       width = parseInt(width);
       if(r === "Right") {
           activeIndex--
           if(activeIndex === 0) {
               this.setState({
                   activeIndex: 0,
                   direction: '0px',
                   extraStyle: {}
               },() => {
                   setTimeout(()=>this.setState({
                       activeIndex: imageList.length,
                       extraStyle: {
                           transition: 'none',
                           transform: `translate(${-(imageList.length)*width+'px'})`
                       }
                   }, ()=>this.start()), duration*0.8*1000)
               })

           } else {
               activeIndex = activeIndex < 0 ? 0 : activeIndex
               if(activeIndex ===  0) {
                   console.log(r)
                   setTimeout(()=>this.setState({
                       activeIndex: imageList.length-1,
                       extraStyle: {
                           transition: 'none',
                           transform: `translate(${-(imageList.length-1)*width+'px'})`
                       }
                   }, ()=>this.start()), 0)
                   return
               }
               this.setState({
                   activeIndex,
                   extraStyle: {},
                   direction: -activeIndex*width+'px'
               }, ()=>this.start())
           }
       }
       if(r === "Left") {
           if(activeIndex === imageList.length-1) {
               this.setState({
                   activeIndex: ++activeIndex,
                   direction: -activeIndex*width+'px',
                   extraStyle: {}
               },() => {
                   setTimeout(()=>this.setState({
                       activeIndex: 0,
                       extraStyle: {
                           transition: 'none',
                           transform: 'translate(0)'
                       }
                   }), duration*0.8*1000)
               })

           } else {
               ++activeIndex;
               activeIndex = activeIndex > length ? length - 1 : activeIndex
               this.setState({
                   activeIndex: activeIndex,
                   direction: -activeIndex*width+'px',
                   extraStyle: {}
               })
           }
       }
   }



    swipeDirection (x1, x2, y1, y2) {
        if (Math.abs(x1 - x2) > 80) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
        } else {
            return 'Nochange';
        }

    }



    render() {
       let { imageList = [], parentClass = '', height, width, dot, duration } = this.props;
       width = parseInt(width);
       height = parseInt(height)
       const length =  imageList.length
       const { direction = -width*this.state.activeIndex+'px', extraStyle =  {}, activeIndex } = this.state;

       const item = imageList[0]
       const item1 = imageList[imageList.length - 1]
       const style = { height: parseInt(height)+'px', width: parseInt(width)+'px' }
       return (
           <div className={`con  ${parentClass}`} style={style} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} onTouchCancel={this.touchCancel}>
               <div className="bag" style={{ width: parseInt(width)*length+'px', transition: `transform ${duration}s ease-out`, transform: `translateX(${direction})`, ...extraStyle}}>
                {
                    imageList.map(({ url = '', style = {}, classy = '' }, index) => {
                        return <div key={url ||  index} className={`son  ${classy}`} style={{ backgroundImage:`url(${url})`, ...style, width,}}></div>
                    })
                }
                   <div key={item.url ||  imageList.length} className={`son  ${item.classy}`} style={{ backgroundImage:`url(${item.url})`, ...item.style, width,}}></div>
               </div>
               {
                   dot &&  <ul className="dot-con">
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

export default SliderPic
