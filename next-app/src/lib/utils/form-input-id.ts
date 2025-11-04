export const formInputId = (formId: string) => {
  const inputId = (input: string) => `${formId}-${input}`;

  return {
    formId,
    inputId,
  };
};
