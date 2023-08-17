import { IContentNode } from "./contentNode";
import { EnumContentNodeType } from "./enum.nodeType";
import INodeResponseDTO from "./nodeFolderResponseDTO";

export default class ChatterboxNode implements IContentNode {
  id?: string | undefined = undefined;
  name = "";
  emojiUnified = "";
  type = "";
  parentId = "0";
  description = "";
  temperature = "0.9";
  textChunkSize = "1000";
  textOverlapSize = "200";

  constructor() {}

  static TransformFromDTO(data: INodeResponseDTO): ChatterboxNode {
    let contentNode = new ChatterboxNode();
    contentNode.id = data.id;
    contentNode.name = data.name;
    contentNode.emojiUnified = data.emojiUnified;
    contentNode.type = EnumContentNodeType.FOLDER;
    contentNode.description = data.description;
    return contentNode;
  }
}
