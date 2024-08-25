import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { LogInIcon } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

function LogIn({
  isloggedin,
  setRefetchAuthStatus,
}: {
  isloggedin: boolean;
  setRefetchAuthStatus: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const login: SubmitHandler<FormFields> = async (data) => {
    const response = await fetch(`${import.meta.env.VITE_RENTO_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.status === 500) {
      setError("root", { message: "Server Error" });
      return;
    }

    if (!response.ok) {
      setError("root", { message: "Wrong email or password" });
      return;
    }

    navigate("/");
    setRefetchAuthStatus((prev) => !prev);
  };

  useLayoutEffect(() => {
    console.log(isloggedin);

    if (isloggedin) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900">
      <form
        className="max-w-[400px] max-h-[300px] bg-white rounded absolute inset-0 m-auto p-5 flex flex-col align-middle gap-2"
        onSubmit={handleSubmit(login)}
      >
        <LogInIcon className="size-11 mb-8 mx-auto"/>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
        <Input {...register("password")} placeholder="Password" />
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}

        <div className="flex justify-between align-middle mt-auto">
          <Button disabled={isSubmitting}>
            {isSubmitting ? "..." : "Log In"}
          </Button>

          <a href="/signup" className="text-sky-500">
            Sign Up
          </a>
        </div>
        {errors.root && (
          <p className="text-destructive text-xs">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default LogIn;
