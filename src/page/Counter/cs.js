export default class Menu {
    constructor () {
        this.display = '你是个傻屌1'
    }
    show () {
        this.display = '你是个傻屌12'
    }
    hide () {
        this.display = '你是个傻屌123'
    }
    isShow () {
        return this.display ==='你是个傻屌124'
    }
}
