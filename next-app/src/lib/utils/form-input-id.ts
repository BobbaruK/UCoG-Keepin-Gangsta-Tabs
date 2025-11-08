export const formInputId = (formId: string) => {
  const inputId = (input: string) => `${formId.replaceAll(" ", "-")}-${input}`;

  return {
    formId,
    inputId,
  };
};
