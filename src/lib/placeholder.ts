import { readFileSync } from "node:fs";
import sharp from "sharp";

interface ImageWithFsPath {
  fsPath?: string;
  height: number;
  src: string;
  width: number;
}

export const generateBlurPlaceholder = async (
  src: ImageWithFsPath
): Promise<string> => {
  const fsPath = src.fsPath;
  if (!fsPath) {
    throw new Error("Cannot generate blur placeholder: no fsPath on image");
  }

  const buffer = await sharp(readFileSync(fsPath))
    .resize(20)
    .blur()
    .jpeg({ quality: 20 })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};
