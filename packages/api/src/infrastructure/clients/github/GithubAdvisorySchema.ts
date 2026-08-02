import { z } from "zod";

// GitHub Advisory API（GET /advisories）の生レスポンス1件分を検証するスキーマ。
export const GithubAdvisoryResponseSchema = z.object({
	ghsa_id: z.string(),
	cve_id: z.string().nullable(),
	html_url: z.string(),
	summary: z.string(),
	severity: z.enum(["unknown", "low", "medium", "high", "critical"]),
	published_at: z.string(),
	updated_at: z.string(),
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
