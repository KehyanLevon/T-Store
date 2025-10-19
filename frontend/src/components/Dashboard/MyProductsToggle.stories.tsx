import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  MyProductsToggle,
  type MyProductsToggleProps,
} from "./MyProductsToggle";

function StatefulToggle(props: MyProductsToggleProps) {
  const [on, setOn] = useState(props.enabled);

  return (
    <MyProductsToggle
      enabled={on}
      onToggle={() => {
        setOn((v) => !v);
        props.onToggle?.();
      }}
      visible={props.visible}
    />
  );
}

const meta: Meta<typeof StatefulToggle> = {
  title: "Dashboard/MyProductsToggle",
  component: StatefulToggle,
  args: {
    enabled: false,
    visible: true,
    onToggle: () => {
      console.log("toggle clicked");
    },
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof StatefulToggle>;

export const Default: Story = {};

export const Enabled: Story = {
  args: { enabled: true },
};

export const Hidden: Story = {
  args: { visible: false },
};
