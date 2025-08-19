"use client";

import { Card } from "@radix-ui/themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
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
        <BarChart
          data={data}
          margin={{ top: 16, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis tick={{ fill: tickColor }} dataKey="label" />
          <YAxis tick={{ fill: tickColor }} allowDecimals={false} width={40} />
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
