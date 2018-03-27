import React from '../src/createElement';
import ReactDOM from '../src/render';

ReactDOM.render(
    <div className='test' style={{
        background: '#eee',
        height: '100px',
        width: '100px'
    }}><span></span></div>,
    document.getElementById('root')
)