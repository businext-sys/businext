import { Landing, landingMetadata } from "@/components/landingpage/Landing";

export const metadata = landingMetadata("es");

export default function Home() {
  return <Landing lang="es" />;
}
