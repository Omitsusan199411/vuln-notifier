export type BatchStatus = "pending" | "running" | "success" | "failed";
export type BatchTriggerType = "scheduled" | "manual";

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
