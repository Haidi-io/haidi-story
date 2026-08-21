import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { Header } from "@/components/ui/Header";
import { ContactModal } from "@/components/ui/ContactModal";
import { Ch0Signal } from "@/components/chapters/Ch0Signal";
import { Ch1Noise } from "@/components/chapters/Ch1Noise";
import { Ch2Forecast } from "@/components/chapters/Ch2Forecast";
import { Ch3Decision } from "@/components/chapters/Ch3Decision";
import { Ch4Workspace } from "@/components/chapters/Ch4Workspace";
import { Ch5Configure } from "@/components/chapters/Ch5Configure";
import { Ch6Launch } from "@/components/chapters/Ch6Launch";
import { Ch7Outro } from "@/components/chapters/Ch7Outro";

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <Header />
      <main className="relative z-10">
        <Ch0Signal />
        <Ch1Noise />
        <Ch2Forecast />
        <Ch3Decision />
        <Ch4Workspace />
        <Ch5Configure />
        <Ch6Launch />
        <Ch7Outro />
      </main>
      <ContactModal />
    </>
  );
}
