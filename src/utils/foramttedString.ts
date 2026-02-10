export const formattedString = ({
  text,
  range,
  percent,
  isRandomNumber,
}: {
  text: string;
  range?: { from: number; to: number };
  percent?: boolean;
  isRandomNumber?: number;
}): string => {
  if (!range) {
    console.log("text");
    return text;
  }
  const { from, to } = range;

  if (isRandomNumber !== undefined) {
    return text.replace(
      "$range",
      `${isRandomNumber}` +
        (percent ? "%" : "") +
        "(" +
        `${from}` +
        (percent ? "%" : "") +
        "-" +
        `${to}` +
        (percent ? "%" : "") +
        ")",
    );
  }
  return text.replace(
    "$range",
    `${from}` + (percent ? "%" : "") + "-" + `${to}` + (percent ? "%" : ""),
  );
};
