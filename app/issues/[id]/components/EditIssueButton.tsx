import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

type Props = {
  issueId: number;
}

export const EditIssueButton = ({ issueId }: Props) => (
  <Link href={`/issues/edit/${issueId}`}>
    <Button className="w-full" variant="soft">
      <Pencil2Icon />
      Edit
    </Button>
  </Link>
);
