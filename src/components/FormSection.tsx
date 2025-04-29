
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormSection as FormSectionType, FormField } from "@/types/form";
import { useFormContext } from "@/context/FormContext";
import DynamicFormField from "./DynamicFormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  section: FormSectionType;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

interface ValidationErrors {
  [key: string]: string | null;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  isLast,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSectionValid, setIsSectionValid] = useState(false);

  // Initialize form data with default values for the fields in this section
  useEffect(() => {
    section.fields.forEach((field) => {
      if (formData[field.fieldId] === undefined) {
        const defaultValue = field.type === "checkbox" ? false : "";
        updateFormData(field.fieldId, defaultValue);
      }
    });
  }, [section.fields]);

  // Validate all fields when form data changes
  useEffect(() => {
    validateAllFields();
  }, [formData]);

  const validateField = (field: FormField, value: string | boolean | string[]): string | null => {
    // For checkboxes, only validate if they're required
    if (field.type === "checkbox") {
      if (field.required && value === false) {
        return field.validation?.message || "This field is required";
      }
      return null;
    }

    // For other field types
    const stringValue = value as string;

    // Check required fields
    if (field.required && (!stringValue || stringValue.trim() === "")) {
      return field.validation?.message || "This field is required";
    }

    // Check minLength if specified
    if (field.minLength && stringValue.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }

    // Check maxLength if specified
    if (field.maxLength && stringValue.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }

    // If field type is email, validate email format
    if (field.type === "email" && stringValue && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(stringValue)) {
      return "Please enter a valid email address";
    }

    // If field type is tel, validate phone format (basic validation)
    if (field.type === "tel" && stringValue && !/^\d{10,15}$/.test(stringValue)) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const validateAllFields = () => {
    const newErrors: ValidationErrors = {};
    let valid = true;

    section.fields.forEach((field) => {
      const value = formData[field.fieldId];
      const errorMessage = validateField(field, value);
      
      newErrors[field.fieldId] = errorMessage;
      
      if (errorMessage) {
        valid = false;
      }
    });

    setErrors(newErrors);
    setIsSectionValid(valid);
  };

  const handleFieldChange = (fieldId: string, value: string | boolean | string[]) => {
    updateFormData(fieldId, value);
  };

  const handleNextClick = () => {
    if (isSectionValid) {
      onNext();
    } else {
      validateAllFields();
    }
  };

  const handleSubmitClick = () => {
    if (isSectionValid) {
      onSubmit();
    } else {
      validateAllFields();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {section.fields.map((field) => (
            <DynamicFormField
              key={field.fieldId}
              field={field}
              value={formData[field.fieldId] || (field.type === "checkbox" ? false : "")}
              onChange={(value) => handleFieldChange(field.fieldId, value)}
              error={errors[field.fieldId] || null}
            />
          ))}
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              className="w-24"
            >
              Previous
            </Button>
            
            {isLast ? (
              <Button
                type="button"
                onClick={handleSubmitClick}
                disabled={!isSectionValid}
                className="w-24 bg-student-primary hover:bg-student-accent"
              >
                Submit
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextClick}
                disabled={!isSectionValid}
                className="w-24 bg-student-primary hover:bg-student-accent"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormSection;
