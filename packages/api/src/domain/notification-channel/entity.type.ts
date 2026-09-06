import type { Severity } from "@/domain/shared/severity.type.js";

export type NotificationChannelType = "line";

export type SortOrder = "desc" | "asc";

export interface ReconstructedNotificationChannelProps {
	readonly id: string;
	readonly userId: string;
	type: NotificationChannelType;
	maxNotificationLimit: number;
	enabled: boolean;
	minSeverity: Severity;
	minCvssScore: number;
	cvssScoreOrderBy: SortOrder;
	notificationIntervalMinutes: number;
	lastProcessedAt: Date | null;
}

export interface NewNotificationChannelProps {
	userId: string;
	type: NotificationChannelType;
	maxNotificationLimit: number;
	enabled: boolean;
	minSeverity: Severity;
	minCvssScore: number;
	cvssScoreOrderBy: SortOrder;
	notificationIntervalMinutes: number;
	lastProcessedAt: Date | null;
}
