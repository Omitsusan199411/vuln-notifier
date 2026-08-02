import type { AdvisorySource, Severity } from "@repo/shared";

// ベンダー非依存（GitHub/OSV等の実際のクエリ形式への変換は各Client実装の内部で行う）。
export interface SecurityAdvisoriesSearchParams {
	ecosystem: string;
	minSeverity: Severity;
	minCvsScore: number;
	publishedLookbackDays: number;
	maxFetchCount: number;
	publishedOrderBy: "desc" | "asc";
}

// ベンダー非依存（各Client実装が自身のレスポンス形式からこの形に変換する）。
export interface ConvertedVulnerability {
	sourceAdvisoryId: string;
	advisorySource: AdvisorySource;
	cveId: string;
	ecosystem: string;
	packageName: string;
	severity: Severity;
	cvssScore: number | null;
	summary: string;
	advisoryUrl: string;
	publishedAt: Date;
	sourceUpdatedAt: Date;
	sourceResponse: unknown;
}
