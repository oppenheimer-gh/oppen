import { HomeContextProvider } from "@/components/contexts";
import { HomeModule } from "@/components/modules";

export default function Home() {
  return (
    <HomeContextProvider>
      <HomeModule />
    </HomeContextProvider>
  );
}
