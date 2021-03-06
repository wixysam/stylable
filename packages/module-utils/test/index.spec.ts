import { expect } from 'chai';
import path from 'path';
import { moduleFactoryTestKit } from './test-kit';

describe('Module Factory', () => {
    it('should create a module for a single (no import/resolution) stylable file', () => {
        const testFile = path.join(path.resolve('/'), '/entry.st.css');
        const { fs, factory, evalStylableModule } = moduleFactoryTestKit({
            [testFile]: '.root {}'
        });

        const moduleSource = factory(fs.readFileSync(testFile, 'utf8'), testFile);

        const exports = evalStylableModule(moduleSource, testFile);

        expect(exports).to.deep.include({
            classes: {
                root: 'entry__root'
            }
        });
    });

    it('should create a module with cross file use', () => {
        const rootPath = path.resolve('/');
        const testFile = path.join(rootPath, '/entry.st.css');
        const importedFile = path.join(rootPath, '/imported.st.css');

        const { fs, factory, evalStylableModule } = moduleFactoryTestKit({
            [testFile]: `
            :import {
                -st-from: "./imported.st.css";
                -st-named: part;
            }

            .part {
                color: green;
            }
            `,
            [importedFile]: '.part {}'
        });

        const moduleSource = factory(fs.readFileSync(testFile, 'utf8'), testFile);

        const exports = evalStylableModule(moduleSource, testFile);

        expect(exports).to.deep.include({
            classes: {
                root: 'entry__root',
                part: 'imported__part'
            }
        });
    });
});
