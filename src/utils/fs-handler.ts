import { IConfigurationStore } from "./../models/store-model";
import { IData } from "@/models/month-model";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";

const dir = BaseDirectory.App;

const createDataFolder = async () => {
  try {
    await createDir("data", { dir: dir, recursive: true });
  } catch (error) {
    console.error(`Could not create data dir because of ${error}`);
  }
};

const createFile = async (fileName: string, content: string) => {
  try {
    await writeFile(
      { contents: content, path: `./data/${fileName}.json` },
      { dir: BaseDirectory.App }
    );
  } catch (error) {
    console.error(`Could not create file ${fileName} because of ${error}`);
  }
};

const readFile = async (
  fileName: string
): Promise<IData | IConfigurationStore | undefined> => {
  try {
    const file = await readTextFile(`data/${fileName}`, { dir: dir });
    return JSON.parse(file);
  } catch (error) {
    console.error(`Could not read file ${fileName} because of ${error}`);
    return undefined;
  }
};

const readFileElsewhere = async (
  fileName: string
): Promise<IData | IConfigurationStore | undefined> => {
  try {
    const file = await readTextFile(`${fileName}`, { dir: dir });
    return JSON.parse(file);
  } catch (error) {
    console.error(`Could not read file ${fileName} because of ${error}`);
    return undefined;
  }
};

export { createDataFolder, createFile, readFile, readFileElsewhere };
