import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  main: z.string(),
  image: z
    .instanceof(FileList)
    .refine((image) => image?.length === 1, "Image is required."),
});

type FormInputs = z.infer<typeof schema>;

//title && description && main && image;

function ArticleForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormInputs>({ resolver: zodResolver(schema) });
  const [successMessage, setSuccessMessage] = useState<string>();

  const addArticle: SubmitHandler<FormInputs> = async (data) => {
    
    try {

      const image = await new Promise<string>((resolve, reject) => {
        const onIm = data.image[0];
        const reader = new FileReader();
  
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
  
        reader.onerror = (error) => {
          reject(error);
        };
  
        reader.readAsDataURL(onIm);
      });

      const res = await fetch(`${import.meta.env.VITE_RENTO_API}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, image }),
        credentials: "include",
      });

      const { message }: { message: string } = await res.json();

      if (res.ok) {
        setSuccessMessage(message);
      } else {
        setError("root", {
          message,
        });
      }

    }catch(err) {
      console.error(err);
      setError("root",{message:"Something went wrong"})
    }
    
    


  };

  return (
    <form
      className="text-white w-[600px] my-2 mx-auto bg-white rounded p-2 flex flex-col gap-2"
      onSubmit={handleSubmit(addArticle)}
    >
      <Input
        {...register("title")}
        placeholder="Title"
        className="text-slate-900"
      />
      {errors.title && (
        <p className="text-xs text-destructive">{errors.title.message}</p>
      )}
      <Input
        {...register("description")}
        placeholder="Description"
        className="text-slate-900"
      />
      {errors.description && (
        <p className="text-xs text-destructive">{errors.description.message}</p>
      )}
      <Textarea
        {...register("main")}
        placeholder="Main body"
        className="text-slate-900"
      />
      {errors.main && (
        <p className="text-xs text-destructive">{errors.main.message}</p>
      )}
      <Input {...register("image")} type="file" className="text-slate-900" />
      {errors.image && (
        <p className="text-xs text-destructive">{errors.image.message}</p>
      )}

      <Button disabled={isSubmitting}>{isSubmitting ? "..." : "Add"}</Button>
      {errors.root && (
        <p className="text-xs text-destructive">{errors.root.message}</p>
      )}
      {successMessage && (
        <p className="text-xs text-green-500">{successMessage}</p>
      )}
    </form>
  );
}

export default ArticleForm;
