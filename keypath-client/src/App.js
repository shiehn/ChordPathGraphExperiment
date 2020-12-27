import './App.css';
import {Route, BrowserRouter as Router, Link} from "react-router-dom";
import {GraphUI} from './Pages/GraphUI'
import ListGroup from 'react-bootstrap/ListGroup'

function App() {
    return (
        <Router>
            <div className="App">
                {/*<ListGroup horizontal>*/}
                {/*    <ListGroup.Item><Link to="/">HOME</Link></ListGroup.Item>*/}
                {/*    <ListGroup.Item><Link to="/tree">GRAPH</Link></ListGroup.Item>*/}
                {/*    <ListGroup.Item><Link to="/color">COLORS</Link></ListGroup.Item>*/}
                {/*</ListGroup>*/}

                <Route path="/" exact component={GraphUI}/>
            </div>

        </Router>
    );
}

export default App;
