import React from 'react';
import Counter from '../Counter'
import './index.less';
import zr from '../../images/zr.png'
import edit from '../../svg/edit.svg'
import CustomIcon from '../../component/CustomIcon'
import { Button } from 'antd'
import  uniq from 'lodash/uniq'
export class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          change: true
      }
  }
  componentDidMount() {
      console.log('app didmount')
  }

    render() {
    uniq(1)
    return (
        <div className="App">
            <div onClick={() => this.setState({
                change: !this.state.change,
            })}>change</div>
            <CustomIcon type={edit} size="md" />
            <p className="test"/>
            <Button type="primary" shape="circle" icon="download" />
            <img src={zr}/>
            <header className="App-header">
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
            <Counter/>
          </header>
        </div>)
  }

}


export default App

