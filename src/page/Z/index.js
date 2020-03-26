import React from 'react';
import React from 'react'
import { connect } from 'react-redux'
import createForm from './q'
// react unmount 测试
const logProps = props => (comp) => React.cloneElement(comp)

// 高阶函数的参数接受的是 WrappedComponent 组件，返回的是一个 class 需要使用<xxx/>是实例化使用
function logProps1(WrappedComponent) {
    return class extends React.Component {
        componentWillReceiveProps(nextProps) {
            console.log('Current props: ', this.props);
            console.log('Next props: ', nextProps);
        }
        render() {
            console.log(WrappedComponent, typeof WrappedComponent, '高阶组件')
            // 用容器组件组合包裹组件且不修改包裹组件，这才是正确的打开方式。
            return <WrappedComponent {...this.props} />;
        }
    }
}
let index = 0

const logProps2 = (WrappedComponent) => {
    console.log(WrappedComponent, typeof WrappedComponent, 'wwrrbghrfbhbjrfbhj')
    var f = React.cloneElement(WrappedComponent, {
        value: 7890377388,
    })
    var f1 = React.cloneElement(WrappedComponent, {
        value: 7890377388,
    })
    console.log(f1.constructor === f.constructor)
    return React.cloneElement(WrappedComponent, {
        value: 7890377388,
    })}


class Input extends React.Component {
    componentWillUnmount() {
        console.log('input unmount')
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('s', nextProps.s === this.props.s)
        // this.setState({
        //     a: 1,
        // })
    }

    componentDidMount() {
        console.log('input didmount')
    }

    render() {
        console.log('render input')
        const f = (this.props.s && React.createElement(this.props.s)) || null
        // const f = React.cloneElement(this.props.s())
        return <div><input onChange={() => { this.setState({ a: index++ }) }}/>{f}</div>
    }
}
class Hello extends React.Component {
    componentWillUnmount() {
        console.log(' hello unmount')
    }
    componentDidMount() {
        console.log('fhello didmount')
    }
    render() {
        return React.createElement('div', null, `Hello ${this.props.toWhat}`);
    }
}
class F extends React.Component {
    componentWillUnmount() {
        console.log(' f unmount')
    }
    componentDidMount() {
        console.log('f didmount')
    }

    render() {
        return <div>1209938848 我是 F</div>
    }
}

class Appa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            visible: true,
            visible1: true,
        }
    }
    // onSubmit = (e) => {
    //     e.preventDefault();
    //     // eslint-disable-next-line no-console
    //     console.log('Values of member[0].name.firstname and a[0][1].b.c[0]');
    //     // eslint-disable-next-line no-console
    //     console.log(this.props.form.getFieldsValue(['member[0].name.firstname', 'a[0][1].b.c[0]']));
    //     // eslint-disable-next-line no-console
    //     console.log('Values of all fields');
    //     // eslint-disable-next-line no-console
    //     console.log(this.props.form.getFieldsValue());
    //
    //     this.props.form.validateFieldsAndScroll((error, values) => {
    //         if (!error) {
    //             // eslint-disable-next-line no-console
    //             console.log('ok', values);
    //         } else {
    //             // eslint-disable-next-line no-console
    //             console.log('error', error, values);
    //         }
    //     });
    // }

    onChange = (e) => {
        this.props.form.setFieldValue('ab', 7)
    }

    setField = () => {
        this.props.form.setFieldsValue({
            member: [
                {
                    name: {
                        firstname: 'm1 first',
                        lastname: 'm1 last',
                    },
                },
                {
                    name: {
                        firstname: 'm2 first',
                        lastname: 'm2 last',
                    },
                },
            ],
            a: [
                [undefined, {
                    b: {
                        c: ['Value of a[0][1].b.c[0]'],
                    },
                }],
            ],
            w: {
                x: {
                    y: {
                        z: ['Value of w.x.y.z[0]'],
                    },
                },
            },
        });
    }

    componentWillUnmount() {
        console.log('unmount大')
    }

    cell = props => d => <F/>

    resetFields = () => {
        this.props.form.resetFields();
    }

    renderInput = v => v1 => <Input value={v1}/>

    render() {
        console.log(this.props.profile, 'render')
        const EnhancedComponent = logProps1(Input);
        const { getFieldDecorator } = this.props.form;
        return (
            <form onSubmit={this.onSubmit}>
                <div onClick={() => this.setState({
                    visible: !this.state.visible,
                })}>显示或者隐藏</div>
                {this.state.visible && getFieldDecorator('a', {
                    initialValue: '212345678',
                    rules: (value) => {
                        // eslint-disable-next-line no-undef
                        if (value.indexOf('1') > -1) {
                            this.setState({
                                err: true,
                            })
                        }
                    },
                })(
                    <input
                    />,
                )}
                <h1 onClick={() => this.setState({
                    visible1: !this.state.visible1,
                })}>ab</h1>
                {this.state.visible1 && getFieldDecorator('ab', {
                    initialValue: 'ab',
                })(
                    <input
                        onChange={this.onChange}
                    />,
                )}
                <button onClick={this.setField}>Set field</button>
                <button onClick={this.resetFields}>Reset fields</button>
                <button>Submit</button>
                {/*{this.renderInput('34567833848484')}*/}
                {logProps({ value: 123445 })(<EnhancedComponent/>)}
                {/*{logProps2(<Input/>)}*/}
                {/*<Input s={this.cell()}/>*/}
                {/*<Hello/>*/}
                {/*<EnhancedComponent/>*/}
            </form>
        );
    }
}

export default connect(function (state){
    return {...state}
})(createForm()(Appa))

