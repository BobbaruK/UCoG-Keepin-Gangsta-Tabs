"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaptainRole } from "@/core/db/captain-role/types/captain-role";
import { CrewLevel } from "@/core/db/crew-level/types/crew-level";
import { Nationality } from "@/core/db/nationality/types/nationality";
import { Trait } from "@/core/db/trait/types/trait";
import { useState } from "react";
import AddCrewMemberForm from "./form/add";
import AddExperienceForm from "./form/experience/add";

type AllTabs = "create" | "experience";

interface Props {
  playthroughId: string;
  roles: CaptainRole[] | undefined;
  nationalities: Nationality[] | undefined;
  traits: Trait[] | undefined;
  levels: CrewLevel[] | undefined;
}

const AddMemberMultiStep = ({
  playthroughId,
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
                playthroughId={playthroughId}
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
          <AddExperienceForm
            playthroughId={playthroughId}
            memberId={crewMemberId}
            levels={levels}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddMemberMultiStep;
