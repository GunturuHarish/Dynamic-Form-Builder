
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/types/form";

interface DynamicFormFieldProps {
  field: FormField;
  value: string | boolean | string[];
  onChange: (value: string | boolean | string[]) => void;
  error: string | null;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
  };

  const handleRadioChange = (value: string) => {
    onChange(value);
  };

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            type={field.type}
            id={field.fieldId}
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={handleInputChange}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            className={error ? "border-student-error" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder || ""}
            value={value as string}
            onChange={handleInputChange}
            required={field.required}
            maxLength={field.maxLength}
            className={error ? "border-student-error" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            id={field.fieldId}
            value={value as string}
            onChange={handleInputChange}
            required={field.required}
            className={error ? "border-student-error" : ""}
            data-testid={field.dataTestId}
          />
        );

      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
            data-testid={field.dataTestId}
          >
            <SelectTrigger className={error ? "border-student-error" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={handleRadioChange}
            data-testid={field.dataTestId}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldId}
              checked={value as boolean}
              onCheckedChange={handleCheckboxChange}
              data-testid={field.dataTestId}
            />
            <Label htmlFor={field.fieldId}>{field.label}</Label>
          </div>
        );

      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {field.type !== "checkbox" && (
        <Label htmlFor={field.fieldId} className="font-medium">
          {field.label}
          {field.required && <span className="text-student-error ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-sm text-student-error">{error}</p>}
    </div>
  );
};

export default DynamicFormField;
