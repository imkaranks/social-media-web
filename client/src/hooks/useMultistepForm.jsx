import { useCallback, useState } from "react";

function useMultistepForm(stepComps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep >= stepComps.length - 1) return prevStep;
      return prevStep + 1;
    });
  }, [stepComps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep <= 0) return prevStep;
      return prevStep - 1;
    });
  }, []);

  const jumpToStep = useCallback((index) => {
    setCurrentStep(index);
  }, []);

  return {
    stepComps,
    currentStep,
    stepComp: stepComps[currentStep],
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === stepComps.length - 1,
    nextStep,
    prevStep,
    jumpToStep,
  };
}

export default useMultistepForm;
