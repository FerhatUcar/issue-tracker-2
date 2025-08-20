import { Box } from "@radix-ui/themes";
import { MdOutlineRocketLaunch } from "react-icons/md";

export const Spinner = () => (
  <Box className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
    <MdOutlineRocketLaunch
      className="h-12 w-12 text-sky-500 animate-rocket"
      aria-label="Loading..."
    />
  </Box>
);
