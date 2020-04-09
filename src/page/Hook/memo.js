// memo 主要是闭包记忆参数从而减少计算量
function memo(fn, equalFn) {
    var pre = {}; var result = null;
    var f = function(props) {
        if(equalFn && !equalFn(pre, props)) {
            result = fn(props)
        }
        if(!equalFn){
            if(pre !== props) {
                result = fn(props)
            }
        }
        pre = props;
        return result
    }
    return f;
}
// reselect 减少redux 中返回的 state 的计算量,因为有些 state 可能需要复杂的计算，但是如果是相同的参数，返回的是同样的结果需要进行长时间的计算就会导致性能的浪费。
import { createSelector } from 'reselect'

const getVisibilityFilter = (state, props) =>
    state.todoLists[props.listId].visibilityFilter

const getTodos = (state, props) =>
    state.todoLists[props.listId].todos

const getVisibleTodos = createSelector(
    [ getVisibilityFilter, getTodos ],
    (visibilityFilter, todos) => {
        switch (visibilityFilter) {
            case 'SHOW_COMPLETED':
                return todos.filter(todo => todo.completed)
            case 'SHOW_ACTIVE':
                return todos.filter(todo => !todo.completed)
            default:
                return todos
        }
    }
)
// return selector
export default getVisibleTodos
const mapStateToProps = (state, props) => {
    return {
        // selector(state, props)
        todos: getVisibleTodos(state, props)
    }
}

import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../selectors'

const mapStateToProps = (state, props) => {
    return {
        // WARNING: THE FOLLOWING SELECTOR DOES NOT CORRECTLY MEMOIZE
        todos: getVisibleTodos(state, props)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id))
        }
    }
}

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)

export default VisibleTodoList


// 可以看出这个是有
function isEaqual(p1, p2) {
    if(!p1) return false
    for(let i = 0; i < p2.length; i++) {
        if(p2[i] !== p1[i]) return false
    }
    return true
}
function memoFunc(fn) {
    let preResult = null;
    let args = null;
    return function() {
        if(!isEaqual(args, arguments)) {
            console.log(arguments)
            preResult = fn.apply(null, arguments)
        }
        args = arguments;
        return preResult
    }
}
function createSelector(func) {
    var args = [].slice.call(arguments)
    var realfunc = args.pop();
    var dependency = args[0] instanceof Array ? args[0] : []
    // state props
    return function() {
        // 真正的执行函数 memo
        var memoResult = memoFunc(function(){
            return realfunc.apply(null, arguments)
        })
        // 选择器的返回值也做 memo，
        var selector = memoFunc(function(){
            let params = []
            for(let i = 0; i < dependency.length; i++) {
                params.push(dependency[i](arguments))
            }
            return memoResult.apply(null, params)
        })
        selector.realfunc = realfunc;
        return selector;
    }
}
// you can use like this
createSelector([ getVisibilityFilter, getTodos ],
    (visibilityFilter, todos) => {
        switch (visibilityFilter) {
            case 'SHOW_COMPLETED':
                return todos.filter(todo => todo.completed)
            case 'SHOW_ACTIVE':
                return todos.filter(todo => !todo.completed)
            default:
                return todos
        }
    })(state, props);
// selector memo state props
// 真正执行的函数 memo depedency result
// 选择器的memo state props，如果发生变化，执行最终的函数，但是最终的函数也进行了参数的 memo，也就是说即便 state、props 变化，但是在执行最终的结果的时候依赖的结果没发生变化memo就会认为参数没发生变化，不会进行比较
