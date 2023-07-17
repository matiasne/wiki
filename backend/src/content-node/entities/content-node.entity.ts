import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  ManyToOne,
  OneToMany,
  Entity,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { EnumContentNodeType } from '../dto/create-content-node.dto';
import { UserNodeRole } from 'src/user-node-rol/entities/user-node-rol.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Invitation } from 'src/invitations/entities/invitation.entity';
import { ConversationMessage } from 'src/chatterbox/entities/conversation-message.entity';

@Entity('content-node')
@Tree('closure-table')
export class ContentNode extends BaseEntity {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  emojiUnified: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  data: string;

  @Column({ default: '' })
  extension: string;

  @Column({ default: '' })
  order: string;

  @Column({ default: '' })
  @IsEnum(EnumContentNodeType)
  type: EnumContentNodeType;

  @TreeChildren()
  childrens: ContentNode[];

  @TreeParent()
  parent: ContentNode;

  @ManyToOne((type) => User, (user) => user.createdNodes, {
    onDelete: 'CASCADE',
  })
  userCreator: User;

  @OneToMany((type) => UserNodeRole, (userNodeRole) => userNodeRole.node)
  usersRoles: UserNodeRole[];

  @OneToMany(() => Comment, (comment) => comment.contentNode)
  comments: Comment[];

  @OneToMany((type) => Invitation, (Invitation) => Invitation.node)
  invitations: Invitation[];

  @OneToMany((type) => ConversationMessage, (conversation) => conversation.node)
  messages: ConversationMessage[];
}
