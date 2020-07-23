// @ts-ignore
import React from 'react'
import { observer } from 'mobx-react';
import  { state } from './state';


function TodoListFnPage() {
    const {
        todos,
        undoneCount,
        doneCount,
        removeById,
        toggleStatusById
    } = state;
    console.log('render todo')
    // @ts-ignore
    return (
        <div>
            <div>
                Done: {doneCount}
    Undone: {undoneCount}
    </div>
    <br />
    {
        todos.map((todo) => {
            return (
                <div key={todo.id}>
                    {JSON.stringify(todo)}
                    <div onClick={()=>removeById(todo.id)}>delete</div>
                    <div onClick={()=>toggleStatusById(todo.id)}>toggle</div>
                </div>
        )
        })
    }
    <br />
    <button onClick={() => state.changeP()}>change peroperty</button>
    <button onClick={() => state.changeLength()}>change Length</button>
    <button onClick={() => state.addNewTodo()}>Add New</button>
    </div>
);
}

// 注意这里的 observer
export default observer(TodoListFnPage);
