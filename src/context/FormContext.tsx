
import React, { createContext, useState, useContext, ReactNode } from "react";
import { FormData, FormResponse, User } from "../types/form";

interface FormContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  formResponse: FormResponse | null;
  setFormResponse: (formResponse: FormResponse | null) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  updateFormData: (fieldId: string, value: string | boolean | string[]) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const updateFormData = (fieldId: string, value: string | boolean | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  return (
    <FormContext.Provider
      value={{
        user,
        setUser,
        formResponse,
        setFormResponse,
        formData,
        setFormData,
        updateFormData,
        currentSectionIndex,
        setCurrentSectionIndex,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
