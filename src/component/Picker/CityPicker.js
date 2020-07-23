import React from 'react';
import MultiPicker from './MultiPicker';
import './index.less'
/*
* 面向省市区：data 传递的省市区 onProvinceChange onCityChange onDistrictChange value 必穿参数
* */
class cityPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || [],
            data: props.data || [],
        }

    }

    componentDidMount() {
        this.initValue()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            value: nextProps.value,
            data: nextProps.data,
        }, ()=>this.initValue())
    }


    getProvince = (province) => {
        let v = this.props.data.filter(i => i.value === province)[0];
        return v ? v : this.props.data[0];
    }


    getCity = (provinces, city) => {
        let v =  provinces.children.filter(i => i.value === city)[0];
        return v ? v : provinces.children[0];
    }


    getDistrict = (city, district) => {
        let v =  city.children.filter(i => i.value === district)[0];
        return v ? v : city.children[0];
    }



    initValue = () => {
        const { data, value } = this.state;
        let v1 = this.getProvince(value[0]);
        let v2 = this.getCity(v1, value[1]);
        let v3 = this.getDistrict(v2, value[2]);
        this.setState({
            city: [data, v1.children, v2.children],
            value: [v1.value, v2.value, v3.value]
        })
    }


    change = (ind, index, value) => {
        const { data } = this.state;
        const { onProvinceChange, onCityChange, onDistrictChange } = this.props
        // 省发生变化
        if(ind === 0) {
            // let d11 = data.map(i => {
            //     return {
            //         label: i.label,
            //         value: i.value,
            //         ...i,
            //     }
            // });
            let d1 = data.filter(i => i.value === value.value);
            // 城市发生变化
            onProvinceChange && onProvinceChange(d1[0])
            // this.setState({
            //     value: [d1[0].value]
            // })
            // console.log(d11, d11[0].children, d11[0].children[0].children, 'jierhiehrihr')
            // this.setState({
            //     city: [d11, d1[0].children, d1[0].children[0].children],
            //     value: [d1[0].value, d1[0].children[0].value, d1[0].children[0].children[0].value]
            // })
            return;
        }
        if(ind === 1) {
            let d1 = data.filter(i => i.value === this.state.value[0]);
            let d2 = d1[0].children.filter(i => i.value === value.value);
            // console.log('d2[0]', d2)
            // let d3 = d2[0].children.map(i =>{
            //     return {
            //         label: i.label,
            //         value: i.value,
            //         ...i,
            //     }
            // });
            onCityChange && onCityChange([d1[0], d2[0]])
            // console.log(this.state.city[0][0].children, 'this.state.city[0]', this.state.value)
            // this.setState({
            //     city: [[...this.state.city[0]], d1[0].children, d3],
            //     value: [this.state.value[0], d2[0].value, d3[0].value]
            // })
            return;
        }

        if(ind === 2) {
            let v1 = this.getProvince(this.state.value[0]);
            let v2 = this.getCity(v1, this.state.value[1]);
            let v3 = this.getDistrict(v2, value.value);
            // let d3 = this.state.city[1].filter(i => i.value === this.state.value[1]);
            // console.log(d3[0].children, 'd3[0].children', value.value)
            onDistrictChange && onDistrictChange([v1, v2, v3])
            // this.setState({
            //     city: [this.state.city[0], this.state.city[1], d3[0].children],
            //     value: [this.state.value[0], this.state.value[1], d3[0].children.filter(i=>i.value===value.value)[0].value]
            // })
            return;
        }

    }




    render(){
        const { city = [], value = [] } =this.state
        return <MultiPicker data={city} value={value} onChange={this.change}/>

    }
}

export default cityPicker
