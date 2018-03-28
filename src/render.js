import { typeNumber } from "./utils";
/**
 * 调用ReactDOM.render()后，最先执行的React.createElement()完成对传入的jsx的转换
 * 
 * @param {object} Vnode  转化后的vnode节点
 * @param {any} 放置容器 
 * @returns 
 */
export function render(Vnode, container) {
    console.log(Vnode)
    const {
        type,
        props
    } = Vnode;
    // console.log(type)
    if (!type) return;
    const { children } = props;

    let domNode;

    if (typeof type === 'function') { //自定义组件
        domNode = renderComponent(Vnode, container); //递归解析自定义组件从组件的render方法中拿到string类型标签
    } else if (typeof type === 'string') { //html原始标签
        domNode = document.createElement(type);
    }

    mapProps(domNode, props) //映射props中的属性到domNode
    if (typeNumber(children) > 2 && children !== undefined) { //child不存在或类型不符合时不做渲染处理
        mountChildren(children, domNode); //解析children内容
    }

    Vnode._hostNode = domNode; //真实dom挂载到vnode属性上
    //  console.log(domNode)
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

function mountChildren(childrenVnode, parentDomNode) {
    // console.log(childrenVnode)
    let childType = typeNumber(childrenVnode) //获取children节点类型
    console.log(childType)

    //用于渲染单节点，vnode类型为对象
    if (childType === 8 && childrenVnode !== undefined) {
        render(childrenVnode, parentDomNode)
        // flattenChildList = flattenChildren(childrenVnode, parentVnode)
        /*         if (typeNumber(childrenVnode.type) === 5) {
                    flattenChildList._hostNode = renderByLuy(flattenChildList, parentDomNode, false, parentContext, instance)
                } else if (typeNumber(childrenVnode.type) === 3 || typeNumber(childrenVnode.type) === 4) {
                    flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode, instance)
                } */
    }

    //用于渲染数组children
    if (childType === 7) {//children类型为数组
        //   flattenChildList = flattenChildren(childrenVnode, parentVnode)
        childrenVnode.forEach((item) => {
            if (item) {
                if (typeof item.type === 'function') { //如果是组件先不渲染子嗣
                    mountComponent(item, parentDomNode, parentContext)
                } else {
                    render(item, parentDomNode)
                }
            }
        })
    }
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