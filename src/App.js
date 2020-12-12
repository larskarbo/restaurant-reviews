
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Layout from './Layout';
import Intro from './Intro';
import Login from './Login';

function App() {


  return (

    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Intro />

          </Route>
          <Route path="/login">
            <Login register={false} />
          </Route>
          <Route path="/register">
            <Login register={true} />
          </Route>
          <Route path="/:boardId">
            {/* <Board /> */}

          </Route>
          {/* <Route path="/receive/:target">
          <Receive />
        </Route> */}
          <Route path="*">
            <div>not found</div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
