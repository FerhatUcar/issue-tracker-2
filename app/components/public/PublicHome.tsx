import { Box } from "@radix-ui/themes";
import Image from "next/image";
import { FeatureCards } from "./FeatureCard";

export const PublicHome = () => (
  <>
    <Box className="flex items-center">
      <Box className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
        <Box className="text-left flex-1">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Create <span className="text-cyan-500">rocket</span> fast issues..
          </h1>
          <p className="text-lg md:text-xl ">
            And manage your tickets like a pro with our sleek, modern interface.
          </p>
        </Box>

        <Box className="flex-1 flex justify-center">
          <Image
            src="/homepage.png"
            alt="Rocket illustration"
            width={400}
            height={400}
            className="md:w-[400px] h-auto drop-shadow-xl"
            priority
          />
        </Box>
      </Box>
    </Box>

    <FeatureCards />
  </>
);
