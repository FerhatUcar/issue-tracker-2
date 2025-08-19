import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const WorkspaceLayout = ({ children }: Props) => <main>{children}</main>;

export default WorkspaceLayout;
