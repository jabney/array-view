export type ResultType = 'test-result' | 'aggregate-result' | 'skipped-result'

export interface IResultSummary {
    readonly type: ResultType
    readonly description: string
    readonly passed: number
    readonly failed: number
    readonly skipped: number
    readonly total: number
}

export interface IUnitResult extends IResultSummary {
    readonly type: 'test-result'
    readonly error: Error | null
}

export interface IAggregateResult extends IResultSummary {
    readonly type: 'aggregate-result'
    readonly results: TestResult[]
}

export interface ISkippedResult extends IResultSummary {
    readonly type: 'skipped-result'
}

export type TestResult = IUnitResult | IAggregateResult | ISkippedResult

export interface IUnitTest {
    readonly description: string
    readonly only: boolean
    readonly skip: boolean
    run(skip?: boolean): Promise<TestResult>
}

export type SummaryTotals = Pick<TestResult, 'passed' | 'failed' | 'skipped' | 'total'>

export interface ITestSummary {
    description: string
    results: TestResult[]
    totals: SummaryTotals
}
