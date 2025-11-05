import { MIN_USERNAME, MAX_USERNAME } from "@/constants/misc";
import z from "zod";

export const DESCRIPTION = z.string().optional();
