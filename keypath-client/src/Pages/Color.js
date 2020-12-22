import React from 'react';
import axios from 'axios';
import ListGroup from "react-bootstrap/ListGroup";
import {ColorButton} from './ColorButton'

export class Color extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colors: ['pink'],
            bgcolor: 'grey',
        };
    }

    componentDidMount = async () => {
        const colorRes = await axios.get(`http://localhost:8080/colors`);

        if(!colorRes.data){
            return
        }

        this.setState({...this.state, colors: colorRes.data})
    }

    handleColorChange = (color) => {
        this.setState({...this.state, bgcolor: color})
    }

    render(){
        let color = {'backgroundColor': this.state.bgcolor, 'height': '100vh',}
        return  <div style={color}>
            {JSON.stringify(this.state.colors)}
            <ListGroup>
                {this.state.colors.map((c) => {return <ColorButton key={c} color={c} handleColorChange={this.handleColorChange} />})}

            </ListGroup>
        </div>
    }
}