"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trait } from "@/core/db/trait/types/trait";
import { useState } from "react";
import { CaptainRole } from "../types/captain-role";
import { CrewMember } from "../types/crew-member";
import { CrewLevel } from "../types/level";
import { Nationality } from "../types/nationality";
import EditCrewMemberForm from "./form/edit";
import EditExperienceForm from "./form/experience/edit";

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
