import { useAuthContext } from "@/components/contexts";
import { DashboardModule } from "@/components/modules";
import { useToast } from "@/components/ui/use-toast";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const DashboardPage: NextPage = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && !!user && !user.is_mentor) {
      router.push("/");
      toast({
        title: "Access Denied",
        description: "You cannot access the Dashboard page.",
      });
    }
  }, [router]);

  return <DashboardModule />;
};

export default DashboardPage;
