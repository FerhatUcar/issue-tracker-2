import { MembersOverview } from "@/app/workspaces/_components";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export default async function Page({ params }: Props) {
  const { workspaceId } = await params;

  return <MembersOverview workspaceId={workspaceId} />;
}
