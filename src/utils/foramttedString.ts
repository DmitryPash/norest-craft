export const formattedString = (
  text: string,
  range: { from: number; to: number },
  percent: boolean,
): string => {
  if (!range) {
    return text;
  }
  const { from, to } = range;
  return text.replace(
    "$range",
    `${from}` + (percent ? "%" : "") + "-" + `${to}` + (percent ? "%" : ""),
  );
};
