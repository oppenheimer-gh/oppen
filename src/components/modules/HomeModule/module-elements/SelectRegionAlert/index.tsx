import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import { useAuthContext, useHomeContext } from "@/components/contexts";
import { Button } from "@/components/ui/button";

export const SelectRegionAlert: React.FC = () => {
  const { user } = useAuthContext();
  const { pinpointType, setOpenSheet } = useHomeContext();

  return (
    <Alert className="flex items-center justify-between">
      <div className="flex flex-col">
        <AlertTitle className="flex items-center gap-2 font-semibold">
          <RocketIcon className="h-4 w-4" />
          {!user
            ? "Login to experience a different way of interacting."
            : user?.has_posted
            ? "Explore the map!"
            : pinpointType === "src"
            ? "Where did you live before living abroad?"
            : pinpointType === "dest"
            ? "Where are you right now?"
            : "All set!"}
        </AlertTitle>
        <AlertDescription>
          {!user
            ? "To make posts and connect with language mentors, you must login."
            : user?.has_posted
            ? "Traverse through the globe to see your penpals!"
            : pinpointType === "src"
            ? "You can select a region by clicking the map."
            : "You can click the confirm button to continue."}
        </AlertDescription>
      </div>

      {pinpointType === "done" ? (
        <div className="flex items-center gap-2">
          <Button onClick={() => setOpenSheet(true)}>Confirm</Button>
        </div>
      ) : null}
    </Alert>
  );
};
