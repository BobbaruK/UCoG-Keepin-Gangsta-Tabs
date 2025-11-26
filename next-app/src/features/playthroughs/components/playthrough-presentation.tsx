"use client";

import { CustomButton } from "@/components/custom-button";
import { BossIcon } from "@/components/icons/boss";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { crewMembersTitle } from "@/constants/page-title/crew-members";
import { lawsTitle } from "@/constants/page-title/laws";
import { playthroughTitle } from "@/constants/page-title/playthrough";
import { Law } from "@/core/db/law/types/law";
import { Playthrough } from "@/core/db/playthrough/types/playthrough";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

interface Props {
  playthrough: Playthrough;
  laws?: Law[];
  type?: "default" | "detailed";
}

const PlaythroughPresentation = ({
  playthrough,
  type = "default",
  laws = [],
}: Props) => {
  const [minimalSeeMore, setMinimalSeeMore] = useState(false);
  const { data: session } = useSession();

  const boss = playthrough.crew_members.find(
    (member) => member.is_boss === true,
  );
  const membersLength = playthrough.crew_members.length;
  const captains = playthrough.crew_members.filter(
    (member) => member.cog_captain_roleId !== null,
  );
  const captainsLength = captains.length;
  const managersLength = 1 - 1;
  const muscleLength =
    membersLength - 1 /* Boss */ - captainsLength - managersLength;

  const autoRoutesLength = 1 - 1;
  const stepsCount = 1 - 1;

  const copsLength = playthrough.police_officers.length;

  const buildingsLength = 1 - 1;

  const gamblingLength = 1 - 1;

  const showDanger = ({
    isActive,
    isNegative,
  }: {
    isActive: boolean | null;
    isNegative: boolean | null;
  }) => {
    if ((isActive && isNegative) || (!isActive && !isNegative)) {
      return "danger";
    }

    if ((isActive && !isNegative) || (!isActive && isNegative)) {
      return "success";
    }
  };

  if (type === "detailed")
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Seed: {playthrough.seed || "N/A"}</p>
            <p>
              Passenger train station:{" "}
              <Badge
                variant={
                  playthrough.passenger_rail_station ? "success" : "danger"
                }
              >
                {playthrough.passenger_rail_station ? "Yes" : "No"}
              </Badge>
            </p>
            <p>
              Freight train station:{" "}
              <Badge
                variant={
                  playthrough.freight_rail_station ? "success" : "danger"
                }
              >
                {playthrough.freight_rail_station ? "Yes" : "No"}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Laws</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {playthrough.laws.map((law) => (
                <li key={law.id} className="flex items-center gap-2">
                  <Button variant={"link"} size={"sm"} asChild className="p-0">
                    <Link href={`${lawsTitle.href}/${law.id}`}>{law.name}</Link>
                  </Button>

                  {law.sideEffect && (
                    <Badge
                      variant={
                        Math.sign(law.sideEffect.value) === 1
                          ? "success"
                          : "danger"
                      }
                    >
                      {law.sideEffect.name}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`${playthroughTitle.href}/${playthrough.id}`}>
            {playthrough.name}{" "}
            <Badge variant={playthrough.is_finished ? "danger" : "success"}>
              {playthrough.is_finished ? "Finished" : "Ongoing"}
            </Badge>
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <BossIcon />
          <Link
            href={`${playthroughTitle.href}/${playthrough.id + crewMembersTitle.href}/${boss?.id}`}
          >
            {boss?.full_name}
          </Link>
        </CardDescription>
        {playthrough.auth_userId === session?.user.id && (
          <CardAction>
            <CustomButton
              buttonLabel="Edit"
              variant={"outline"}
              linkHref={`${playthroughTitle.href}/${playthrough.id}/edit`}
              size="sm"
              skeletonClassName="h-8 w-[50px]"
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <Collapsible open={minimalSeeMore} onOpenChange={setMinimalSeeMore}>
          <CollapsibleTrigger asChild>
            <CustomButton
              buttonLabel={`Show ${minimalSeeMore ? "less" : "more"}`}
              size={"sm"}
              skeletonClassName="h-8 w-24"
              variant={minimalSeeMore ? "link" : "secondary"}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-wrap items-start gap-6 py-2">
            <div>
              <p>This outfit has:</p>
              <ul className="list-inside list-disc">
                <li>
                  <Badge variant={"success"}>{membersLength}</Badge> member
                  {membersLength === 1 ? "" : "s"}, of which{" "}
                  <Badge variant={"success"}>{captainsLength}</Badge>{" "}
                  {captainsLength === 1 ? "is" : "are"} captain
                  {captainsLength === 1 ? "" : "s"},{" "}
                  <Badge variant={"success"}>{managersLength}</Badge>{" "}
                  {managersLength === 1 ? "is" : "are"} manager
                  {captainsLength === 1 ? "" : "s"} and{" "}
                  <Badge variant={"success"}>{muscleLength}</Badge>{" "}
                  {muscleLength === 1 ? "is" : "are"} muscle.
                </li>
                <li>
                  <Badge variant={"info"}>{autoRoutesLength}</Badge> auto-route
                  {autoRoutesLength === 1 ? "" : "s"} with{" "}
                  <Badge variant={"info"}>{stepsCount}</Badge> steps in total.
                </li>
                <li>
                  <Badge variant={"success"}>{copsLength}</Badge> cop
                  {copsLength === 1 ? "" : "s"} bribed.
                </li>
                <li>
                  <Badge variant={"info"}>{buildingsLength}</Badge> building
                  {buildingsLength === 1 ? "" : "s"} equalling{" "}
                  <Badge variant={"info"}>{0}</Badge> in total and using{" "}
                  <Badge variant={"info"}>{0}</Badge> of them at the moment.
                </li>
                <li>
                  <Badge variant={"info"}>{gamblingLength}</Badge> gambling op
                  {gamblingLength === 1 ? "" : "s"} costing{" "}
                  <Badge variant={"info"}>{0}</Badge> weekly, with{" "}
                  <Badge variant={"info"}>{0}</Badge> cash on hand required in
                  total.
                </li>
              </ul>
            </div>
            <div>
              <p>Other:</p>
              <ul className="list-inside list-disc">
                {laws
                  .filter((law) => law.sideEffect !== null)
                  .map((law) => {
                    const isNegative =
                      law.sideEffect && Math.sign(law.sideEffect.value) === -1;
                    const isActive = playthrough.laws.find(
                      (playthroughLaw) => playthroughLaw.id === law.id,
                    );

                    return (
                      <li key={law.id}>
                        <Link href={`${lawsTitle.href}/${law.id}`}>
                          {law.name}
                        </Link>
                        :{" "}
                        <Badge
                          variant={showDanger({
                            isActive: !!isActive,
                            isNegative,
                          })}
                        >
                          {isActive ? "Yes" : "No"}
                        </Badge>
                      </li>
                    );
                  })}

                <li>
                  Passenger train station:{" "}
                  <Badge
                    variant={
                      playthrough.passenger_rail_station ? "success" : "danger"
                    }
                  >
                    {playthrough.passenger_rail_station ? "Yes" : "No"}
                  </Badge>
                </li>
                <li>
                  Freight train station:{" "}
                  <Badge
                    variant={
                      playthrough.freight_rail_station ? "success" : "danger"
                    }
                  >
                    {playthrough.freight_rail_station ? "Yes" : "No"}
                  </Badge>
                </li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default PlaythroughPresentation;
