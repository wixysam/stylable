import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { process } from '../src/jest';
const evalNode = require('node-eval');

describe('jest process', () => {
    it('should process stylable sources', () => {
        const filename = path.join(__dirname, 'fixtures', 'test.st.css');
        const content = fs.readFileSync(filename, 'utf8');
        const module = evalNode(process(content, filename), filename);

        expect(module.classes.root).to.equal(`${module.namespace}__root`);
        expect(module.classes.test).to.equal(`${module.namespace}__test`);
    });
});
