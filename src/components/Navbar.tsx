import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "./ui/separator";
import { capitalize } from "@/lib/utils";
import { LogOutIcon, PlusCircleIcon } from "lucide-react";

const schema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
});

type ProfileDataType = z.infer<typeof schema>;

function Navbar({
  isloggedin,
  user,
  refetchUserState,
}: {
  isloggedin: boolean;
  user: { firstname: string; lastname: string; role: string };
  refetchUserState: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDataType>({
    resolver: zodResolver(schema),
  });

  async function logout() {
    const res = await fetch(`${import.meta.env.VITE_RENTO_API}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Oops");
    }
  }

  const saveUserData: SubmitHandler<ProfileDataType> = async function (data) {
    try {
      const res = await fetch(`${import.meta.env.VITE_RENTO_API}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const resData: { message: string } = await res.json();
      if (res.ok) {
        setSuccess(resData.message);
        refetchUserState((prev) => !prev);
      } else {
        setError("root", {
          message: resData.message,
        });
      }
    } catch {
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  return (
    <nav className="flex justify-between p-5 items-center">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <h1 className="text-4xl">Rento</h1>
        {user.firstname && user.lastname && (
          <>
            <Separator orientation="vertical" />
            <p>
              {capitalize(user.firstname).trim() + " "}
              {capitalize(user.lastname).trim()}
            </p>
          </>
        )}
      </div>

      {isloggedin ? (
        <div className="flex gap-3">
          <Button asChild>
            <Link to={"/new/place"} className="flex items-center gap-2">
              <PlusCircleIcon /> <span>New Place</span>
            </Link>
          </Button>
          {user.role !== "user" && (
            <Button asChild>
              <Link to={"/new/article"} className="flex items-center gap-2">
                <PlusCircleIcon />
                <span> New Article</span>
              </Link>
            </Button>
          )}
          {user.role == "admin" && <Button>Dashboard</Button>}
          <Sheet>
            <SheetTrigger>
              <Button>Profile</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center mt-5">
                  <p>User Info </p>{" "}
                  <Button onClick={logout} className="flex items-center gap-2">
                    <LogOutIcon /> <span>Logout</span>
                  </Button>
                </SheetTitle>
                <SheetDescription>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={handleSubmit(saveUserData)}
                  >
                    <Input {...register("firstname")} placeholder="Firstname" />
                    {errors.firstname && (
                      <p className="text-destructive text-xs">
                        {errors.firstname.message}
                      </p>
                    )}
                    <Input {...register("lastname")} placeholder="Lastname" />
                    {errors.lastname && (
                      <p className="text-destructive text-xs">
                        {errors.lastname.message}
                      </p>
                    )}

                    <Button disabled={isSubmitting}>
                      {isSubmitting ? "..." : "Save"}
                    </Button>
                    {success && <p className="text-green-500">{success}</p>}

                    {errors.root && (
                      <p className="text-destructive text-xs">
                        {errors.root.message}
                      </p>
                    )}
                  </form>
                  <div className="mt-2 flex gap-2">
                    <Button
                      asChild
                      className={user.role === "user" ? "w-full" : "w-1/2"}
                    >
                      <Link to={"/places"}>Places</Link>
                    </Button>

                    {user.role !== "user" && (
                      <Button className="w-1/2">
                        <Link to={"/articles"}>Articles</Link>
                      </Button>
                    )}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/signup")}>Sign up</Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
