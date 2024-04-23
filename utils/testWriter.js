import {
  appendToFileEnd,
  appendAroundLine,
  appendAroundText,
  overwriteEntireFile,
} from "./fileWriter.js";

appendToFileEnd("./index.txt", "This is a test.");
appendAroundLine("./index.txt", "F", "This is a test.", "after");
