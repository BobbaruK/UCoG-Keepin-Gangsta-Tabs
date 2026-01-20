"use client";

import { CustomButton } from "@/components/custom-button";
import { BuildingIcon } from "@/components/icons/building";
import { CapacityCalculatorIcon } from "@/components/icons/capacity-calculator";
import { ResetIcon } from "@/components/icons/reset";
import { VehicleIcon } from "@/components/icons/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { BuildingSize } from "../../building-size/types/building-size";
import { ResourceType } from "../../resource-type/types/resource-type";
import { VehicleType } from "../../vehicle-type/types/vehicle-type";

type SelectedTab = "vehicles" | "buildings";

interface Props {
  resourceTypes: ResourceType[] | undefined;
  vehicleTypes: VehicleType[] | undefined;
  buildingSizes: BuildingSize[] | undefined;
}

const CapacityCalculator = ({
  resourceTypes = [],
  vehicleTypes = [],
  buildingSizes = [],
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("vehicles");

  const [openVehicleType, setOpenVehicleType] = useState(false);
  const [openBuildingSize, setOpenBuildingSize] = useState(false);
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [buildingCapacity, setBuildingCapacity] = useState("");

  const actualVehicleCapacity = vehicleTypes.find(
    (vehicleType) => vehicleType.id === vehicleCapacity,
  );

  const actualBuildingCapacity = buildingSizes.find(
    (buildingSize) => buildingSize.id === buildingCapacity,
  );

  return (
    <div className="fixed end-4 bottom-2 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <CustomButton
            buttonLabel="Capacity calculator"
            icon={CapacityCalculatorIcon}
            iconPlacement="left"
            size={"icon"}
            variant={"info"}
            className="size-12 p-0 [&_svg]:size-7"
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Capacity calculator</SheetTitle>
            <SheetDescription>
              Calculate capacity for vehicles and buildings.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2 p-4">
            <Tabs
              value={selectedTab}
              onValueChange={(e) => setSelectedTab(e as SelectedTab)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vehicles">
                  Vehicles
                  <VehicleIcon />
                </TabsTrigger>
                <TabsTrigger value="buildings">
                  Buildings <BuildingIcon />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vehicles" className="space-y-2">
                <Popover
                  open={openVehicleType}
                  onOpenChange={setOpenVehicleType}
                >
                  <div className="flex items-center gap-2">
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openVehicleType}
                        className="w-full justify-between"
                      >
                        {actualVehicleCapacity ? (
                          <span>
                            {actualVehicleCapacity.name}{" "}
                            <small
                              dangerouslySetInnerHTML={{
                                __html: `(${ft3m3(actualVehicleCapacity.capacity).html})`,
                              }}
                            />
                          </span>
                        ) : (
                          "Select vehicle type..."
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <CustomButton
                      buttonLabel="Reset"
                      icon={ResetIcon}
                      iconPlacement="left"
                      size={"icon"}
                      className="size-9 min-w-9"
                      onClick={() => {
                        setVehicleCapacity("");
                      }}
                      disabled={!vehicleCapacity}
                    />
                  </div>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vehicle type..." />
                      <CommandList className="w-full">
                        <CommandEmpty>No vehicle type found.</CommandEmpty>
                        <CommandGroup>
                          {vehicleTypes.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.id}
                              onSelect={(currentValue) => {
                                setVehicleCapacity(
                                  currentValue === vehicleCapacity
                                    ? ""
                                    : currentValue,
                                );
                                setOpenVehicleType(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  vehicleCapacity === type.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {type.name}
                              <small
                                dangerouslySetInnerHTML={{
                                  __html: `(${ft3m3(type.capacity).html})`,
                                }}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Card>
                  <CardContent className="flex flex-col gap-2">
                    {resourceTypes.map((resourceType, index) => (
                      <Fragment key={resourceType.id}>
                        <p className="flex items-center justify-between">
                          <span>
                            {resourceType.name}{" "}
                            <small
                              dangerouslySetInnerHTML={{
                                __html: `(${ft3m3(resourceType.capacity).html})`,
                              }}
                            />
                          </span>
                          <span>
                            {!actualVehicleCapacity
                              ? "N/A"
                              : Math.floor(
                                  actualVehicleCapacity.capacity /
                                    resourceType.capacity,
                                )}
                          </span>
                        </p>
                        {index < resourceTypes.length - 1 && <hr />}
                      </Fragment>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="buildings" className="space-y-2">
                <Popover
                  open={openBuildingSize}
                  onOpenChange={setOpenBuildingSize}
                >
                  <div className="flex items-center gap-2">
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openBuildingSize}
                        className="w-full justify-between"
                      >
                        {actualBuildingCapacity ? (
                          <span>
                            {actualBuildingCapacity.name}{" "}
                            <small
                              dangerouslySetInnerHTML={{
                                __html: `(${ft3m3(actualBuildingCapacity.capacity).html})`,
                              }}
                            />
                          </span>
                        ) : (
                          "Select building size..."
                        )}

                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <CustomButton
                      buttonLabel="Reset"
                      icon={ResetIcon}
                      iconPlacement="left"
                      size={"icon"}
                      className="size-9 min-w-9"
                      onClick={() => {
                        setBuildingCapacity("");
                      }}
                      disabled={!buildingCapacity}
                    />
                  </div>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search building size..." />
                      <CommandList className="w-full">
                        <CommandEmpty>No building size found.</CommandEmpty>
                        <CommandGroup>
                          {buildingSizes.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.id}
                              onSelect={(currentValue) => {
                                setBuildingCapacity(
                                  currentValue === buildingCapacity
                                    ? ""
                                    : currentValue,
                                );
                                setOpenBuildingSize(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  buildingCapacity === type.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <span>
                                {type.name}{" "}
                                <small
                                  dangerouslySetInnerHTML={{
                                    __html: `(${ft3m3(type.capacity).html})`,
                                  }}
                                />
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Card>
                  <CardContent className="flex flex-col gap-2">
                    {resourceTypes.map((resourceType, index) => (
                      <Fragment key={resourceType.id}>
                        <p className="flex items-center justify-between">
                          <span>
                            {resourceType.name}{" "}
                            <small
                              dangerouslySetInnerHTML={{
                                __html: `(${ft3m3(resourceType.capacity).html})`,
                              }}
                            />
                          </span>
                          <span>
                            {!actualBuildingCapacity
                              ? "N/A"
                              : Math.floor(
                                  actualBuildingCapacity.capacity /
                                    resourceType.capacity,
                                )}
                          </span>
                        </p>
                        {index < resourceTypes.length - 1 && <hr />}
                      </Fragment>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CapacityCalculator;
