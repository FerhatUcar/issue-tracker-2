import React from "react";
import { Box } from "@radix-ui/themes";

export const Spinner = () => (
  <Box className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
    <output
      className="h-12 w-12 animate-spin rounded-full border-8 border-solid border-current border-r-transparent"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </output>
  </Box>
);
