import * as React from 'react'
import MultiPicker from 'rmc-picker/lib/MultiPicker';
import Picker from 'rmc-picker/lib/Picker';
import './index.less'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedValue: []
        }
    }
    //
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     const { defaultValue, value } = nextProps
    //     if (prevState.valuesFromParent) {
    //         if (value !== prevState.value) {
    //             return {
    //                 value,
    //             }
    //         }
    //     } else {
    //         if (defaultValue !== prevState.defaultValue) {
    //             return {
    //                 value: defaultValue,
    //                 defaultValue,
    //             }
    //         }
    //     }
    //     return null;
    // }
    //
    // onRadioChange = (checked, item) => {
    //     const { onChange }  = this.props
    //     const value = item.value
    //     if (!this.valuesFromParent) {
    //         this.setState({
    //             value: value,
    //         })
    //     }
    //     onChange && onChange(value, item)
    // }

    componentDidCatch(error, errorInfo) {
        console.log('error', error, errorInfo)
    }
    setScrollValue = (v) => {
        console.log(v)
        this.scrollValue = v;
    }
    onPickerChange = (v) => {
        console.log('value', v)
        this.setScrollValue(v);
        if (this.props.onPickerChange) {
            this.props.onPickerChange(v);
        }
    }

    onChange = (v) => {
        console.log('value', v)
        this.setState({
            selectedValue: [...v]
        })
    }

    onSingleChange = (v) => {
        console.log('single', v)
    }

    render() {
        return (<MultiPicker
            className="my-picker-indicatorWrap"
            selectedValue={this.state.selectedValue}
            onScrollChange={this.setScrollValue}
            onPickerChange={this.onPickerChange}
            onValueChange={this.onChange}
        >
            <Picker indicatorClassName="my-picker-indicator"  onValueChange={this.onSingleChange}>
                <Picker.Item className="my-picker-view-item" value="1">one</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="2">two</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="3">three</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="4">four</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="5">five</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="6">six</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="7">seven</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="8">eight</Picker.Item>
            </Picker>
            <Picker indicatorClassName="my-picker-indicator">
                <Picker.Item className="my-picker-view-item" value="11">eleven</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="12">twelve</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="13">thirteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="14">fourteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="15">fifteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="16">sixteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="17">seventeen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="18">eighteen</Picker.Item>
            </Picker>
            <Picker indicatorClassName="my-picker-indicator">
                <Picker.Item className="my-picker-view-item" value="112">eleven</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="122">twelve</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="123">thirteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="134">fourteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="13e5">fifteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="1r6">sixteen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="1r7">seventeen</Picker.Item>
                <Picker.Item className="my-picker-view-item" value="1f8">eighteen</Picker.Item>
            </Picker>
        </MultiPicker>)
    }
}
