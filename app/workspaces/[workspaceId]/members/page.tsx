import { MembersOverview } from "@/app/workspaces/_components";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default function Page({ params }: Props) {
  return <MembersOverview workspaceId={params.workspaceId} />;
}
