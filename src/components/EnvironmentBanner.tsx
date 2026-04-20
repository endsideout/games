import React from "react";
import { isStagingEnvironment } from "../lib/environment";

export function EnvironmentBanner(): React.JSX.Element | null {
  if (!isStagingEnvironment()) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-600 text-white text-center font-semibold py-2 px-4 shadow">
      STAGING ENVIRONMENT - test data only
    </div>
  );
}
