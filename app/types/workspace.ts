import { Prisma } from "@prisma/client";

export const workspaceCardSelect = Prisma.validator<Prisma.WorkspaceSelect>()({
  id: true,
  name: true,
  _count: { select: { issues: true } },
  memberships: {
    take: 4,
    orderBy: { user: { name: "asc" } },
    select: { user: { select: { name: true, image: true } } },
  },
});

export type WorkspaceCardData = Prisma.WorkspaceGetPayload<{
  select: typeof workspaceCardSelect;
}>;
