import { Outlet } from "react-router-dom";

function New({
  user,
}: {
  user: { firstname: string; lastname: string; role: string };
}) {
  return (
    <div className="max-w-screen min-h-screen bg-slate-900">
      <h1 className="text-white font-bold text-4xl text-center py-8">
        Create New Place
        {user.role !== "user" && <span> or Article</span>}
      </h1>
      <Outlet />
    </div>
  );
}

export default New;
