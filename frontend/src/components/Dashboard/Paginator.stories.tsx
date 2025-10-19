import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Paginator, type PaginatorProps } from "./Paginator";

function StatefulPaginator(props: PaginatorProps) {
  const { page, totalPages, onChange } = props;
  const [current, setCurrent] = useState(page);

  useEffect(() => setCurrent(page), [page]);

  return (
    <Paginator
      page={current}
      totalPages={totalPages}
      onChange={(p) => {
        setCurrent(p);
        onChange?.(p);
      }}
    />
  );
}

const meta: Meta<typeof StatefulPaginator> = {
  title: "Dashboard/Paginator",
  component: StatefulPaginator,
  args: {
    page: 3,
    totalPages: 10,
    onChange: (p: number) => {
      console.log("page ->", p);
    },
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof StatefulPaginator>;

export const Middle: Story = {};

export const FirstPage: Story = {
  args: { page: 1, totalPages: 10 },
};

export const LastPage: Story = {
  args: { page: 10, totalPages: 10 },
};

export const FewPages: Story = {
  args: { page: 2, totalPages: 3 },
};

export const ManyPages: Story = {
  args: { page: 7, totalPages: 25 },
};
