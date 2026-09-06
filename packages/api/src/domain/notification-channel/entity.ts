import type {
	NewNotificationChannelProps,
	NotificationChannelType,
	ReconstructedNotificationChannelProps,
	SortOrder,
} from "@/domain/notification-channel/entity.type.js";
import type { Severity } from "@/domain/shared/severity.type.js";

export class NotificationChannel {
	private readonly _id: string | undefined;
	private _userId: string;
	private _type: NotificationChannelType;
	private _maxNotificationLimit: number;
	private _enabled: boolean;
	private _minSeverity: Severity;
	private _minCvssScore: number;
	private _cvssScoreOrderBy: SortOrder;
	private _notificationIntervalMinutes: number;
	private _lastProcessedAt: Date | null;

	private constructor(
		props: ReconstructedNotificationChannelProps | NewNotificationChannelProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._userId = props.userId;
		this._type = props.type;
		this._maxNotificationLimit = props.maxNotificationLimit;
		this._enabled = props.enabled;
		this._minSeverity = props.minSeverity;
		this._minCvssScore = props.minCvssScore;
		this._cvssScoreOrderBy = props.cvssScoreOrderBy;
		this._notificationIntervalMinutes = props.notificationIntervalMinutes;
		this._lastProcessedAt = props.lastProcessedAt;
	}

	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get type(): NotificationChannelType {
		return this._type;
	}

	get maxNotificationLimit(): number {
		return this._maxNotificationLimit;
	}

	get enabled(): boolean {
		return this._enabled;
	}

	get minSeverity(): Severity {
		return this._minSeverity;
	}

	get minCvssScore(): number {
		return this._minCvssScore;
	}

	get cvssScoreOrderBy(): SortOrder {
		return this._cvssScoreOrderBy;
	}

	get notificationIntervalMinutes(): number {
		return this._notificationIntervalMinutes;
	}

	get lastProcessedAt(): Date | null {
		return this._lastProcessedAt;
	}

	static create(props: NewNotificationChannelProps): NotificationChannel {
		return new NotificationChannel(props);
	}

	static reconstruct(
		props: ReconstructedNotificationChannelProps,
	): NotificationChannel {
		return new NotificationChannel(props);
	}

	// 通知間隔の経過を確認して、通知対象のチャネルかどうかを実行バッチが判定する
	isDueAt(now: Date): boolean {
		const nowTime = now.getTime(); // ミリ秒変換
		const intervalTimes = this._notificationIntervalMinutes * 60 * 1000; // ミリ秒変換
		if (this._lastProcessedAt) {
			const lastProcessedTime = this._lastProcessedAt.getTime();
			return nowTime - lastProcessedTime >= intervalTimes;
		}
		// 一度も処理していないチャネルは、間隔を待たずに即対象にする
		return true;
	}
}
