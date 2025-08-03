import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

type Props = {
  /**
   * Represents the unique identifier for an issue.
   * This value is expected to be a numeric identifier used to distinguish individual issues.
   */
  issueId: number;

  /**
   * A unique identifier representing a specific workspace.
   * This ID is typically used to differentiate between various workspaces
   * within a system or application.
   */
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
