import type {
	NewBatchProps,
	ReconstructedBatchProps,
} from "@/domain/batch/entity.type.js";
import type {
	BatchStatus,
	BatchTriggerType,
} from "@/generated/prisma/enums.js";

export class Batch {
	private readonly _id: string | undefined;
	private _triggerType: BatchTriggerType;
	private _triggeredBy: string | null;
	private _executedAt: Date;
	private _status: BatchStatus;

	private constructor(props: ReconstructedBatchProps | NewBatchProps) {
		this._id = "id" in props ? props.id : undefined;
		this._triggerType = props.triggerType;
		this._triggeredBy = props.triggeredBy;
		this._executedAt = props.executedAt;
		this._status = props.status;
	}

	get id(): string | undefined {
		return this._id;
	}

	get triggerType(): BatchTriggerType {
		return this._triggerType;
	}

	get triggeredBy(): string | null {
		return this._triggeredBy;
	}

	get executedAt(): Date {
		return this._executedAt;
	}

	get status(): BatchStatus {
		return this._status;
	}

	static create(props: NewBatchProps): Batch {
		return new Batch(props);
	}

	static reconstruct(props: ReconstructedBatchProps): Batch {
		return new Batch(props);
	}

	updateStatus(newStatus: BatchStatus): void {
		this._status = newStatus;
	}
}
