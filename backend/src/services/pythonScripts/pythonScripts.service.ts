import { PythonShell } from 'python-shell';
import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class PythonScriptService {
  constructor() {}

  async runTest() {
    try {
      await PythonShell.run('./src/services/python/hello.py', {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [],
      });

      console.log('python call ends');
    } catch (e) {
      console.log(e);
    }
  }
}
