import { activateExtension, assertNotContains, assertSize, assertStringContains, assertContains} from './testUtil';
import { complete, completeWithData, removeCheat } from './TestCompletionUtil';
import { test, suite, suiteSetup } from 'mocha';

suite(`CompletionProvider References Tests`, () => {

    suiteSetup(async () => {
        await activateExtension();
    });

    test("Should show completions", async () => {
        let completionList = await complete("ShouldShow.cs", 1, 5);
        assertContains(completionList, "File");
    });

    test("Should not show completions when not needed", async () => {
        let completionList = await complete("ShouldNotShow.cs", 1, 4);
        assertNotContains(completionList, "File");
    });

    test("Should filter out already used namespaces", async () => {
        let completionList = await complete("ShouldFilterOut.cs", 4, 4);
        assertNotContains(completionList, "File");
    });

    test("Should combine references of the same name", async () => {
        let [completionList] = await completeWithData("ShouldCombine.cs", 1, 6);
        completionList.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
        let enumerables = completionList.items.filter(c => removeCheat(c.label) === "IEnumerable");
        assertSize(enumerables, 1);

        let enumerable = enumerables[0];

        assertStringContains(enumerable.detail!, "System.Collections");
        assertStringContains(enumerable.detail!, "System.Collections.Generic");
    });


    

});

