import React from "react";
import { COPYRIGHT_NOTICE } from "../lib/copyright";

// Rendered once in App after the routes, so it sits at the end of every page
// in normal flow (never fixed) and does not cover game controls.
export function CopyrightFooter(): React.JSX.Element {
  return (
    <footer
      role="contentinfo"
      data-testid="copyright-footer"
      className="w-full bg-gray-900 text-gray-200 text-center text-sm py-3 px-4 print:bg-transparent print:text-gray-600"
    >
      {COPYRIGHT_NOTICE}
    </footer>
  );
}
