"use client";

import { Card } from "@radix-ui/themes";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { useThemeToggle } from "@/app/providers";

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

export const IssueChart = ({ open, inProgress, closed }: Props) => {
  const { appearance } = useThemeToggle();

  const data = [
    { label: "Open", value: open },
    { label: "In Progress", value: inProgress },
    { label: "Closed", value: closed },
  ];

  const tickColor = appearance === "dark" ? "white" : "black";

  return (
    <Card>
      <ResponsiveContainer height={300}>
        <BarChart data={data}>
          <XAxis tick={{ fill: tickColor }} dataKey="label" />
          <YAxis tick={{ fill: tickColor }} allowDecimals={false}  />
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
