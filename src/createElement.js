/**
 * 
 * Vnode构造函数是用于生成vode对象来存储由JSX转化来的虚拟dom
 * 
 * @param {any} type 节点的类型，div/span等
 * @param {object} props 节点属性，包括children元素，各属性等
 * @param {string|null} key 节点key值
 * @param {any} ref 节点ref属性
 */
function Vnode(type, props, key, ref) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
}

/**
 * React.createElement是react的jsx转化工具默认入口，对转化后的jsx处理后注入vnode对象生成虚拟dom树
 * 比如<div></div>会被翻译成 React.createElement('div',null,null);
 * 
 * @param {any} type 解析jsx后得到的节点类型
 * @param {object} config 解析jsx后节点属性信息存储在这里
 * @param {array} children 解析jsx后得到的子节点信息
 * @returns {Vnode} 返回vode节点对象
 */
function createElement(type, config, ...children) {
    let props = {},
        key = null,
        ref = null,
        childLength = children.length;

    if (config != null) {

        key = config.key === undefined ? null : '' + config.key;

        ref = config.ref === undefined ? null : config.ref;


        for (let propName in config) {

            if (propName === 'key' || propName === 'ref') continue;

            if (config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    if (childLength === 1) {
        props.children = children[0];
    } else {
        props.children = children;
    }

    return new Vnode(type, props, key, ref);
}

const React = {
    createElement
}

export default React