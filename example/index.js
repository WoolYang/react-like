import React from '../src/index';

class Test extends React.Component {
    constructor(props) {
        super(props);
        /*         setInterval(function () {
                    const color = ['#eee', 'black', 'red', 'green', 'blue', 'grey', '#133234', '#123213', '222345', '998232']
                    const rand = parseInt(Math.min(10, Math.random() * 10))
                    this.setState({
                        color: color[rand]
                    })
                }.bind(this), 1000); */
        this.state = {
            color: 'red'
        }
    }

    componentDidMount() {
        this.setState({ color: 'blue' })
    }

    render() {
        const names = ['Alice', 'Emily', 'Kate'];

        return (
            <div className='test' style={{ background: this.state.color, height: '100px', width: '100px' }}>
                <span className='test'>
                    <i>1111111</i>
                </span>
                <div>
                    {
                        names.map(item => <div>item</div>)
                    }
                </div>
                {
                    names.map(item => 'item')
                }
                22
            </div>
        )
    }
}

React.render(
    <Test classs={11} />,
    document.getElementById('root')
)