/**
 * 调用ReactDOM.render()后，最先执行的React.createElement()完成对传入的jsx的转换
 * 
 * @param {object} Vnode  转化后的vnode节点
 * @param {any} 放置容器 
 * @returns 
 */
export function render(Vnode, container) {
    //console.log(Vnode)
    const {
        type,
        props
    } = Vnode;

    if (!type) return;
    const { children } = props;

    let domNode;

    const VnodeType = typeof type;

    if (VnodeType === 'function') { //自定义组件
        domNode = renderComponent(Vnode, container); //递归解析自定义组件从组件的render方法中拿到string类型标签
    } else if (VnodeType === 'string') { //html原始标签
        domNode = document.createElement(type);
    }

    mapProps(domNode, props) //映射props中的属性到domNode
    mountChildren(children, domNode);

    Vnode._hostNode = domNode;
    container.appendChild(domNode)
    return domNode;
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

function mountChildren(children, domNode) {
    render(children, domNode);
}

function renderComponent(Vnode, container) {
    const ComponentClass = Vnode.type; //拿到自定义组件(function)
    const { props } = Vnode.props; //拿到自定义组件的props
    const instance = new ComponentClass(props); //实例化自定义组件，传入props

    const renderedVnode = instance.render(); //自定义组件中的render方法获取vnode
    const domNode = render(renderedVnode, container); //递归调用

    instance.Vnode = renderedVnode; //挂载虚拟dom
    return domNode; //返回真实dom
}