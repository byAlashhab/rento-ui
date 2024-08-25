import { Dispatch, SetStateAction } from "react";
import Navbar from "./Navbar";

function Home({
  isloggedin,
  setRefetchAuthStatus,
}: {
  isloggedin: boolean;
  setRefetchAuthStatus: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <Navbar
        isloggedin={isloggedin}
        setRefetchAuthStatus={setRefetchAuthStatus}
      />
    </>
  );
}

export default Home;
