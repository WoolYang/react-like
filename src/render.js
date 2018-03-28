import { typeNumber } from "./utils";
import { flattenChildren } from './createElement'

let mountIndex = 0 //统计挂载次数
let containerMap = {} //用于缓存vnode，即虚拟dom树

/**
 * 虚拟dom渲染引擎入口
 * 调用React.render()后，最先执行的React.createElement()，将jsx解析后的对象清洗生成的vnode实例对象传入
 * 
 * @param {object} Vnode  转化后的vnode节点，即虚拟dom树
 * @param {any} 放置容器 
 * @returns 
 */
export function render(Vnode, container) {
    if (typeNumber(container) !== 8) { //必须有dom挂载容器
        throw new Error('Target container is not a DOM element.')
    }

    //第一次初始化渲染
    Vnode.isTop = true; //标注顶级Vnode
    container.UniqueKey = mountIndexAdd(); //标注挂载次数
    containerMap[container.UniqueKey] = Vnode; //缓存dom树
    renderCore(Vnode, container);

    return Vnode._instance; //暂时没有用到
}

//渲染引擎核心模块
function renderCore(Vnode, container) {
    const {
        type,
        props
    } = Vnode;
    // console.log(type)
    if (!type) return;
    const { children } = props;

    let domNode;

    if (typeof type === 'function') { //自定义组件
        domNode = mountComponent(Vnode, container); //递归解析自定义组件从组件的render方法中拿到string类型标签
    } else if (typeof type === 'string' && type === '#text') { //html原始标签
        domNode = mountTextComponent(Vnode, container);
    } else {
        domNode = document.createElement(type);
    }

    mapProps(domNode, props) //映射props中的属性到domNode
    if (typeNumber(children) > 2 && children !== undefined) { //child不存在或类型不符合时不做解析处理
        mountChildren(children, domNode, Vnode); //解析children内容
    }

    Vnode._hostNode = domNode; //真实dom挂载到对应层级的vnode属性上

    container.appendChild(domNode)
    return domNode;
}

//挂载children
function mountChildren(children, parentDomNode, parentVnode) {
    //  console.log(children)
    let childType = typeNumber(children) //获取children节点类型
    let flattenChildList = children;

    //children类型为undefined时，处理成#text类型空vnode
    if (childType === undefined) {
        flattenChildList = flattenChildren(children, parentVnode)
    }

    //用于渲染单节点，vnode类型为对象,例如如果是数组，展开处理
    if (childType === 8 && children !== undefined) {
        flattenChildList = flattenChildren(children, parentVnode)
        if (typeNumber(children.type) === 5) {
            flattenChildList._hostNode = renderCore(flattenChildList, parentDomNode)
        } else if (typeNumber(children.type) === 3 || typeNumber(children.type) === 4) {
            flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode)
        }
    }

    //用于渲染数组children
    if (childType === 7) {//children类型为数组
        flattenChildList = flattenChildren(children, parentVnode)
        //      console.log(flattenChildList)
        flattenChildList.forEach((item) => {
            if (item) {
                if (typeof item.type === 'function') { //如果children是自定义组件
                    mountComponent(item, parentDomNode)
                } else {
                    renderCore(item, parentDomNode)
                }
            }
        })
    }

    //children类型为string或number时，既文本节点，处理成#text类型vnode
    if (childType === 4 || childType === 3) {
        flattenChildList = flattenChildren(children, parentVnode);
        mountTextComponent(flattenChildList, parentDomNode); //普通类型直接处理
    }
}

//解析文本vnode，并挂载真实dom到_hostNode
function mountNativeElement(Vnode, parentDomNode) {
    // console.log(Vnode)
    const domNode = renderCore(Vnode, parentDomNode)
    Vnode._hostNode = domNode
    return domNode
}

//解析文本
function mountTextComponent(Vnode, domNode) {
    let fixText = Vnode.props === 'createPortal' ? '' : Vnode.props
    let textDomNode = document.createTextNode(fixText)
    domNode.appendChild(textDomNode)
    Vnode._hostNode = textDomNode
    return textDomNode
}


//挂载自定义组件
function mountComponent(Vnode, parentDomNode) {
    const ComponentClass = Vnode.type; //拿到自定义组件(function)
    const { props } = Vnode.props; //拿到自定义组件的props
    const instance = new ComponentClass(props); //实例化自定义组件，传入props
    const renderedVnode = instance.render(); //自定义组件中的render方法获取vnode
    const domNode = renderCore(renderedVnode, parentDomNode); //递归调用

    instance.Vnode = renderedVnode; //挂载虚拟dom
    return domNode; //返回真实dom
}

function mountIndexAdd() {
    return mountIndex++
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