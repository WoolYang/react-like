import React from '../src/index';

class Test extends React.Component {
    constructor(props) {
        super(props);
        setInterval(function () {
            const color = ['#eee', 'black', 'red', 'green', 'blue', 'grey', '#133234', '#123213', '222345', '998232']
            const rand = parseInt(Math.min(10, Math.random() * 10))
            this.setState({
                color: color[rand]
            })
        }.bind(this), 1000);
    }

    state = {
        color: 'red'
    }

    render() {
        return (
            <div className='test' style={{ background: this.state.color, height: '100px', width: '100px' }}>
                <span></span>
            </div>
        )
    }
}

React.render(
    <Test />,
    document.getElementById('root')
)