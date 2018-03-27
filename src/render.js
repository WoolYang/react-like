/**
 * 调用ReactDOM.render()后，最先执行的React.createElement()完成对传入的jsx的转换
 * 
 * @param {object} Vnode  转化后的vnode节点
 * @param {any} 放置容器 
 * @returns 
 */
function render(Vnode, container) {
    console.log(Vnode)
    const {
        type,
        props
    } = Vnode;

    if (!type) return;
    const { children } = props;

    let domNode;

    domNode = document.createElement(type);//创建对应type节点标签

    mapProps(domNode, props) //映射props中的属性到domNode

    mountChildren(children, domNode);

    container.appendChild(domNode)
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

const ReactDOM = {
    render
}
export default ReactDOM