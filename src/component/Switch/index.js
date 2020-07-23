import React, { Component } from 'react'
import './index.less'
class Switch extends Component {
    constructor(props) {
        super(props)
        this.state ={
            checked: props.checked,
        }
    }


    onChange = ()  => {
        console.log('change')
        let { checked } = this.state;
        const { onChange } = this.props;
        this.setState({
            checked: !checked,
        }, () => {
            onChange && onChange(this.state.checked);
        })
    }


    render() {
      const { color = '#64bd63' } = this.props
      const checkedStyle = {
           borderColor: color,
           boxShadow: `${color} 0 0 0 16px inset`,
           backgroundColor: color,
      }
      const { checked } = this.state
      return (
          <label>
              <input style={checked ? {...checkedStyle} : {backgroundColor:'#fff'} } className="mui-switch" type="checkbox" checked={checked} onChange={this.onChange}/>
          </label>
      )
    }
}

export default Switch
