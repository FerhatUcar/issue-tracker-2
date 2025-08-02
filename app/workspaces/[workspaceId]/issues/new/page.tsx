import dynamic from "next/dynamic";
import IssueFormSkeleton from "@/app/workspaces/[workspaceId]/issues/_components/IssueFormSkeleton";

const IssueForm = dynamic(
  () => import("@/app/workspaces/[workspaceId]/issues/_components/IssueForm"),
  {
    ssr: false,
    loading: () => <IssueFormSkeleton />,
  },
);

const NewIssuesPage = () => <IssueForm />;

export default NewIssuesPage;
