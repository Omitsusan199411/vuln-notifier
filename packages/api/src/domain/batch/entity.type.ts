import type {
	BatchStatus,
	BatchTriggerType,
} from "@/generated/prisma/enums.js";

export interface ReconstructedBatchProps {
	readonly id: string;
	readonly triggerType: BatchTriggerType;
	readonly triggeredBy: string | null;
	readonly executedAt: Date;
	status: BatchStatus;
}

export interface NewBatchProps {
	triggerType: BatchTriggerType;
	triggeredBy: string | null;
	executedAt: Date;
	status: BatchStatus;
}
