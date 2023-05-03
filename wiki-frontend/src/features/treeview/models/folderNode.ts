import { IContentNode } from "./contentNode";
import { EnumContentNodeType } from "./enum.nodeType";
import INodeResponseDTO from "./nodeFolderResponseDTO";

export default class FolderNode implements IContentNode {
  id?: string | undefined = undefined;
  name = "";
  emojiUnified = "";
  type = "";
  parentId = "";
  description = "";

  constructor(parentId: string) {
    this.parentId = parentId;
  }

  static TransformFromDTO(data: INodeResponseDTO): FolderNode {
    let contentNode = new FolderNode(data.id);
    contentNode.id = data.id;
    contentNode.name = data.name;
    contentNode.emojiUnified = data.emojiUnified;
    contentNode.type = EnumContentNodeType.FOLDER;
    contentNode.description = data.description;
    return contentNode;
  }
}
