import { MAX_USERNAME, MIN_USERNAME } from "@/constants/misc";
import { NONNEGATIVE_NUMBER } from "@/schemas/form/number";
import { z } from "zod";

export const AddBuildingPassiveSchema = z.object({
  quantity: NONNEGATIVE_NUMBER("Quantity"),
  resource: z.string(),
});
