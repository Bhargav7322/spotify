import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./Pages/Register";

const App = () => {
  const {isAuth, loading} = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home /> : <Register />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
