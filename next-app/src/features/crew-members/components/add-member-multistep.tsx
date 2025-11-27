"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaptainRole } from "@/core/cog/captain-role/types/captain-role";
import { CrewLevel } from "@/core/cog/crew-level/types/crew-level";
import { Nationality } from "@/core/cog/nationality/types/nationality";
import { Trait } from "@/core/cog/trait/types/trait";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AddCrewMemberFormSkeleton } from "./form/add";
import { AddExperienceFormSkeleton } from "./form/experience/add";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
const AddCrewMemberForm = dynamic(() => import("./form/add"), {
  ssr: false,
  loading: () => <AddCrewMemberFormSkeleton />,
});
const AddCrewMemberExperienceForm = dynamic(
  () => import("./form/experience/add"),
  {
    ssr: false,
    loading: () => <AddExperienceFormSkeleton />,
  },
);

type AllTabs = "create" | "experience";

interface Props {
  playthrough: Playthrough;
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  levels: CrewLevel[] | undefined;
}

const AddMemberMultiStep = ({
  playthrough,
  roles = [],
  nationalities = [],
  traits = [],
  levels = [],
}: Props) => {
  const [tabSelected, setTabSelected] = useState<AllTabs>("create");
  const [crewMemberId, setCrewMemberId] = useState("");

  return (
    <div>
      <Tabs
        value={tabSelected}
        onValueChange={(open) => setTabSelected(open as AllTabs)}
        className="gap-6"
      >
        <TabsList className="w-full shadow-sm">
          <TabsTrigger
            value="create"
            disabled={tabSelected !== "create"}
            className="data-[state=active]:shadow-xs"
          >
            Create
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            disabled={tabSelected !== "experience"}
            className="data-[state=active]:shadow-xs"
          >
            Experience
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardContent>
              <AddCrewMemberForm
                playthrough={playthrough}
                roles={roles}
                nationalities={nationalities}
                traits={traits}
                memberCreated={(id) => {
                  setCrewMemberId(id);
                  setTabSelected("experience");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="experience">
          <AddCrewMemberExperienceForm
            playthrough={playthrough}
            memberId={crewMemberId}
            levels={levels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddMemberMultiStep;
