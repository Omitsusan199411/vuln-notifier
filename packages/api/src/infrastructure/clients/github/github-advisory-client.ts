import { z } from "zod";
import type {
	GithubAdvisoryVulnerability,
	GithubAdvistoryResponse,
	ValidGithubAdvistoryResponse,
} from "@/infrastructure/clients/github/github-advisory-client.types.js";
import { GithubAdvisoryResponseSchema } from "@/infrastructure/clients/github/github-advisory-schema.js";
import type { SecurityAdvisoriesProvider } from "@/usecases/ports/security-advisories-provider.js";
import type {
	SecurityAdvisoriesSearchParams,
	VulnerabilityDto,
} from "@/usecases/ports/security-advisories-provider.types.js";

export class GithubAdvisoryClient implements SecurityAdvisoriesProvider {
	BASE_URL = "https://api.github.com/advisories";

	async getConvertedVulnerabilities(
		searchParams: SecurityAdvisoriesSearchParams,
	): Promise<VulnerabilityDto[]> {
		const githubSecurityAdvisories =
			await this.fetchSecurityAdvisories(searchParams);
		const convertedVulnerability = this.convertSecurityAdvisories(
			githubSecurityAdvisories,
		);

		return convertedVulnerability;
	}

	private async fetchSecurityAdvisories(
		searchParams: SecurityAdvisoriesSearchParams,
	): Promise<unknown[]> {
		const baseUrl = new URL(this.BASE_URL);
		const fecthUrl = this.buildFecthUrl(baseUrl, searchParams);
		const response = await fetch(fecthUrl, {
			headers: {
				Accept: "application/vnd.github+json",
			},
		});

		if (!response.ok) {
			throw new Error();
		}

		const responseBody: unknown[] = await response.json();

		return responseBody;
	}

	private buildFecthUrl(
		baseUrl: URL,
		searchParams: SecurityAdvisoriesSearchParams,
	): URL {
		baseUrl.searchParams.set("ecosystem", searchParams.ecosystem);

		return baseUrl;
	}

	private convertSecurityAdvisories(
		githubSecurityAdvisories: unknown[],
	): VulnerabilityDto[] {
		// スキーマに一致しない場合、ZodErrorを投げる
		const validGithubSecurityAdvisories = z
			.array(GithubAdvisoryResponseSchema)
			.parse(githubSecurityAdvisories);

		const filteredValidGithubSecurityAdvisories =
			validGithubSecurityAdvisories.filter((securiyAdvisory) =>
				this.isNotNullValid(securiyAdvisory),
			);

		const convertedVulnerabilities =
			filteredValidGithubSecurityAdvisories.flatMap(
				(validGithubSecurityAdvisory: ValidGithubAdvistoryResponse) => {
					const {
						ghsa_id,
						cve_id,
						html_url,
						summary,
						severity,
						published_at,
						updated_at,
						vulnerabilities,
						cvss_severities,
					} = validGithubSecurityAdvisory;

					return vulnerabilities.flatMap(
						(vulnerability: GithubAdvisoryVulnerability) => {
							if (vulnerability.package.name === null) return [];

							const convertedVulnerability: VulnerabilityDto = {
								sourceAdvisoryId: ghsa_id,
								advisorySource: "github",
								cveId: cve_id,
								advisoryUrl: html_url,
								ecosystem: vulnerability.package.ecosystem,
								summary: summary,
								severity: severity,
								packageName: vulnerability.package.name,
								cvssScore: cvss_severities?.cvss_v4?.score ?? null,
								publishedAt: published_at,
								sourceUpdatedAt: updated_at,
								sourceResponse: validGithubSecurityAdvisory,
							};

							return [convertedVulnerability];
						},
					);
				},
			);

		return convertedVulnerabilities;
	}

	private isNotNullValid(
		validGithubSecurityAdvisory: GithubAdvistoryResponse,
	): validGithubSecurityAdvisory is ValidGithubAdvistoryResponse {
		const { cve_id, vulnerabilities } = validGithubSecurityAdvisory;
		return cve_id !== null && vulnerabilities !== null;
	}
}
