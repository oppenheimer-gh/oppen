import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import { useHomeContext } from "@/components/contexts";
import { Button } from "@/components/ui/button";

export const SelectRegionAlert: React.FC = ({}) => {
  const { pinpointType, setOpenSheet } = useHomeContext();

  return (
    <Alert className="flex items-center justify-between">
      <div className="flex flex-col">
        <AlertTitle className="flex items-center gap-2">
          <RocketIcon className="h-4 w-4" />
          {pinpointType === "src"
            ? "Where do you come from?"
            : "Where are you right now?"}
        </AlertTitle>
        <AlertDescription>
          You can select a region by clicking the map.
        </AlertDescription>
      </div>

      {pinpointType === "done" ? (
        <Button onClick={() => setOpenSheet(true)}>Confirm</Button>
      ) : null}
    </Alert>
  );
};
