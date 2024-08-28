import { z } from "zod";

const schema = z.object({
  availableForRent: z.boolean(),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  sizeInFoot: z.number().min(1),
  priceInMonth: z.number().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.instanceof(FileList).refine((image) => image?.length == 1, 'Image is required.'),
  place: z.string().min(1),
  category: z.enum(["Holiday Rentals","Residential Spaces","Event Spaces","Commercial Properties"])
});


type PlaceTypes = z.infer<typeof schema>;

function PlaceForm() {
  return <form>PlaceForm</form>;
}

export default PlaceForm;
