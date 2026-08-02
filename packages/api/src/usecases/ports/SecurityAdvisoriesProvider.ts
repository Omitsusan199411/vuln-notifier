import type {
	ConvertedVulnerability,
	SecurityAdvisoriesSearchParams,
} from "@/usecases/ports/SecurityAdvisoriesProvider.types.js";

export interface SecurityAdvisoriesProvider {
	getConvertedVulnerabilities(
		params: SecurityAdvisoriesSearchParams,
	): Promise<ConvertedVulnerability[]>;
}
