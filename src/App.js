import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import HomePage from "./features/Home/components/HomePage";
import Students from "./features/Students/components/Students";
import Classrooms from "./features/Classrooms/components/Classrooms";
import Teachers from "./features/Teachers/components/Teachers";
import Subjects from "./features/Subjects/components/Subjects";
import Navigationbar from "./components/navbar/navigationbar";
import Footer from "./components/footer/footer";
import LoginPage from "./components/LoginPage/LoginPage";
function App() {
  return (
    <>
      <Navigationbar />
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/main" component={HomePage} />
          <Route path="/students" component={Students} />
          <Route path="/classrooms" component={Classrooms} />
          <Route path="/teachers" component={Teachers} />
          <Route path="/subjects" component={Subjects} />
        </Switch>
      </Router>
      <Footer />
    </>
  );
}

export default App;
