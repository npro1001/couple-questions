"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import toast from "react-hot-toast";

export function GameSettings() {
  const {
    isHost,
    questionTypes,
    pocketLevel,
    storeUpdateQuestionTypes,
    storeUpdatePocketLevel,
  } = useGameStore();

  const handleSettingChange = <T,>(updateFn: (value: T) => void) => {
    return async (value: T) => {
      if (!isHost) {
        toast.error("Only the host can change the game settings");
        return;
      }
      updateFn(value); // Debouncing is handled in the store
    };
  };

  // Refactored handlers using the common function
  const handleQuestionTypeChange = handleSettingChange(
    storeUpdateQuestionTypes
  );
  const handlePocketLevelChange = handleSettingChange(storeUpdatePocketLevel);

  return (
    <Collapsible>
      <div className="flex items-center space-x-4 gap-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="p-4 hover:bg-black/5 w-full justify-center"
          >
            <div className="flex items-center gap-1">
              <h4 className="text-lg w-full">Settings</h4>
              <ChevronsUpDown className="h-4 font-semibold w-full" />
            </div>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-4 border border-black rounded-md p-4">
        <section className="flex flex-col w-full">
          <h2 className="mb-4 text-md">Question Types</h2>
          <div className="flex flex-grow w-full">
            <ToggleGroup
              className="flex-start justify-start w-full flex-grow"
              variant={"outline"}
              type="multiple"
              value={questionTypes}
              onValueChange={handleQuestionTypeChange}
            >
              <ToggleGroupItem
                className="border border-black flex-grow"
                value="get to know eachother"
              >
                Get to know eachother
              </ToggleGroupItem>
              <ToggleGroupItem
                className="border border-black flex-grow-0"
                value="scenarios"
              >
                Scenarios
              </ToggleGroupItem>
              <ToggleGroupItem
                className="border border-black flex-grow-0"
                value="actions"
              >
                Actions
              </ToggleGroupItem>
              <ToggleGroupItem
                className="border border-black flex-grow"
                value="a or b"
              >
                A or B and why
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {/* <h2 className="mb-4 mt-4 text-lg">Pocket Level</h2> */}
          <Separator className="bg-black/25 mt-4 mb-4" />
          <HoverCard>
            <HoverCardTrigger>
              <h2 className="mb-4 text-md hover:underline">
                Pocket Level <span className="text-xs">&#9432;</span>
              </h2>
            </HoverCardTrigger>
            <HoverCardContent>
              {'How "out-of-pocket" you want the questions to be 😁'}
            </HoverCardContent>
          </HoverCard>
          <div className="flex flex-col items-center">
            <Slider
              className="w-[100%] mb-1"
              defaultValue={[pocketLevel]}
              max={10}
              step={1}
              onValueChange={(value) => handlePocketLevelChange(value[0])}
              disabled={!isHost}
            />
            <div className="flex justify-between w-full">
              <p>In pocket</p>
              <p>Out of pocket af</p>
            </div>
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}
