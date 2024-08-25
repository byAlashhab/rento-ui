import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { SignalIcon, UserPlus2 } from "lucide-react";

const schema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

function SignUp({ isloggedin }: { isloggedin: boolean }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [success, setSuccess] = useState<string>("");

  //async for isSubmitting to work
  const signUp: SubmitHandler<FormFields> = async (data) => {
    
    try {
      const res = await fetch(`${import.meta.env.VITE_RENTO_API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include"
      });

      const serRes: { message: string } = await res.json();

      if (res.ok) {
        setSuccess(serRes.message);
      } else {
        setError("root", {
          message: serRes.message,
        });
      }
    } catch (err) {
      setError("root", {
        message: "Something went wrong",
      });
    }

  };

  useLayoutEffect(() => {
    console.log(isloggedin);

    if (isloggedin) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900 relative">
      <form
        className="max-w-[400px] max-h-[450px] bg-white rounded absolute inset-0 m-auto p-5 flex flex-col align-middle gap-2"
        onSubmit={handleSubmit(signUp)}
      >
        <UserPlus2 className="size-11 mb-8 mx-auto" />
        <Input {...register("firstname")} placeholder="First Name" />
        {errors.firstname && (
          <p className="text-destructive text-xs">{errors.firstname.message}</p>
        )}
        <Input {...register("lastname")} placeholder="Last Name" />
        {errors.lastname && (
          <p className="text-destructive text-xs">{errors.lastname.message}</p>
        )}
        <Input {...register("email")} placeholder="Email" />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}

        <Input {...register("password")} placeholder="Password" />
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
        <div className="flex justify-between align-middle mt-auto">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "..." : "Sign Up"}
          </Button>

          <a href="/login" className="text-sky-500">
            Log In
          </a>
        </div>
        {
          success && <p className="text-green-500 text-xs">{success}</p>
        }
        {errors.root && (
          <p className="text-destructive text-xs">{errors.root.message}</p>
        )}
      </form>
    </div>
  );
}

export default SignUp;
