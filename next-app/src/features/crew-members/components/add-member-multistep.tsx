"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CaptainRole } from "../types/captain-role";
import { CrewLevel } from "../types/level";
import { Nationality } from "../types/nationality";
import { Trait } from "../types/traits";
import AddCrewMemberForm from "./form/add";
import AddExperienceForm from "./form/experience/add";
import { Card, CardContent } from "@/components/ui/card";

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
