import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  ...props
}) => {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="input" {...props} />
    </div>
  );
};
