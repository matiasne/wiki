export enum EnumContentNodeType {
  FOLDER = "FOLDER",
  FILE = "FILE",
  RICH_TEXT = "RICH_TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  LINK = "LINK",
  DOCUMENT = "DOCUMENT",
}

export default interface INewNodeDTO {
  name: string;
  type: EnumContentNodeType;
  parentId: string;
}
