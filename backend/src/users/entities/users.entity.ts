import { Comment } from 'src/comments/entities/comment.entity';
import { ContentNode } from 'src/content-node/entities/content-node.entity';
import { Invitation } from 'src/invitations/entities/invitation.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { UserNodeRole } from 'src/user-node-rol/entities/user-node-rol.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConversationMessage } from 'src/chatterbox/entities/conversation-message.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  name!: string;

  @Column({ default: '' })
  email!: string;

  @OneToMany((type) => UserNodeRole, (userNodeRole) => userNodeRole.user)
  nodesRoles: UserNodeRole[];

  @OneToMany((type) => ContentNode, (node) => node.userCreator)
  createdNodes: ContentNode[];

  @OneToMany((type) => Invitation, (Invitation) => Invitation.userSender)
  invitationsSent: Invitation[];

  @OneToMany((type) => Invitation, (Invitation) => Invitation.userReceiving)
  invitationsReceived: Invitation[];

  @OneToMany((type) => Notification, (Notification) => Notification.user)
  notifications: Notification[];

  @OneToMany((type) => Comment, (comment) => comment.userCreator)
  comments: Comment[];

  @OneToMany((type) => ConversationMessage, (message) => message.user)
  messages: ConversationMessage[];
}
