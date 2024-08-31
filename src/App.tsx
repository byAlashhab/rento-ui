import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import PlaceForm from "./components/new/Forms/PlaceForm";
import ArticleForm from "./components/new/Forms/ArticleForm";
import New from "./components/new/New";

function App() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({ isloggedin: false });

  const [refetchAuthStatus, setRefetchAuthStatus] = useState<boolean>(false);
  const [userState, refetchUserState] = useState<boolean>(false);
  const [placesState, refetchPlacesState] = useState<boolean>(false);
  const [articlesState, refetchArticlesState] = useState<boolean>(false);

  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
    role: string;
  }>({ firstname: "", lastname: "", role: "" });

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

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_RENTO_API}/users/user-data`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const resData: {
          id: string;
          firstname: string;
          lastname: string;
          role: string;
        } = await res.json();
        setUser(resData);
      } catch (err) {
        console.error(err);
        setUser({ firstname: "error", lastname: "error", role: "error" });
      }
    }

    if (data.isloggedin) {
      fetchUserData();
    }
  }, [data.isloggedin, userState]);

  useEffect(() => {}, [refetchPlacesState]);
  useEffect(() => {}, [refetchArticlesState]);

  if (loading) return <p>loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            isloggedin={data.isloggedin}
            user={user}
            refetchUserState={refetchUserState}
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
      {data.isloggedin && (
        <>
          <Route
            path="/new"
            element={
              <New
                user={user}
                refetchPlacesState={refetchPlacesState}
                refetchArticlesState={refetchArticlesState}
              />
            }
          >
            <Route path="place" element={<PlaceForm />} />
            {user.role !== "user" && (
              <Route path="article" element={<ArticleForm />} />
            )}
          </Route>
          <Route path={"/places"} element={<>places</>}/>

          {user.role !== "user" && <Route path={"/articles"} element={<>articles</>}/>}
        </>
      )}
    </Routes>
  );
}

export default App;
