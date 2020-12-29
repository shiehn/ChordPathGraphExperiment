import './App.css';
import {Route, BrowserRouter as Router, Link} from "react-router-dom";
import {GraphUI} from './Pages/GraphUI'
import ReactGA from 'react-ga';

ReactGA.initialize('G-DBGR5B659W');

function App() {
    useEffect( () => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    });

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
