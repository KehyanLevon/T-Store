import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchBar, type SearchBarProps } from "./SearchBar";

function StatefulSearchBar(props: SearchBarProps) {
  const [val, setVal] = useState(props.value);
  return (
    <SearchBar
      value={val}
      onChange={(next) => {
        setVal(next);
        props.onChange?.(next);
      }}
    />
  );
}

const meta: Meta<typeof StatefulSearchBar> = {
  title: "Dashboard/SearchBar",
  component: StatefulSearchBar,
  args: {
    value: "",
    onChange: (v: string) => {
      console.log("search query ->", v);
    },
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof StatefulSearchBar>;

export const Empty: Story = {};

export const Prefilled: Story = {
  args: { value: "Headphones" },
};
