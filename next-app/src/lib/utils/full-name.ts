export const setFullName = ({
  firstName,
  lastName,
  alias,
}: {
  firstName: string;
  lastName: string;
  alias?: string | null;
}) => {
  const outputFE = `${firstName} ${alias ? `'${alias}'` : ""} ${lastName}`;
  
  const outputDB = `${firstName} ${lastName}${alias ? ` ${alias}` : ""}`;

  return { outputFE, outputDB };
};
