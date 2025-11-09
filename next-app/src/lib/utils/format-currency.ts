export const formatCurrency = ({
  value,
  currency = "USD",
  style = "currency",
  fractionDigits = {
    maxDecimals: 0,
    minDecimals: 0,
  },
}: {
  value: number | undefined;
  currency?: string | undefined;
  style?: "decimal" | "currency";
  fractionDigits?: {
    minDecimals?: number | undefined;
    maxDecimals?: number | undefined;
  };
}) => {
  if (value === undefined) {
    return "N/A";
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: style,
    currency: currency,
    minimumFractionDigits: fractionDigits?.minDecimals,
    maximumFractionDigits: fractionDigits?.maxDecimals,
  }).format(value);

  // If both minDecimals and maxDecimals are 0, replace ',' with '.'
  if (fractionDigits?.minDecimals === 0 && fractionDigits?.maxDecimals === 0) {
    return formattedValue.replace(/,/g, ".");
  }

  return formattedValue;
};
