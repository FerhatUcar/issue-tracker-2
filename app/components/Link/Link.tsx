import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

type Props = {
  /**
   * The URL to link to. This should be a valid Next.js route or an external URL.
   */
  href: string;

  /**
   * The text or elements to display as the link.
   */
  children: string;
};

export const Link = ({ href, children }: Props) => (
  <RadixLink asChild>
    <NextLink href={href}>{children}</NextLink>
  </RadixLink>
);
