import type {
	NewNotificationProps,
	ReconstructedNotificationProps,
} from "@/domain/notification/entity.type.js";

export class Notification {
	private readonly _id: string | undefined;
	private _notificationChannelId: string;
	private _vulnerabilityId: string;
	private _notifiedAt: Date;

	private constructor(
		props: ReconstructedNotificationProps | NewNotificationProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._notificationChannelId = props.notificationChannelId;
		this._vulnerabilityId = props.vulnerabilityId;
		this._notifiedAt = props.notifiedAt;
	}

	get id(): string | undefined {
		return this._id;
	}

	get notificationChannelId(): string {
		return this._notificationChannelId;
	}

	get vulnerabilityId(): string {
		return this._vulnerabilityId;
	}

	get notifiedAt(): Date {
		return this._notifiedAt;
	}

	static create(props: NewNotificationProps) {
		return new Notification(props);
	}

	static reconstruct(props: ReconstructedNotificationProps) {
		return new Notification(props);
	}
}
