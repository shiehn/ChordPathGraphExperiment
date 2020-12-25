import React from 'react';

export class ColorButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {
        //alert(this.props.color)
    }

    // handleColorChange = (color) => {
    //     this.setState({...this.state, bgcolor: color})
    // }

    render() {
        let color = {'background-color': this.state.bgcolor, 'height': '100vh',}
        return (<button onClick={() => {
            this.props.handleColorChange(this.props.color)
        }}>
            {this.props.color}
        </button>);
    }
}
