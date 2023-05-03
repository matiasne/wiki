import INodeResponseDTO from "./nodeFolderResponseDTO";

export enum EnumNodeType {
  FOLDER = "FOLDER",
  FILE = "FILE",
  RICH_TEXT = "RICH_TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  LINK = "LINK",
  DOCUMENT = "DOCUMENT",
  CHATTERBOX = "CHATTERBOX",
  URL = "URL",
}

export interface IContentNode {
  id?: string;
  name: string;
  emojiUnified: string;
  type: string;
  parentId: string;
  description: string;
}
