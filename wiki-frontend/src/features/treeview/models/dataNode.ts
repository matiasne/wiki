import { IContentNode } from "./contentNode";
import { EnumContentNodeType } from "./enum.nodeType";
import INodeResponseDTO from "./nodeFolderResponseDTO";

export default class DataNode implements IContentNode {
  id: string | undefined = undefined;
  name = "";
  emojiUnified = "";
  type = "";
  parentId = "";
  description = "";
  extension = "";
  data = "";

  constructor(parentId: string) {
    this.parentId = parentId;
  }

  static TransformFromDTO(data: INodeResponseDTO): DataNode {
    let contentNode = new DataNode(data.id);
    contentNode.id = data.id;
    contentNode.name = data.name;
    contentNode.data = data.data;
    contentNode.emojiUnified = data.emojiUnified;
    contentNode.type = EnumContentNodeType.FILE;
    contentNode.description = data.description;
    contentNode.extension = data.extension;
    return contentNode;
  }
}
