export type IssueType = {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: Date;
  updateAt: Date;
};

type Status = "OPEN" | "IN_PROGRESS" | "CLOSED";
