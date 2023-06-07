import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import AllGroups from "./components/allGroups";
import SingelGroup from "./components/SingelGroup/SingelGroup";
import SingleEvent from "./components/SingleEvent/SingleEvent";
import AllEvents from "./components/allEvents/AllEvents";
import CreateGroupForm from "./components/CreateGroupForm/CreateGroupForm";
import CreateEventForm from "./components/CreateEventForm/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
         <Route exact path="/">
              <Home />
         </Route>

         <Route exact path="/groups">
               <AllGroups />
         </Route>

         <Route exact path="/groups/new">
             <CreateGroupForm />
         </Route>

         <Route exact path="/groups/:groupId">
              <SingelGroup />
         </Route>

         <Route exact path="/events/:eventId">
             <SingleEvent />
         </Route>

         <Route exact path="/events">
             <AllEvents />
         </Route>

         <Route exact path="/groups/:groupId/events/new">
             <CreateEventForm />
         </Route>

      </Switch>}
    </>
  );
}

export default App;
