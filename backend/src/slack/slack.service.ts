import { Injectable } from '@nestjs/common';
import { App, LogLevel } from '@slack/bolt';

@Injectable()
export class SlackBoltService {
  private app = undefined;

  constructor() {}
}
