import { useEffect, useState } from "react";
import "./App.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

function App() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({ isloggedin: false });

  const [refetchAuthStatus, setRefetchAuthStatus] = useState<boolean>(false);

  // resourses
  useEffect(() => {
    async function fetchAuthStatus() {
      const { isloggedin }: { isloggedin: boolean } = await fetch(
        `${import.meta.env.VITE_RENTO_API}/auth/isloggedin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      ).then((res) => res.json());

      setData((prev) => {
        return {
          ...prev,
          isloggedin,
        };
      });

      setLoading(false);
    }

    fetchAuthStatus();
  }, [refetchAuthStatus]);

  if (loading) return <p>loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            setRefetchAuthStatus={setRefetchAuthStatus}
            isloggedin={data.isloggedin}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LogIn
            setRefetchAuthStatus={setRefetchAuthStatus}
            isloggedin={data.isloggedin}
          />
        }
      />
      <Route path="/signup" element={<SignUp isloggedin={data.isloggedin} />} />
    </Routes>
  );
}

export default App;
