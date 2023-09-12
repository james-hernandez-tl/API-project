import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import AllGroups from "./components/allGroups";
import SingelGroup from "./components/SingelGroup/SingelGroup";
import SingleEvent from "./components/SingleEvent/SingleEvent";
import AllEvents from "./components/allEvents/AllEvents";
import CreateGroupForm from "./components/CreateGroupForm/CreateGroupForm";
import CreateEventForm from "./components/CreateEventForm/CreateEventForm";
import UpdateGroupForm from "./components/UpdateGroup/UpdateGroupform";
import Landing from "./components/Landing";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {<Navigation isLoaded={isLoaded} />}
      {isLoaded && (
        <Routes>
          <Route exact={"true"} path="/" element={<Landing />} />

          <Route exact={"true"} path="/groups" element={<AllGroups />} />

          <Route
            exact={"true"}
            path="/groups/new"
            element={<CreateGroupForm />}
          />

          <Route
            exact={"true"}
            path="/groups/:groupId"
            element={<SingelGroup />}
          />

          <Route
            exact={"true"}
            path="/events/:eventId"
            element={<SingleEvent />}
          />

          <Route exact={"true"} path="/events" element={<AllEvents />} />

          <Route
            exact={"true"}
            path="/groups/:groupId/events/new"
            element={<CreateEventForm />}
          />

          <Route
            exact={"true"}
            path="/groups/:groupId/edit"
            element={<UpdateGroupForm />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
