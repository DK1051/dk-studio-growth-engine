import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Nav from "@/components/dk/Nav";
import Hero from "@/components/dk/Hero";
import About from "@/components/dk/About";
import Work from "@/components/dk/Work";
import Pricing, { type ServiceValue } from "@/components/dk/Pricing";
import Contact from "@/components/dk/Contact";
import Footer from "@/components/dk/Footer";

const title = "DK Studio — Website audits, redesign, and build";
const description =
  "We audit, redesign, and build websites that perform. A clear audit, honest insight, and design that converts.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [service, setService] = useState<ServiceValue>("free-audit");

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Pricing onSelect={setService} />
        <Contact service={service} setService={setService} />
      </main>
      <Footer />
    </div>
  );
}
