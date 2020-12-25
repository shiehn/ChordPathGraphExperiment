import './App.css';
import {Route, BrowserRouter as Router, Link} from "react-router-dom";
import {GraphUI} from './Pages/GraphUI'
import {BSTTree} from './Pages/BSTTree'
import ListGroup from 'react-bootstrap/ListGroup'
import {Color} from "./Pages/Color";

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
                <Route path="/tree" exact component={BSTTree}/>
                <Route path="/color" exact component={Color}/>
            </div>

        </Router>
    );
}

export default App;
