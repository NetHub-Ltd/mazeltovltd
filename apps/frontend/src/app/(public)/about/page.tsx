import dynamic from "next/dynamic";

const AboutPageContent = dynamic(() => import("@/components/static-pages/about"), {

});

export default function AboutPage() {
  return <AboutPageContent />;
}
