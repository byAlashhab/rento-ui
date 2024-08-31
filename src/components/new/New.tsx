import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

function New({
  user,
  refetchPlacesState,
  refetchArticlesState,
}: {
  user: { firstname: string; lastname: string; role: string };
  refetchPlacesState: Dispatch<SetStateAction<boolean>>;
  refetchArticlesState: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="max-w-screen min-h-screen bg-slate-900">
      <h1 className="text-white font-bold text-4xl text-center py-8">
        Create New Place
        {user.role !== "user" && <span> or Article</span>}
      </h1>
      <div className="flex items-center justify-center gap-1 ">
        <Button asChild className="bg-white text-slate-900 hover:bg-white">
          <Link to={"/new/place"}>New Place</Link>
        </Button>
        <Button asChild className="bg-white text-slate-900 hover:bg-white ">
          <Link to={"/new/article"}>New article</Link>
        </Button>
      </div>
      <Outlet context={{ refetchPlacesState, refetchArticlesState }} />
    </div>
  );
}

export default New;
