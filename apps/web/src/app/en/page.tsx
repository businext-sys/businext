import { Landing, landingMetadata } from "@/components/landingpage/Landing";

export const metadata = landingMetadata("en");

export default function HomeEn() {
  return <Landing lang="en" />;
}
