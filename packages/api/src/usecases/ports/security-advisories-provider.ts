import type {
	ConvertedVulnerability,
	SecurityAdvisoriesSearchParams,
} from "@/usecases/ports/security-advisories-provider.types.js";

export interface SecurityAdvisoriesProvider {
	getConvertedVulnerabilities(
		params: SecurityAdvisoriesSearchParams,
	): Promise<ConvertedVulnerability[]>;
}
