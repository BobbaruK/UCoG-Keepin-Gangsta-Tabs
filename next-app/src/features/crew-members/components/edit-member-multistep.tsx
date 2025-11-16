"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CaptainRole } from "../types/captain-role";
import { CrewMember } from "../types/crew-member";
import { CrewLevel } from "../types/level";
import { Nationality } from "../types/nationality";
import { Trait } from "../types/traits";
import EditCrewMemberForm from "./form/edit";
import AddExperienceForm from "./form/experience/add";
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
  const [crewMemberId, setCrewMemberId] = useState("");

  return (
    <div>
      <Tabs
        value={tabSelected}
        onValueChange={(open) => setTabSelected(open as AllTabs)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
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
