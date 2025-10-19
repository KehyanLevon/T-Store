import { type InputHTMLAttributes } from "react";
import { InputField } from "../../shared/ui/InputField";

export interface ProfileFormState {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface ProfileFieldsProps {
  form: ProfileFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileFields({ form, onChange }: ProfileFieldsProps) {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        <InputField
          label="First Name"
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First name"
          value={form.firstName}
          onChange={
            onChange as InputHTMLAttributes<HTMLInputElement>["onChange"]
          }
          style={{ width: "79%" }}
        />

        <InputField
          label="Last Name"
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last name"
          value={form.lastName}
          onChange={
            onChange as InputHTMLAttributes<HTMLInputElement>["onChange"]
          }
          style={{ width: "79%" }}
        />
      </div>

      <InputField
        label="Date of Birth"
        id="birthDate"
        name="birthDate"
        type="date"
        value={form.birthDate}
        onChange={onChange as InputHTMLAttributes<HTMLInputElement>["onChange"]}
      />
    </>
  );
}
