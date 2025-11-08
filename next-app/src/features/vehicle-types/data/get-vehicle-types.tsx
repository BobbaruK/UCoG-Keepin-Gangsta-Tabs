import { PAGINATION_DEFAULT } from "@/constants/table";
import { Prisma } from "@/generated/prisma";
import db from "@/lib/prisma";
import { VehicleType } from "../types/vehicle-type";

export const getVehicleTypes = async ({
  where,
  perPage,
  pageNumber,
  orderBy,
}: {
  where?: Prisma.cog_vehicle_typeWhereInput;
  perPage?: number;
  pageNumber?: number;
  orderBy?: Prisma.cog_vehicle_typeOrderByWithRelationInput;
}) => {
  const pageSize = perPage || PAGINATION_DEFAULT;
  const skip = pageNumber ? pageNumber * pageSize : 0;

  try {
    const [data, count] = await db.$transaction([
      db.cog_vehicle_type.findMany({
        ...(orderBy ? { orderBy } : {}),
        ...(where ? { where } : {}),
        skip,
        take: perPage && Math.sign(perPage) === 1 ? pageSize : undefined,
      }),
      db.cog_vehicle_type.count(),
    ]);

    const vehicleTypes = data as VehicleType[];

    return { data: vehicleTypes, count };
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};

export const getVehicleType = async (id: string) => {
  try {
    const law = await db.cog_vehicle_type.findUnique({
      where: {
        id,
      },
    });

    return law;
  } catch (error) {
    console.error("Something went wrong: ", JSON.stringify(error));

    return null;
  }
};
