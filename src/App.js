
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from "react-router-dom";
import Layout from './Layout';
import Intro from './Intro';
import Login from './Login';
import Restaurants from './Restaurants';
import Restaurant from './Restaurant';
import { useEffect } from "react";
import { request } from "./utils/request";

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
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/register">
            <Login register={true} />
          </Route>
          <Route exact path="/restaurants">
            <Restaurants />

          </Route>
          <Route path="/restaurants/:restaurantId">
            <Restaurant />

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

const Logout = () => {
  let history = useHistory();
  useEffect(() => {
    request("GET", "/logout").then(() => {
      history.push("/")
    })
  },[])

  return (
    <div>Logging out</div>
  )
}