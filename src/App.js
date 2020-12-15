
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  Redirect
} from "react-router-dom";
import Layout from './Layout';
import Intro from './Intro';
import Login from './Login';
import Restaurants from './Restaurants';
import Admin from './Admin';
import Restaurant from './Restaurant';
import { useEffect, useState } from "react";
import { request } from "./utils/request";

function App() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    request("GET", "/getUser").then(user => {
    console.log("🚀 ~ user", user)
      setUser(user)
    })
    .finally(() => {
      setLoadingUser(false)
    })
  }, [])

  if(loadingUser){
    return "Loading..."
  }

  console.log("user", user)

  return (

    <Router>
      <Layout user={user}>
        <Switch>
          <Route exact path="/">
            <Intro user={user} />

          </Route>
          <Route path="/login">
            <Login onUser={(user) => setUser(user)} register={false} />
          </Route>
          <Route path="/register">
            <Login onUser={(user) => setUser(user)} register={true} />
          </Route>
          <Route path="/logout">
            <Logout onLogout={() => setUser(null)} />
          </Route>
          <PrivateRoute user={user} exact path="/restaurants">
            <Restaurants user={user} />
          </PrivateRoute>
          <PrivateRoute user={user} exact path="/my-restaurants">
            <Restaurants user={user} ownerView={true} />
          </PrivateRoute>
          <PrivateRoute user={user} exact path="/admin">
            <Admin user={user} />
          </PrivateRoute>
          <PrivateRoute user={user} path="/restaurants/:restaurantId">
            <Restaurant user={user} />

          </PrivateRoute>
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

function PrivateRoute({ children, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}

export default App;

const Logout = ({onLogout}) => {
  let history = useHistory();
  useEffect(() => {
    request("GET", "/logout").then(() => {
      onLogout()
      history.push("/")
    })
  },[])

  return (
    <div>Logging out</div>
  )
}