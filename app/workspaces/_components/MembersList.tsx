"use client";

import { useState } from "react";
import { MemberCard } from "./MemberCard";
import { Role } from "@prisma/client";

type SlimUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type MemberItem = {
  user: SlimUser;
  role: Role;
  isCurrentUser: boolean;
  showMenu: boolean;
};

type Props = {
  members: MemberItem[];
  workspaceId: string;
};

export const MembersList = ({ members, workspaceId }: Props) => {
  const [promotedId, setPromotedId] = useState<string | null>(null);

  return (
    <>
      {members.map((m) => (
        <MemberCard
          key={m.user.id}
          workspaceId={workspaceId}
          user={m.user}
          role={m.role}
          isCurrentUser={m.isCurrentUser}
          showMenu={m.showMenu}
          glow={promotedId === m.user.id}
          onPromote={() => setPromotedId(m.user.id)}
        />
      ))}
    </>
  );
};
