"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaptainRole } from "@/core/cog/captain-role/types/captain-role";
import { CrewLevel } from "@/core/cog/crew-level/types/crew-level";
import { CrewMember } from "@/core/cog/crew-member/types/crew-member";
import { Nationality } from "@/core/cog/nationality/types/nationality";
import { Trait } from "@/core/cog/trait/types/trait";
import dynamic from "next/dynamic";
import { useState } from "react";
import { EditCrewMemberFormSkeleton } from "./form/edit";
import { EditExperienceFormSkeleton } from "./form/experience/edit";
const EditCrewMemberForm = dynamic(() => import("./form/edit"), {
  ssr: false,
  loading: () => <EditCrewMemberFormSkeleton />,
});
const EditExperienceForm = dynamic(() => import("./form/experience/edit"), {
  ssr: false,
  loading: () => <EditExperienceFormSkeleton />,
});

type AllTabs = "edit" | "experience";

interface Props {
  crewMember: CrewMember;
  playthroughId: string;
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  levels: CrewLevel[] | undefined;
}

const EditMemberMultiStep = ({
  crewMember,
  playthroughId,
  roles = [],
  nationalities = [],
  traits = [],
  levels = [],
}: Props) => {
  const [tabSelected, setTabSelected] = useState<AllTabs>("edit");

  return (
    <div>
      <Tabs
        value={tabSelected}
        onValueChange={(open) => setTabSelected(open as AllTabs)}
        className="gap-6"
      >
        <TabsList className="w-full shadow-sm">
          <TabsTrigger value="edit" className="data-[state=active]:shadow-xs">
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="data-[state=active]:shadow-xs"
            // disabled={crewMember.is_dead}
          >
            Experience
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardContent>
              <EditCrewMemberForm
                crewMember={crewMember}
                playthroughId={crewMember.playthrough.id}
                roles={roles}
                nationalities={nationalities}
                traits={traits}
                nextTab={() => {
                  setTabSelected("experience");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="experience">
          <EditExperienceForm
            member={crewMember}
            playthroughId={playthroughId}
            levels={levels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditMemberMultiStep;
