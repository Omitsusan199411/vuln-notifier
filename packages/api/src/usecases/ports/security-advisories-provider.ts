import type {
	SecurityAdvisoriesSearchParams,
	VulnerabilityDto,
} from "@/usecases/ports/security-advisories-provider.types.js";

export interface SecurityAdvisoriesProvider {
	getConvertedVulnerabilities(
		params: SecurityAdvisoriesSearchParams,
	): Promise<VulnerabilityDto[]>;
}
