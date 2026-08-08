import type z from "zod";
import type { GithubAdvisoryResponseSchema } from "@/infrastructure/clients/github/github-advisory-schema.js";

export type GithubAdvistoryResponse = z.infer<
	typeof GithubAdvisoryResponseSchema
>;

export type ValidGithubAdvistoryResponse = GithubAdvistoryResponse & {
	cve_id: NonNullable<GithubAdvistoryResponse["cve_id"]>;
	vulnerabilities: NonNullable<GithubAdvistoryResponse["vulnerabilities"]>;
};

export type GithubAdvisoryVulnerability = NonNullable<
	GithubAdvistoryResponse["vulnerabilities"]
>[number];
