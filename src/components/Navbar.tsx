import { useNavigate } from "react-router-dom";
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

const schema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
});

type ProfileDataType = z.infer<typeof schema>;

function Navbar({
  isloggedin,
  setRefetchAuthStatus,
}: {
  isloggedin: boolean;
  setRefetchAuthStatus: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  async function logout() {
    const res = await fetch(`${import.meta.env.VITE_RENTO_API}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      setRefetchAuthStatus((prev) => !prev);
    } else {
      alert("Oops");
    }
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDataType>({
    resolver: zodResolver(schema),
  });
  const [success, setSuccess] = useState<string>("");

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
    <nav className="flex justify-between p-7 items-center">
      <h1 className="text-4xl">Rento</h1>

      {isloggedin ? (
        <div className="flex gap-3">
          <Button>New Post</Button>
          <Sheet>
            <SheetTrigger>
              <Button>Profile</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center mt-5">
                  <p>User Info </p> <Button>Logout</Button>
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
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          {/* <Button onClick={logout}>log out</Button> */}
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
