import { z } from "zod";

// GitHub Advisory API（GET /advisories）の生レスポンス1件分を検証するスキーマ。
// フィールド名はGitHubのJSONレスポンスのキー名（snake_case）と完全一致させる必要がある。
// キャメルケースにすると実際のキーと一致せず、値がundefinedになるため。
export const GithubAdvisoryResponseSchema = z.object({
	ghsa_id: z.string(),
	cve_id: z.string().nullable(),
	html_url: z.string(),
	summary: z.string(),
	severity: z.enum(["unknown", "low", "medium", "high", "critical"]),
	published_at: z.string().pipe(z.coerce.date()),
	updated_at: z.string().pipe(z.coerce.date()),
	vulnerabilities: z
		.array(
			z.object({
				package: z.object({
					ecosystem: z.string(),
					name: z.string().nullable(),
				}),
			}),
		)
		.nullable(),
	cvss_severities: z
		.object({
			cvss_v4: z.object({ score: z.number().nullable() }).nullable(),
		})
		.nullable(),
});
