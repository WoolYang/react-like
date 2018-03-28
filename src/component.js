export class Component {
    constructor(props) {
        this.props = props
        this.state = this.state || {}

        this.nextState = null
    }

    setState(partialState) {
        const preState = this.state;//存一份之前的，以后有用
        this.nextState = { ...this.state, ...partialState };//存一份新的，以后有用
        this.state = this.nextState;

        const oldVnode = this.Vnode;//注意这里，就是我们之前记录的Vnode.
        const newVnode = this.render();
        updateComponent(this, oldVnode, newVnode);//注意要把组件的实例传递过来  
    }
    render() { }//用户会重写这个方法，所以我们就放一个壳子在这里
}

function updateComponent(instance, oldVnode, newVnode) {
    if (oldVnode.type === newVnode.type) {
        mapProps(oldVnode._hostNode, newVnode.props)//更新节点
    } else {
        //remove
    }
}

function mapProps(domNode, props) {
    for (let propsName in props) {
        if (propsName === 'children') continue;
        if (propsName === 'style') {
            let style = props['style'];
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = style[styleName];
            })
            continue;
        }
        domNode[propsName] = props[propsName]
    }
}