
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useFormContext } from "@/context/FormContext";
import FormSection from "@/components/FormSection";
import { useToast } from "@/components/ui/use-toast";

const FormPage: React.FC = () => {
  const { 
    user, 
    formResponse, 
    currentSectionIndex, 
    setCurrentSectionIndex,
    formData
  } = useFormContext();
  const { toast } = useToast();

  // Redirect to login if no user or form data
  if (!user || !formResponse) {
    return <Navigate to="/" />;
  }

  const sections = formResponse.form.sections;
  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    // Log the form data to console as requested
    console.log("Form submitted with data:", formData);

    toast({
      title: "Form Submitted",
      description: "Your form has been successfully submitted.",
    });
  };

  // Calculate progress percentage
  const progressPercentage = ((currentSectionIndex + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-student-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{formResponse.form.formTitle}</h1>
          <div className="mb-2 text-sm text-gray-600">
            Form ID: {formResponse.form.formId} | Version: {formResponse.form.version}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-sm font-medium">Progress:</div>
            <Progress value={progressPercentage} className="h-2 flex-1" />
            <div className="text-sm font-medium">
              {currentSectionIndex + 1}/{sections.length}
            </div>
          </div>
        </div>

        <FormSection
          section={currentSection}
          isLast={isLastSection}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default FormPage;
