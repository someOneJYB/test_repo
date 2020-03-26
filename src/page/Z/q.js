import React from 'react'

export default function createForm(options) {
    return function wrapComp(Comp) {
        return class extends React.Component {
            constructor(props) {
                super(props);
                // 收集变化的属性
                this.state = {}
                // 收集注册的组件对象
                this.metaFields = {}
                // 收集注册实例
                this.instance = {}
                // 收集注册的 onChange
                this.cache = {}
                this.clearMetaCache = {}
            }
            resetFields = (ns) => {
                if (ns) {
                    const names = Array.isArray(ns) ? ns : [ns];
                    names.forEach((name) => {
                        delete this.state[name].value
                    });
                } else {
                    this.state = {}
                }
                this.forceUpdate()
            }
            getFieldDecorator = (name, options) => {
                if (!name) {
                    throw new Error('name is needed')
                }
                const inputProps = this.setProps(name, options)
                return (FieldElem) => {
                    const fieldMeta = this.metaFields[name];
                    const originalProps = FieldElem.props;
                    fieldMeta.originalProps = originalProps;
                    fieldMeta.ref = FieldElem.ref;
                    let v = fieldMeta.initialValue
                    const field = this.getField(name);
                    if (field && 'value' in field) {
                        v = field.value;
                    }
                    console.log('decorator state', this.state, 'meta', this.metaFields)
                    console.log(FieldElem)
                    return React.cloneElement(FieldElem, {
                        ...inputProps,
                        value: v,
                    });
                };
            }
            getCacheBind = (name, action, fn, validateCb) => {
                if (!this.cache[name]) {
                    this.cache[name] = {};
                }
                const cache = this.cache[name];
                if (!cache[action]) {
                    if (validateCb) {
                        cache[action] = fn.bind(this, name, validateCb);
                    } else {
                        cache[action] = fn.bind(this, name);
                    }
                }
                return cache[action];
            }
            getDomVal = (e) => {
                if (!e || !e.target) {
                    return e;
                }
                const { target } = e;
                return target.type === 'checkbox' ? target.checked : target.value;
            }
            getField = name => this.state[name] || {}
            getFieldValue = (name) => {
                if (!this.metaFields[name]) {
                    throw new Error('请先注册')
                }
                return this.state[name] ? this.state[name].value : this.metaFields[name].initialValue
            }
            originChange = (name, v) => {
                const { originalProps = {} } = this.metaFields[name]
                if (originalProps && originalProps.onChange) {
                    originalProps.onChange(v)
                }
            }
            onChange = (name, el) => {
                const v = this.getDomVal(el)
                this.originChange(name, v)
                this.setFieldValue(name, v)
            }
            onChangeValidate = (name, rules, el) => {
                const v = this.getDomVal(el);
                // 自定义校验函数返回不同的 className
                this.originChange(name, v)
                const result = rules(v);
                // 注入到state中
                if (!this.state[name]) {
                    this.state[name] = {}
                }
                this.setFieldValue(name, v, { extraClassname: result })
            }
            onRefs = (name, el) => {
                if (!el) {
                    this.clearMetaCache[name] = {
                        field: this.state[name],
                        meta: this.metaFields[name],
                    };
                    delete this.state[name]
                    // 收集注册的组件对象
                    delete this.metaFields[name]
                    // 收集注册实例
                    delete this.instance[name]
                    // 收集注册的 onChange
                    delete this.cache[name]
                    console.log('ref state', this.state, 'meta', this.metaFields)
                    return;
                }
                this.recoverClearedField(name)
                const fieldMeta = this.metaFields[name];
                if (fieldMeta) {
                    const ref = fieldMeta.ref;
                    if (ref) {
                        ref(el);
                    }
                }
                this.instance[name] = el;
            }
            recoverClearedField = (name) => {
                if (this.clearMetaCache[name]) {
                    this.state[name] = this.clearMetaCache[name].state;
                    this.metaFields[name] = this.clearMetaCache[name].meta;
                    delete this.clearMetaCache[name];
                }
            }
            validateAll = (cb) => {

            }
            setFieldValue = (name, val, extra) => {
                if (!this.metaFields[name]) {
                    throw new Error('请先注册')
                }
                if (!this.state[name]) {
                    this.state[name] = {}
                }
                extra && Object.keys(extra).forEach((item) => {
                    this.state[name][item] = extra[item]
                })
                this.state[name].value = val || '';
                console.log('forceupdate', val)
                this.forceUpdate();
            }
            setProps = (name, options) => {
                delete this.clearMetaCache[name];
                const fieldOption = {
                    name,
                    trigger: 'onChange',
                    valuePropName: 'value',
                    validate: [],
                    ...options,
                };
                const {
                    rules,
                    trigger = 'onChange',
                    initialValue = '',
                    validateTrigger = 'onChange' } = fieldOption;
                const inputProps = {
                    value: initialValue,
                };
                if (rules && validateTrigger) {
                    inputProps[validateTrigger] = this.getCacheBind(name, validateTrigger, this.onChangeValidate, rules);
                }
                if (validateTrigger !== trigger || !rules) {
                    inputProps[trigger] = this.getCacheBind(name, trigger, this.onChange);
                }
                const field = this.getField(name);
                if (field && 'value' in field) {
                    inputProps.value = field.value;
                }
                const fieldMeta = this.metaFields[name] || {};
                fieldMeta.rules = rules;
                fieldMeta.initialValue = initialValue;
                fieldMeta[name] = name
                inputProps.ref = this.getCacheBind(name, 'ref', this.onRefs);
                this.metaFields[name] = fieldMeta;
                return inputProps;
            }
            render() {
                console.log('state', this.state, 'meta', this.metaFields)
                const form = {
                    getFieldDecorator: this.getFieldDecorator,
                    setFieldValue: this.setFieldValue,
                    resetFields: this.resetFields,
                    getFieldValue: this.getFieldValue,
                }
                const pr = {
                    ...this.props,
                    form: form,
                }
                return (<Comp {...pr}/>)
            }
        }
    }
}
