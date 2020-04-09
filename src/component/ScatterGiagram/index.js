import React, { Component } from 'react';
// import { Toast } from 'react-maodou-design-mobile'
import { connect } from 'react-redux'
import {
    ScatterChart, Scatter, ZAxis, XAxis, YAxis, ReferenceLine, ReferenceDot, Cell, ResponsiveContainer, Tooltip, LabelList,
} from 'recharts';
// import CustomizedCursor from './CustomizedCursor'
import './index.less';

const data = [
    { x: 0.3, y: 1.2, city: '东北大区' },
    { x: 0.6, y: 0.8, city: '东北大区' },
    { x: 0.23, y: 0.3, city: '东北大区' },
    { x: 0.7, y: 2.0, city: '东北大区' },
    { x: 0.2, y: 1.5, city: '中国' },
];
const CustomTooltip = ({ active, payload }) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">转化率 : <span className="tooltip-number">{`${payload[0].value}`}</span></p>
                <p className="label">人效 : <span className="tooltip-number">{`${payload[1].value}`}</span></p>
            </div>
        );
    }

    return null;
};
const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value == '中国') {
        return (
            <g>
                <rect x={x + width * 2} y={y - height} width={10 * value.length} height={15} stroke="#FF7040" fill={'rgba(0,0,0,0)'} />
                <text x={x + width * 2 + 5 * value.length} y={y - height + 7.5} fill="#FF7040" textAnchor="middle" dominantBaseline="middle">{value}</text>
            </g>
        )
    } else {
        return <text x={x + width * 2} y={y + height} fill="#8097C0">{value}</text>
    }
};
// 客户档案详情
class ScatterGiagram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 默认开启loading
            showMore: false,
        };
    }

    componentDidMount() {
        // const { match = {}, dispatch } = this.props;
        // let params = {}
        this.setState({
            loading: true,
        })
    }

    render() {
        // const colors = ['#4184F4', '#FF7040']
        return (
            <div className="giagram">
                <div className="giagram-title">能力诊断概览</div>
                <ResponsiveContainer width="90%" height="90%">
                    <ScatterChart
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                        <ReferenceLine alwaysShow={true} x={0.9} stroke="#919199" strokeDasharray="3 3" />
                        <ReferenceLine label={'目标线：20年Q2目标线'} alwaysShow={true} y={2.4} stroke="#919199" strokeDasharray="3 3" />
                        <ReferenceDot
                            x={0.9}
                            y={2.4}
                            r={2}
                            // alwaysShow={true}
                            fill="#919199"
                            stroke="#919199"
                            // label={'目标线：20年Q2目标线'}
                        />
                        {/* <Label position={'top'} value="目标线：20年Q2目标线" /> */}
                        <XAxis
                            type="number"
                            stroke="rgba(148,169,205,0.80)"
                            mirror={false}
                            domain={[0, 0.9]}
                            minTickGap={0.05}
                            interval={0}
                            tickCount={18}
                            allowDataOverflow={true}
                            dataKey="x"
                            name="转化率"
                        />
                        <YAxis
                            type="number"
                            stroke="rgba(148,169,205,0.80)"
                            mirror={true}
                            domain={[0, 2.4]}
                            minTickGap={0.2}
                            interval={0}
                            tickCount={12}
                            allowDataOverflow={true}
                            dataKey="y"
                            name="人效"
                        />
                        <ZAxis dataKey="z" range={[30, 30]} />
                        {/* <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            itemStyle={{ color: 'red', border: '1px solid yellow' }}
                            wrapperStyle={{ border: '1px solid green' }}
                            contentStyle={{ color: 'red', border: '1px solid red' }}
                        /> */}
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Scatter data={data} fill="rgba(81,143,254,0.60)">
                            {
                                data.map((entry, index) => {
                                    if (entry.city == '中国') {
                                        return (<Cell key={`cell-${index}`} fill={'#FF7040'} />)
                                    } else {
                                        return (<Cell key={`cell-${index}`} fill={'#4184F4'} />)
                                    }
                                })
                            }
                            <LabelList dataKey="city" position={'right'} fill="#8097C0" content={renderCustomizedLabel} />
                        </Scatter>
                        {/* <Scatter name="A school" data={data} fill="rgba(81,143,254,0.60)">
                            <LabelList dataKey="city" position={'right'} fill="#8097C0" />
                        </Scatter> */}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

function update(store) {
    return {}
}

export default connect(update)(ScatterGiagram);
