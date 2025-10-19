import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InputField, type InputFieldProps } from "./InputField";

function StatefulInputField(props: InputFieldProps) {
  const [val, setVal] = useState(props.value ?? "");

  return (
    <InputField
      {...props}
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        props.onChange?.(e);
      }}
    />
  );
}

const meta: Meta<typeof StatefulInputField> = {
  title: "Shared/InputField",
  component: StatefulInputField,
  args: {
    label: "First Name",
    id: "firstName",
    name: "firstName",
    placeholder: "John",
    value: "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Input value:", e.target.value);
    },
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
  },
};
export default meta;
type Story = StoryObj<typeof StatefulInputField>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { value: "Alice" },
};

export const WithDateType: Story = {
  args: {
    label: "Birth Date",
    id: "birthDate",
    name: "birthDate",
    type: "date",
  },
};
