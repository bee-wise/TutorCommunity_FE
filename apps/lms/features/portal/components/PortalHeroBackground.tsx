"use client";

import dynamic from "next/dynamic";

const DotGrid = dynamic(() => import("./react-bits/DotGrid").then((module) => module.DotGrid), { ssr: false });

export function PortalHeroBackground() {
  return <DotGrid />;
}
