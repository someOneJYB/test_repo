import React from 'react';
import Counter from '../Counter'
import './index.less';
import zr from '../../images/zr.png'
import edit from '../../svg/edit.svg'
import Calender from '../../component/Calender'
import Picker from '../../component/Picker'
import MultyPicker from '../../component/Picker/MultiPicker'
import CityPicker from '../../component/Picker/CityPicker'
import Tree from '../../component/Tree/Tree'
import Tr from '../../component/NewTree'
import Node from '../../component/NewTree/node'
import CustomIcon from '../../component/CustomIcon'
import { Button } from 'antd'
import  uniq from 'lodash/uniq'
import Drag from '../../component/Dragable'
console.log(Tr)
const { TreeNode } = Tree;
export class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          change: true,
          show: true,
          data: [
              {
                  label: "辽宁",
                  value: "辽宁",
                  children: [
                      {
                          label: "阜新",
                          value: "阜新",
                          children: [
                              {
                                  label: "阜蒙县",
                                  value: "阜蒙县",
                              },{
                                  label: "长春401",
                                  value: "长春4652",
                              }
                          ],
                      },
                      {
                          label: "长春41",
                          value: "长春4652",
                          children: [
                              {
                                  label: "长春78",
                                  value: "长春78",
                                  children: [
                                      {
                                          label: "阜蒙455县",
                                          value: "阜蒙345r4县",
                                      },{
                                          label: "长r4r春41",
                                          value: "长春frfgrf4652",
                                      }
                                  ],
                              },{
                                  label: "长春41",
                                  value: "长春4652",
                                  children: [
                                      {
                                          label: "阜蒙32eddef3县",
                                          value: "阜33dd蒙县",
                                      },{
                                          label: "2234长春41",
                                          value: "nfknvi长春4652",
                                      }
                                  ],
                              }
                          ],
                      }
                  ],
              },
              {
                  label: "吉林",
                  value: "吉林",
                  children: [
                      {
                          label: "长春",
                          value: "长春",
                          children: [
                              {
                                  label: "长春7678",
                                  value: "长春7898",
                              },
                              {
                                  label: "长春412",
                                  value: "长春124652",
                              }
                          ],
                      },{
                          label: "长春57hjj1",
                          value: "长春5jj2",
                          children: [
                              {
                                  label: "长春738",
                                  value: "长春758",
                              },
                              {
                                  label: "长春4113",
                                  value: "长春4652",
                              }
                          ],
                      }
                  ],
              },
              {
                  label: "辽神经宁",
                  value: "辽神经宁",
                  children: [
                      {
                          label: "很多歌阜新",
                          value: "阜返回日本呢新",
                          children: [
                              {
                                  label: "阜我今日发蒙县",
                                  value: "阜吃恶化蒙县",
                              },{
                                  label: "长春4黑我哈1",
                                  value: "长春4发聂风652",
                              }
                          ],
                      },
                      {
                          label: "长春无任41",
                          value: "长春南",
                          children: [
                              {
                                  label: "长春7如8",
                                  value: "长春发聂好78",
                                  children: [
                                      {
                                          label: "133金额",
                                          value: "阜蒙345r4县",
                                      },{
                                          label: "长纷纷r4r春41",
                                          value: "长春",
                                      }
                                  ],
                              },
                              {
                                  label: "jkgh金额",
                                  value: "蒙345r4县",
                              },
                              {
                                  label: "长春你1",
                                  value: "长春啊",
                                  children: [
                                      {
                                          label: "阜哦县",
                                          value: "阜33dd蒙县",
                                      },{
                                          label: "再来",
                                          value: "nk春4652",
                                      }
                                  ],
                              }
                          ],
                      }
                  ],
              },
              {
                  label: "西安",
                  value: "西安",
                  children: [
                      {
                          label: "不知道",
                          value: "位置",
                          children: [
                              {
                                  label: "奇葩",
                                  value: "脾气啊哈",
                              },{
                                  label: "我白",
                                  value: "我猜哪期",
                              }
                          ],
                      },
                      {
                          label: "很奇怪",
                          value: "很大声",
                          children: [
                              {
                                  label: "这会打败你",
                                  value: "你哈",
                                  children: [
                                      {
                                          label: "呵呵呵",
                                          value: "呵呵呵",
                                      },{
                                          label: "预期",
                                          value: "长区域",
                                      }
                                  ],
                              },{
                                  label: "长春你的海",
                                  value: "长气氛好",
                                  children: [
                                      {
                                          label: "哈克了",
                                          value: "你嘴里",
                                      },{
                                          label: "大咸阳1",
                                          value: "我不知",
                                      }
                                  ],
                              }
                          ],
                      }
                  ],
              },
              {
                  label: "辽123e宁",
                  value: "cerqs辽宁",
                  children: [
                      {
                          label: "3rtg4t阜新",
                          value: "mkmgv阜新",
                          children: [
                              {
                                  label: "rogo5阜蒙县",
                                  value: "oiorkmf阜蒙县",
                              },{
                                  label: "434长春41",
                                  value: "00长春4652",
                              }
                          ],
                      },
                      {
                          label: "长jgfogj春41",
                          value: "长nvjrnvnv春4652",
                          children: [
                              {
                                  label: "9094039长春78",
                                  value: "bjcbfub长春78",
                                  children: [
                                      {
                                          label: "i4jr08阜蒙455县",
                                          value: "345r4县",
                                      },{
                                          label: "长r4r春41",
                                          value: "4652",
                                      }
                                  ],
                              },{
                                  label: "春41",
                                  value: "长9032",
                                  children: [
                                      {
                                          label: "阜蒙",
                                          value: "阜县",
                                      },{
                                          label: "2234长434",
                                          value: "nfknv2",
                                      }
                                  ],
                              }
                          ],
                      }
                  ],
              },
          ],
          value: [],
      }
  }
    componentWillMount() {
        console.log('will app')
    }
  componentDidMount() {
      console.log('app didmount')
  }

  D = (val) => {
      this.setState({
          value: [val[0].value, val[1].value, val[2].value]
      })
  }

    P = (val) => {
        console.log(val, 'P')
        this.setState({
            value: [val.value]
        })
    }

    C = (val) => {
        this.setState({
            value: [val[0].value, val[1].value]
        })
    }
  click = () => this.setState({
      show: true
  })

    render() {
        console.log(this.state.show)
    return (
        <div className="App">
            {/*<Modal show={this.state.show} cancel={()=>{this.setState({*/}
            {/*    show: false*/}
            {/*})}}/>*/}
            {/*<Calender/>*/}
            <Tr defaultExpandedKeys = {["one"]}>
                <Node title="0" key="one">
                    <Node title="0-0" key="one-0"/>
                    <Node title="0-1" key="one-1">
                        <Node title="0-1-0" key="one-1-0">
                            <Node title="0-1-0-0" key="one-1-0-0"/>
                        </Node>
                        <Node title="0-1-1" key="one-1-1"></Node>
                        <Node title="0-1-2" key="one-1-2"></Node>
                    </Node>
                    <Node title="0-2" key="one-2"></Node>
                </Node>
                <Node title="1" key="two">
                    <Node title="1-0" key="two-0">
                        <Node title="1-0-0" key="two-0-0">
                            <Node title="1-0-0-0" key="two-0-0-0"></Node>
                        </Node>
                    </Node>
                </Node>
                <Node title="2" key="three"></Node>
            </Tr>
            {/*<Picker/>*/}
            {/*<MultyPicker/>*/}
            <CityPicker value={this.state.value} data={this.state.data} onDistrictChange={this.D} onCityChange={this.C} onProvinceChange={this.P}/>
            <button onClick={this.click}>点击我吧改变莫太狂</button>
            <div className="box" style={{height: '500px', width: '500px', position: 'relative'}}>
                <Drag bounds="parent">
                    <div className="box">
                        I can only be moved within my offsetParent.<br /><br />
                        Both parent padding and child margin work properly.
                    </div>
                </Drag>
                <Drag bounds="parent">
                    <div className="box">
                        I also can only be moved within my offsetParent.<br /><br />
                        Both parent padding and child margin work properly.
                    </div>
                </Drag>
            </div>
            <Btn/>
            <Drag zIndex={100}>
                <div className="box">I can be dragged anywhere</div>
            </Drag>
        </div>)
  }

}
class Btn extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            a: {
                d: 3
            }
        }
    }
    componentWillMount() {
        console.log('will btn')
    }

    componentDidMount() {
        console.log('app didmount btn')
    }
    set = () => {
        const { a } = this.state;
        a.d =  89
        this.setState({
            a: a,
        })
    }
    render() {
        console.log('render', this.state)
        return <h1 onClick={this.set}>123</h1>
    }
}

export default App

