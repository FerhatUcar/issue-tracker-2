"use client";

import { Card } from "@radix-ui/themes";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { useThemeToggle } from "./providers";

type Props = {
  /**
   * Number of open issues
   */
  open: number;

  /**
   * Number of issues in progress
   */
  inProgress: number;

  /**
   * Number of closed issues
   */
  closed: number;
};

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const { appearance } = useThemeToggle();

  const data = [
    { label: "Open", value: open },
    { label: "In Progress", value: inProgress },
    { label: "Closed", value: closed },
  ];

  const tickColor = appearance === "dark" ? "white" : "black";

  return (
    <Card>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis tick={{ fill: tickColor }} dataKey="label" />
          <YAxis tick={{ fill: tickColor }} />
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: "var(--accent-9)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;
