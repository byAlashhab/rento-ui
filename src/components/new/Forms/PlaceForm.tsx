import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const schema = z.object({
  availableForRent: z.boolean(),
  bedrooms: z.string().min(1),
  bathrooms: z.string().min(1),
  sizeInFoot: z.string().min(1),
  priceInMonth: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z
    .instanceof(FileList)
    .refine((image) => image?.length === 1, "Image is required."),
  place: z.string().min(1),
  category: z.string().min(1),
});

type PlaceTypes = z.infer<typeof schema>;

function PlaceForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<PlaceTypes>({ resolver: zodResolver(schema) });

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const addPlace: SubmitHandler<PlaceTypes> = async (data) => {
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
      
      const res = await fetch(`${import.meta.env.VITE_RENTO_API}/places`, {
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
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  return (
    <form
      className="text-white flex flex-col gap-1 bg-white p-2 rounded my-2 w-[600px] mx-auto"
      onSubmit={handleSubmit(addPlace)}
    >
      <Input
        {...register("bedrooms")}
        type="number"
        placeholder="Bedrooms"
        className="text-slate-900"
      />
      {errors.bedrooms && (
        <p className="text-xs text-destructive">{errors.bedrooms.message}</p>
      )}
      <Input
        {...register("bathrooms")}
        type="number"
        placeholder="Bathrooms"
        className="text-slate-900"
      />
      {errors.bathrooms && (
        <p className="text-xs text-destructive">{errors.bathrooms.message}</p>
      )}
      <Input
        {...register("sizeInFoot")}
        type="number"
        placeholder="Size in foot"
        className="text-slate-900"
      />
      {errors.sizeInFoot && (
        <p className="text-xs text-destructive">{errors.sizeInFoot.message}</p>
      )}
      <Input
        {...register("priceInMonth")}
        type="number"
        placeholder="Price in month $"
        className="text-slate-900"
      />
      {errors.priceInMonth && (
        <p className="text-xs text-destructive">
          {errors.priceInMonth.message}
        </p>
      )}
      <Input
        {...register("title")}
        type="text"
        placeholder="Title"
        className="text-slate-900"
      />
      {errors.title && (
        <p className="text-xs text-destructive">{errors.title.message}</p>
      )}
      <Input
        {...register("description")}
        type="text"
        placeholder="Description"
        className="text-slate-900"
      />
      {errors.description && (
        <p className="text-xs text-destructive">{errors.description.message}</p>
      )}
      <Input
        {...register("place")}
        type="text"
        placeholder="Place format: country/city"
        className="text-slate-900"
      />
      {errors.place && (
        <p className="text-xs text-destructive">{errors.place.message}</p>
      )}
      <Input
        {...register("image", { required: true })}
        type="file"
        className="text-slate-900"
      />
      {errors.image && (
        <p className="text-xs text-destructive">{errors.image.message}</p>
      )}
      <Select
        value={selectedCategory}
        onValueChange={(value) => {
          setSelectedCategory(value); // Update local state
          setValue("category", value, { shouldValidate: true }); // Update form state and trigger validation
        }}
      >
        <SelectTrigger className="w-[180px] text-slate-900">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <SelectItem value="Holiday Rentals">Holiday Rentals</SelectItem>
            <SelectItem value="Residential Spaces">
              Residential Spaces
            </SelectItem>
            <SelectItem value="Event Spaces">Event Spaces</SelectItem>
            <SelectItem value="Commercial Properties">
              Commercial Properties
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors.category && (
        <p className="text-xs text-destructive">{errors.category.message}</p>
      )}
      <Label className="flex items-center justify-start gap-1 text-black">
        <Input
          className="size-4"
          type="checkbox"
          {...register("availableForRent")}
        />
        Available for Rent
      </Label>
      {errors.availableForRent && (
        <p className="text-xs text-destructive">
          {errors.availableForRent.message}
        </p>
      )}
      <Button disabled={isSubmitting}>Add</Button>
      {errors.root && (
        <p className="text-xs text-destructive">{errors.root.message}</p>
      )}
      {successMessage && (
        <p className="text-xs text-green-500">{successMessage}</p>
      )}
    </form>
  );
}

export default PlaceForm;
