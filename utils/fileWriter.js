import { promises as fs } from "fs";

export async function appendToFileEnd(filePath, content) {
  try {
    await fs.appendFile(filePath, "\n" + content, { encoding: "utf-8" });
  } catch (error) {
    throw new Error(`Error appending to file: ${error.message}`);
  }
}
export async function appendAroundLine(
  filePath,
  targetLine,
  content,
  position = "after"
) {
  try {
    const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
    const lines = fileContent.split("\n");

    const index = lines.indexOf(targetLine);

    if (index !== -1) {
      lines.splice(position === "before" ? index : index + 1, 0, content);
      const newContent = lines.join("\n");
      await fs.writeFile(filePath, newContent, { encoding: "utf-8" });
    } else {
      throw new Error(`Line "${targetLine}" not found in file.`);
    }
  } catch (error) {
    throw new Error(`Error appending around line: ${error.message}`);
  }
}
export async function appendAroundText(
  filePath,
  targetText,
  content,
  position = "before"
) {
  try {
    const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
    let startIndex, endIndex;

    if (position === "first" || position === "before") {
      startIndex = fileContent.indexOf(targetText);
    } else if (position === "last" || position === "after") {
      endIndex = fileContent.lastIndexOf(targetText);
    } else {
      throw new Error(`Invalid position: ${position}`);
    }

    if (startIndex !== -1 || endIndex !== -1) {
      const newContent = [
        fileContent.slice(0, startIndex || endIndex),
        content,
        fileContent.slice((startIndex || endIndex) + targetText.length),
      ].join("");
      await fs.writeFile(filePath, newContent, { encoding: "utf-8" });
    } else {
      throw new Error(`Text "${targetText}" not found in file.`);
    }
  } catch (error) {
    throw new Error(`Error appending around text: ${error.message}`);
  }
}
export async function overwriteEntireFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content, { encoding: "utf-8" });
  } catch (error) {
    throw new Error(`Error overwriting file: ${error.message}`);
  }
}
