import { styleHelper } from "./utils";
//属性生成器，策略模式
export function mapProps(domNode, props, Vnode) {

    if (Vnode && typeof Vnode.type === 'function') return; //这步在什么实际情景下会出现？


    for (let propsName in props) {
        if (propsName === 'children') continue;

        if (typeof mappingStrategy[propsName] === 'function') {
            mappingStrategy[propsName](domNode, props[propsName])
        }
        if (mappingStrategy[propsName] === undefined) {
            mappingStrategy['otherProps'](domNode, props[propsName], propsName)
        }
    }
}

export const mappingStrategy = {
    style: function (domNode, style) {
        if (style !== void 2333) {
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = styleHelper(styleName, style[styleName])
            })
        }
    },
    className: function (domNode, className) {
        if (className !== void 2333) {
            domNode.className = className
        }
    },
    otherProps: function (domNode, prop, propName) {
        if (prop !== void 2333 || propName !== void 2333) {
            domNode[propName] = prop
        }
    }
}