import type {
	NewLineChannelProps,
	ReconstructedLineChannelProps,
} from "@/domain/line-channel/entity.type.js";

export class LineChannel {
	private readonly _id: string | undefined;
	private _notificationChannelId: string;
	private _lineUserId: string;

	private constructor(
		props: NewLineChannelProps | ReconstructedLineChannelProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._notificationChannelId = props.notificationChannelId;
		this._lineUserId = props.lineUserId;
	}

	get id(): string | undefined {
		return this._id;
	}

	get notificationChannelId(): string {
		return this._notificationChannelId;
	}

	get lineUserId(): string | undefined {
		return this._lineUserId;
	}

	static create(props: NewLineChannelProps) {
		return new LineChannel(props);
	}

	static reconstruct(props: ReconstructedLineChannelProps) {
		return new LineChannel(props);
	}
}
