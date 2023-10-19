import { Button } from "@radix-ui/themes";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  return <Button color="red">Delete issue</Button>;
};

export default DeleteIssueButton;
