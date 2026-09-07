export interface ReconstructedNotificationProps {
	readonly id: string;
	readonly notificationChannelId: string;
	readonly vulnerabilityId: string;
	notifiedAt: Date;
}

export interface NewNotificationProps {
	readonly notificationChannelId: string;
	readonly vulnerabilityId: string;
	notifiedAt: Date;
}
