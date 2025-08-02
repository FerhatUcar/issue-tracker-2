import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

type Props = {
  issueId: number;
  workspaceId: string;
};

export const EditIssueButton = ({ issueId, workspaceId }: Props) => (
  <Link href={`/workspaces/${workspaceId}/issues/edit/${issueId}`}>
    <Button className="w-full" variant="soft">
      <Pencil2Icon />
      Edit
    </Button>
  </Link>
);
