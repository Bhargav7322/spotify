import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./Pages/Register";
import Album from "./Pages/Album";
import Playlist from "./Pages/Playlist";
import Admin from "./Pages/Admin";

const App = () => {
  const { isAuth, loading } = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/album/:id" element={<Album />} />
            <Route
              path="/playlist"
              element={isAuth ? <Playlist /> : <Album />}
            />
            <Route
              path="/admin/dashboard"
              element={isAuth ? <Admin /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
