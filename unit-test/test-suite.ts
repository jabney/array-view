import { AggregateResult } from './aggregate-result'
import { skipLogic } from './skip-logic'
import { IUnitTest, TestResult } from './types'

interface TestState {
    readonly only: boolean
    readonly skip: boolean
}

type Options = Partial<TestState>

export class TestSuite implements IUnitTest {
    static readonly test = (desc: string, items: readonly IUnitTest[]): TestSuite => {
        return new TestSuite(desc, items)
    }

    static readonly only = (desc: string, items: readonly IUnitTest[]): TestSuite => {
        return new TestSuite(desc, items, { only: true })
    }

    static readonly skip = (desc: string, items: readonly IUnitTest[]): TestSuite => {
        return new TestSuite(desc, items, { skip: true })
    }

    private readonly state: Readonly<TestState>

    constructor(
        readonly description: string,
        private readonly tests: readonly IUnitTest[],
        state: Options = {}
    ) {
        this.state = {
            only: Boolean(state.only ?? false),
            skip: Boolean(state.skip ?? false),
        }
    }

    get only(): boolean {
        return this.state.only || this.tests.some(x => x.only)
    }

    get skip(): boolean {
        return this.state.skip!
    }

    async run(skip = false): Promise<TestResult> {
        const skipTest = skipLogic(this.tests, skip || this.skip)
        const results = await Promise.all(this.tests.map(t => t.run(skipTest(t))))
        return new AggregateResult(this.description, results)
    }
}
