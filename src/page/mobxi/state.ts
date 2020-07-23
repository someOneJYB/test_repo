import { action, observable, computed } from 'mobx';

export interface ITodo {
    id: number;
    name: string;
    desc: string;
    done?: boolean;
    g?: any;
}

let id = 0;

class TodoStore {

    @observable todos: ITodo[] = [];

    // 利用计算属性计算完成个未完成个数
    @computed get doneCount() {
        return this.todos.filter(todo => todo.done).length;
    }

    @computed get undoneCount() {
        return this.todos.filter(todo => !todo.done).length;
    }

    @action changeLength = () => {
        this.todos.length = 0
    }
    @action changeP = () => {
        this.todos[0].g = '90990'
    }

    // 添加一个 Todo
    @action addNewTodo = () => {
        console.log('add tab')
        const i = id++;
        console.log('add tab')
        const todo = {
            name: 'new task' + i,
            desc: 'new task' + i,
            id: i,
            done: false,
        };
        console.log('add tab')
        this.todos = [...this.todos, todo];
        console.log(this, 'this 123')
    }

    // 删除一个 Todo
    @action removeById = (id: number) => {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    // 切换 done 状态
    @action toggleStatusById = (id: number) => {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                todo.done = !todo.done;
            }
            return todo;
        });
    }
}

export const state = new TodoStore();
