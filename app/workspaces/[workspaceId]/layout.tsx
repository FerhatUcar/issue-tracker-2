type Props = {
  children: React.ReactNode;
};

const WorkspaceLayout = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default WorkspaceLayout;
