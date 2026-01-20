import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MainWrapper } from "@/components/main-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import CapacityCalculator from "@/core/cog/capacity-calculator/components/calculator";
import { getBuildingSizes } from "@/features/building-sizes/data/get-building-sizes";
import { getResourceTypes } from "@/features/resource-types/data/get-resource-types";
import { getVehicleTypes } from "@/features/vehicle-types/data/get-vehicle-types";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default async function PublicLayout({ children }: Props) {
  const resourceTypes = await getResourceTypes();
  const vehicleTypes = await getVehicleTypes();
  const buildingSizes = await getBuildingSizes();

  // console.log({ resourceTypes });

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <MainWrapper header={<Header />} footer={<Footer />}>
        {children}

        <CapacityCalculator
          resourceTypes={resourceTypes?.data}
          vehicleTypes={vehicleTypes?.data}
          buildingSizes={buildingSizes?.data}
        />
      </MainWrapper>
    </SidebarProvider>
  );
}
