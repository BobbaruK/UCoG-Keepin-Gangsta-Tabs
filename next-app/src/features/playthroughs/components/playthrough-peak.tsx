"use client";

import { CustomButton } from "@/components/custom-button";
import { BossIcon } from "@/components/icons/boss";
import { Badge } from "@/components/ui/badge";
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
import { Law } from "@/core/cog/law/types/law";
import { Playthrough } from "@/core/cog/playthrough/types/playthrough";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize-first-letter";
import { formatCurrency } from "@/lib/utils/format-currency";
import { ft3m3 } from "@/lib/utils/ft3-m3";
import { Session } from "@/types/session";
import Link from "next/link";
import { useState } from "react";
import { playthroughPeak } from "../utils/playthrough-peak";

interface Props {
  session: Session | null;
  playthrough: Playthrough;
  laws: Law[] | undefined;
}

const PlaythroughPeak = ({ playthrough, session, laws = [] }: Props) => {
  const [minimalSeeMore, setMinimalSeeMore] = useState(false);

  const {
    autoRoutesLength,
    boss,
    buildingsCapacity,
    buildingsLength,
    buildingsUsedLength,
    captainsLength,
    copsLength,
    gamblingCashOnHand,
    gamblingLength,
    gamblingWeeklyCosts,
    managersLength,
    membersLength,
    muscleLength,
    stepsCount,
  } = playthroughPeak({ playthrough });

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
        {session && playthrough.auth_userId === session.user.id && (
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
                  <Badge variant={"secondary"} className="font-medium">
                    {membersLength}
                  </Badge>{" "}
                  member
                  {membersLength === 1 ? "" : "s"}, of which{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {captainsLength}
                  </Badge>{" "}
                  {captainsLength === 1 ? "is" : "are"} captain
                  {captainsLength === 1 ? "" : "s"},{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {managersLength}
                  </Badge>{" "}
                  {managersLength === 1 ? "is" : "are"} manager
                  {captainsLength === 1 ? "" : "s"} and{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {muscleLength}
                  </Badge>{" "}
                  {muscleLength === 1 ? "is" : "are"} muscle.
                </li>
                <li>
                  <Badge variant={"secondary"} className="font-medium">
                    {autoRoutesLength}
                  </Badge>{" "}
                  auto-route
                  {autoRoutesLength === 1 ? "" : "s"} with{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {stepsCount}
                  </Badge>{" "}
                  steps in total.
                </li>
                <li>
                  <Badge variant={"secondary"} className="font-medium">
                    {copsLength}
                  </Badge>{" "}
                  cop
                  {copsLength === 1 ? "" : "s"} bribed.
                </li>
                <li>
                  <Badge variant={"secondary"} className="font-medium">
                    {buildingsLength}
                  </Badge>{" "}
                  building
                  {buildingsLength === 1 ? "" : "s"} equalling{" "}
                  <Badge
                    variant={"secondary"}
                    dangerouslySetInnerHTML={{
                      __html: ft3m3(buildingsCapacity).html,
                    }}
                  />{" "}
                  in total and using{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {buildingsUsedLength}
                  </Badge>{" "}
                  of them at the moment.
                </li>
                <li>
                  <Badge variant={"secondary"} className="font-medium">
                    {gamblingLength}
                  </Badge>{" "}
                  gambling op
                  {gamblingLength === 1 ? "" : "s"} costing{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {formatCurrency({
                      value: gamblingWeeklyCosts,
                    })}
                  </Badge>{" "}
                  weekly, with{" "}
                  <Badge variant={"secondary"} className="font-medium">
                    {formatCurrency({ value: gamblingCashOnHand })}
                  </Badge>{" "}
                  cash on hand required in total.
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
                        <CustomButton
                          buttonLabel={capitalizeFirstLetter(
                            law.name.toLowerCase(),
                          )}
                          linkHref={`${lawsTitle.href}/${law.id}`}
                          variant={"link"}
                          noEffect
                          className="h-auto p-0"
                        />
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

export default PlaythroughPeak;
