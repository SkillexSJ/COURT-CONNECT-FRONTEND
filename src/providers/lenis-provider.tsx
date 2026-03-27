"use client";

import { ReactLenis } from "lenis/react";
import type { PropsWithChildren } from "react";

const LenisProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactLenis root options={{ duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
