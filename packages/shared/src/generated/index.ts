import {
	DecimalJsLike,
	InputJsonValue,
	type JsonValue,
	objectEnumValues,
	Decimal as PrismaDecimal,
} from "@prisma/client/runtime/library";
import Decimal from "decimal.js";
import { z } from "zod";
import type { Prisma } from "../../../api/src/generated/prisma/client";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput =
	| JsonValue
	| null
	| "JsonNull"
	| "DbNull"
	| typeof objectEnumValues.instances.DbNull
	| typeof objectEnumValues.instances.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
	if (!v || v === "DbNull") return typeof objectEnumValues.instances.DbNull;
	if (v === "JsonNull") return typeof objectEnumValues.instances.JsonNull;
	return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.literal(null),
		z.record(
			z.string(),
			z.lazy(() => JsonValueSchema.optional()),
		),
		z.array(z.lazy(() => JsonValueSchema)),
	]),
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
	.union([JsonValueSchema, z.literal("DbNull"), z.literal("JsonNull")])
	.nullable()
	.transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.object({ toJSON: z.any() }),
			z.record(
				z.string(),
				z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)])),
			),
			z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
		]),
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
	d: z.array(z.number()),
	e: z.number(),
	s: z.number(),
	toFixed: z.any(),
});

export const DECIMAL_STRING_REGEX =
	/^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput = (
	v?: null | string | number | Prisma.DecimalJsLike,
): v is string | number | Prisma.DecimalJsLike => {
	if (v === undefined || v === null) return false;
	return (
		(typeof v === "object" &&
			"d" in v &&
			"e" in v &&
			"s" in v &&
			"toFixed" in v) ||
		(typeof v === "string" && DECIMAL_STRING_REGEX.test(v)) ||
		typeof v === "number"
	);
};

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
	"ReadUncommitted",
	"ReadCommitted",
	"RepeatableRead",
	"Serializable",
]);

export const UserScalarFieldEnumSchema = z.enum([
	"id",
	"cognitoSub",
	"createdAt",
	"updatedAt",
]);

export const EcosystemScalarFieldEnumSchema = z.enum([
	"id",
	"name",
	"createdAt",
	"updatedAt",
]);

export const VulnerabilityConfigScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"ecosystemId",
	"minSeverity",
	"minCvssScore",
	"publishedLookbackDays",
	"maxFetchCount",
	"publishedOrderBy",
	"createdAt",
	"updatedAt",
]);

export const VulnerabilityScalarFieldEnumSchema = z.enum([
	"id",
	"ghsaId",
	"cveId",
	"ecosystemId",
	"batchId",
	"packageName",
	"severity",
	"cvssScore",
	"summary",
	"llmSummary",
	"advisoryUrl",
	"publishedAt",
	"githubAdvisoryResponse",
	"createdAt",
	"updatedAt",
]);

export const BatchScalarFieldEnumSchema = z.enum([
	"id",
	"triggerType",
	"triggeredBy",
	"executedAt",
	"status",
	"createdAt",
	"updatedAt",
]);

export const NotificationChannelScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"type",
	"maxNotificationLimit",
	"enabled",
	"createdAt",
	"updatedAt",
]);

export const LineChannelScalarFieldEnumSchema = z.enum([
	"id",
	"notificationChannelId",
	"lineUserId",
	"createdAt",
	"updatedAt",
]);

export const NotificationScalarFieldEnumSchema = z.enum([
	"id",
	"notificationChannelId",
	"vulnerabilityId",
	"notifiedAt",
	"createdAt",
	"updatedAt",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const JsonNullValueInputSchema: z.ZodType<Prisma.JsonNullValueInput> = z
	.enum(["JsonNull"])
	.transform((value) => (value === "JsonNull" ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const JsonNullValueFilterSchema: z.ZodType<Prisma.JsonNullValueFilter> =
	z
		.enum(["DbNull", "JsonNull", "AnyNull"])
		.transform((value) =>
			value === "JsonNull"
				? Prisma.JsonNull
				: value === "DbNull"
					? Prisma.DbNull
					: value === "AnyNull"
						? Prisma.AnyNull
						: value,
		);

export const NullsOrderSchema = z.enum(["first", "last"]);

export const SeveritySchema = z.enum([
	"unknown",
	"low",
	"medium",
	"high",
	"critical",
]);

export type SeverityType = `${z.infer<typeof SeveritySchema>}`;

export const BatchTriggerTypeSchema = z.enum(["scheduled", "manual"]);

export type BatchTriggerTypeType = `${z.infer<typeof BatchTriggerTypeSchema>}`;

export const BatchStatusSchema = z.enum([
	"pending",
	"running",
	"success",
	"failed",
]);

export type BatchStatusType = `${z.infer<typeof BatchStatusSchema>}`;

export const NotificationChannelTypeSchema = z.enum(["line"]);

export type NotificationChannelTypeType =
	`${z.infer<typeof NotificationChannelTypeSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	id: z.string(),
	cognitoSub: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// ECOSYSTEM SCHEMA
/////////////////////////////////////////

export const EcosystemSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Ecosystem = z.infer<typeof EcosystemSchema>;

/////////////////////////////////////////
// VULNERABILITY CONFIG SCHEMA
/////////////////////////////////////////

export const VulnerabilityConfigSchema = z.object({
	minSeverity: SeveritySchema,
	id: z.string(),
	userId: z.string(),
	ecosystemId: z.string(),
	minCvssScore: z.instanceof(PrismaDecimal, {
		message:
			"Field 'minCvssScore' must be a Decimal. Location: ['Models', 'VulnerabilityConfig']",
	}),
	publishedLookbackDays: z.number().int(),
	maxFetchCount: z.number().int(),
	publishedOrderBy: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type VulnerabilityConfig = z.infer<typeof VulnerabilityConfigSchema>;

/////////////////////////////////////////
// VULNERABILITY SCHEMA
/////////////////////////////////////////

export const VulnerabilitySchema = z.object({
	severity: SeveritySchema.nullable(),
	id: z.uuid(),
	ghsaId: z.string(),
	cveId: z.string(),
	ecosystemId: z.string(),
	batchId: z.string(),
	packageName: z.string(),
	cvssScore: z.instanceof(PrismaDecimal, {
		message:
			"Field 'cvssScore' must be a Decimal. Location: ['Models', 'Vulnerability']",
	}),
	summary: z.string().nullable(),
	llmSummary: z.string().nullable(),
	advisoryUrl: z.string().nullable(),
	publishedAt: z.coerce.date().nullable(),
	githubAdvisoryResponse: JsonValueSchema,
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Vulnerability = z.infer<typeof VulnerabilitySchema>;

/////////////////////////////////////////
// BATCH SCHEMA
/////////////////////////////////////////

export const BatchSchema = z.object({
	triggerType: BatchTriggerTypeSchema,
	status: BatchStatusSchema,
	id: z.uuid(),
	triggeredBy: z.string().nullable(),
	executedAt: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Batch = z.infer<typeof BatchSchema>;

/////////////////////////////////////////
// NOTIFICATION CHANNEL SCHEMA
/////////////////////////////////////////

export const NotificationChannelSchema = z.object({
	type: NotificationChannelTypeSchema,
	id: z.string(),
	userId: z.string(),
	maxNotificationLimit: z.number().int(),
	enabled: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

/////////////////////////////////////////
// LINE CHANNEL SCHEMA
/////////////////////////////////////////

export const LineChannelSchema = z.object({
	id: z.string(),
	notificationChannelId: z.string(),
	lineUserId: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type LineChannel = z.infer<typeof LineChannelSchema>;

/////////////////////////////////////////
// NOTIFICATION SCHEMA
/////////////////////////////////////////

export const NotificationSchema = z.object({
	id: z.uuid(),
	notificationChannelId: z.string(),
	vulnerabilityId: z.string(),
	notifiedAt: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Notification = z.infer<typeof NotificationSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z
	.object({
		vulnerabilityConfigs: z
			.union([z.boolean(), z.lazy(() => VulnerabilityConfigFindManyArgsSchema)])
			.optional(),
		batches: z
			.union([z.boolean(), z.lazy(() => BatchFindManyArgsSchema)])
			.optional(),
		notificationChannels: z
			.union([z.boolean(), z.lazy(() => NotificationChannelFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z
	.object({
		select: z.lazy(() => UserSelectSchema).optional(),
		include: z.lazy(() => UserIncludeSchema).optional(),
	})
	.strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
		})
		.strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> =
	z
		.object({
			vulnerabilityConfigs: z.boolean().optional(),
			batches: z.boolean().optional(),
			notificationChannels: z.boolean().optional(),
		})
		.strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
	.object({
		id: z.boolean().optional(),
		cognitoSub: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		vulnerabilityConfigs: z
			.union([z.boolean(), z.lazy(() => VulnerabilityConfigFindManyArgsSchema)])
			.optional(),
		batches: z
			.union([z.boolean(), z.lazy(() => BatchFindManyArgsSchema)])
			.optional(),
		notificationChannels: z
			.union([z.boolean(), z.lazy(() => NotificationChannelFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

// ECOSYSTEM
//------------------------------------------------------

export const EcosystemIncludeSchema: z.ZodType<Prisma.EcosystemInclude> = z
	.object({
		vulnerabilityConfigs: z
			.union([z.boolean(), z.lazy(() => VulnerabilityConfigFindManyArgsSchema)])
			.optional(),
		vulnerabilities: z
			.union([z.boolean(), z.lazy(() => VulnerabilityFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => EcosystemCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

export const EcosystemArgsSchema: z.ZodType<Prisma.EcosystemDefaultArgs> = z
	.object({
		select: z.lazy(() => EcosystemSelectSchema).optional(),
		include: z.lazy(() => EcosystemIncludeSchema).optional(),
	})
	.strict();

export const EcosystemCountOutputTypeArgsSchema: z.ZodType<Prisma.EcosystemCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z.lazy(() => EcosystemCountOutputTypeSelectSchema).nullish(),
		})
		.strict();

export const EcosystemCountOutputTypeSelectSchema: z.ZodType<Prisma.EcosystemCountOutputTypeSelect> =
	z
		.object({
			vulnerabilityConfigs: z.boolean().optional(),
			vulnerabilities: z.boolean().optional(),
		})
		.strict();

export const EcosystemSelectSchema: z.ZodType<Prisma.EcosystemSelect> = z
	.object({
		id: z.boolean().optional(),
		name: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		vulnerabilityConfigs: z
			.union([z.boolean(), z.lazy(() => VulnerabilityConfigFindManyArgsSchema)])
			.optional(),
		vulnerabilities: z
			.union([z.boolean(), z.lazy(() => VulnerabilityFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => EcosystemCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

// VULNERABILITY CONFIG
//------------------------------------------------------

export const VulnerabilityConfigIncludeSchema: z.ZodType<Prisma.VulnerabilityConfigInclude> =
	z
		.object({
			user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
			ecosystem: z
				.union([z.boolean(), z.lazy(() => EcosystemArgsSchema)])
				.optional(),
		})
		.strict();

export const VulnerabilityConfigArgsSchema: z.ZodType<Prisma.VulnerabilityConfigDefaultArgs> =
	z
		.object({
			select: z.lazy(() => VulnerabilityConfigSelectSchema).optional(),
			include: z.lazy(() => VulnerabilityConfigIncludeSchema).optional(),
		})
		.strict();

export const VulnerabilityConfigSelectSchema: z.ZodType<Prisma.VulnerabilityConfigSelect> =
	z
		.object({
			id: z.boolean().optional(),
			userId: z.boolean().optional(),
			ecosystemId: z.boolean().optional(),
			minSeverity: z.boolean().optional(),
			minCvssScore: z.boolean().optional(),
			publishedLookbackDays: z.boolean().optional(),
			maxFetchCount: z.boolean().optional(),
			publishedOrderBy: z.boolean().optional(),
			createdAt: z.boolean().optional(),
			updatedAt: z.boolean().optional(),
			user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
			ecosystem: z
				.union([z.boolean(), z.lazy(() => EcosystemArgsSchema)])
				.optional(),
		})
		.strict();

// VULNERABILITY
//------------------------------------------------------

export const VulnerabilityIncludeSchema: z.ZodType<Prisma.VulnerabilityInclude> =
	z
		.object({
			ecosystem: z
				.union([z.boolean(), z.lazy(() => EcosystemArgsSchema)])
				.optional(),
			batch: z.union([z.boolean(), z.lazy(() => BatchArgsSchema)]).optional(),
			notifications: z
				.union([z.boolean(), z.lazy(() => NotificationFindManyArgsSchema)])
				.optional(),
			_count: z
				.union([
					z.boolean(),
					z.lazy(() => VulnerabilityCountOutputTypeArgsSchema),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityArgsSchema: z.ZodType<Prisma.VulnerabilityDefaultArgs> =
	z
		.object({
			select: z.lazy(() => VulnerabilitySelectSchema).optional(),
			include: z.lazy(() => VulnerabilityIncludeSchema).optional(),
		})
		.strict();

export const VulnerabilityCountOutputTypeArgsSchema: z.ZodType<Prisma.VulnerabilityCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z.lazy(() => VulnerabilityCountOutputTypeSelectSchema).nullish(),
		})
		.strict();

export const VulnerabilityCountOutputTypeSelectSchema: z.ZodType<Prisma.VulnerabilityCountOutputTypeSelect> =
	z
		.object({
			notifications: z.boolean().optional(),
		})
		.strict();

export const VulnerabilitySelectSchema: z.ZodType<Prisma.VulnerabilitySelect> =
	z
		.object({
			id: z.boolean().optional(),
			ghsaId: z.boolean().optional(),
			cveId: z.boolean().optional(),
			ecosystemId: z.boolean().optional(),
			batchId: z.boolean().optional(),
			packageName: z.boolean().optional(),
			severity: z.boolean().optional(),
			cvssScore: z.boolean().optional(),
			summary: z.boolean().optional(),
			llmSummary: z.boolean().optional(),
			advisoryUrl: z.boolean().optional(),
			publishedAt: z.boolean().optional(),
			githubAdvisoryResponse: z.boolean().optional(),
			createdAt: z.boolean().optional(),
			updatedAt: z.boolean().optional(),
			ecosystem: z
				.union([z.boolean(), z.lazy(() => EcosystemArgsSchema)])
				.optional(),
			batch: z.union([z.boolean(), z.lazy(() => BatchArgsSchema)]).optional(),
			notifications: z
				.union([z.boolean(), z.lazy(() => NotificationFindManyArgsSchema)])
				.optional(),
			_count: z
				.union([
					z.boolean(),
					z.lazy(() => VulnerabilityCountOutputTypeArgsSchema),
				])
				.optional(),
		})
		.strict();

// BATCH
//------------------------------------------------------

export const BatchIncludeSchema: z.ZodType<Prisma.BatchInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
		vulnerabilities: z
			.union([z.boolean(), z.lazy(() => VulnerabilityFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => BatchCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

export const BatchArgsSchema: z.ZodType<Prisma.BatchDefaultArgs> = z
	.object({
		select: z.lazy(() => BatchSelectSchema).optional(),
		include: z.lazy(() => BatchIncludeSchema).optional(),
	})
	.strict();

export const BatchCountOutputTypeArgsSchema: z.ZodType<Prisma.BatchCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z.lazy(() => BatchCountOutputTypeSelectSchema).nullish(),
		})
		.strict();

export const BatchCountOutputTypeSelectSchema: z.ZodType<Prisma.BatchCountOutputTypeSelect> =
	z
		.object({
			vulnerabilities: z.boolean().optional(),
		})
		.strict();

export const BatchSelectSchema: z.ZodType<Prisma.BatchSelect> = z
	.object({
		id: z.boolean().optional(),
		triggerType: z.boolean().optional(),
		triggeredBy: z.boolean().optional(),
		executedAt: z.boolean().optional(),
		status: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
		vulnerabilities: z
			.union([z.boolean(), z.lazy(() => VulnerabilityFindManyArgsSchema)])
			.optional(),
		_count: z
			.union([z.boolean(), z.lazy(() => BatchCountOutputTypeArgsSchema)])
			.optional(),
	})
	.strict();

// NOTIFICATION CHANNEL
//------------------------------------------------------

export const NotificationChannelIncludeSchema: z.ZodType<Prisma.NotificationChannelInclude> =
	z
		.object({
			user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
			lineChannel: z
				.union([z.boolean(), z.lazy(() => LineChannelArgsSchema)])
				.optional(),
			notifications: z
				.union([z.boolean(), z.lazy(() => NotificationFindManyArgsSchema)])
				.optional(),
			_count: z
				.union([
					z.boolean(),
					z.lazy(() => NotificationChannelCountOutputTypeArgsSchema),
				])
				.optional(),
		})
		.strict();

export const NotificationChannelArgsSchema: z.ZodType<Prisma.NotificationChannelDefaultArgs> =
	z
		.object({
			select: z.lazy(() => NotificationChannelSelectSchema).optional(),
			include: z.lazy(() => NotificationChannelIncludeSchema).optional(),
		})
		.strict();

export const NotificationChannelCountOutputTypeArgsSchema: z.ZodType<Prisma.NotificationChannelCountOutputTypeDefaultArgs> =
	z
		.object({
			select: z
				.lazy(() => NotificationChannelCountOutputTypeSelectSchema)
				.nullish(),
		})
		.strict();

export const NotificationChannelCountOutputTypeSelectSchema: z.ZodType<Prisma.NotificationChannelCountOutputTypeSelect> =
	z
		.object({
			notifications: z.boolean().optional(),
		})
		.strict();

export const NotificationChannelSelectSchema: z.ZodType<Prisma.NotificationChannelSelect> =
	z
		.object({
			id: z.boolean().optional(),
			userId: z.boolean().optional(),
			type: z.boolean().optional(),
			maxNotificationLimit: z.boolean().optional(),
			enabled: z.boolean().optional(),
			createdAt: z.boolean().optional(),
			updatedAt: z.boolean().optional(),
			user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
			lineChannel: z
				.union([z.boolean(), z.lazy(() => LineChannelArgsSchema)])
				.optional(),
			notifications: z
				.union([z.boolean(), z.lazy(() => NotificationFindManyArgsSchema)])
				.optional(),
			_count: z
				.union([
					z.boolean(),
					z.lazy(() => NotificationChannelCountOutputTypeArgsSchema),
				])
				.optional(),
		})
		.strict();

// LINE CHANNEL
//------------------------------------------------------

export const LineChannelIncludeSchema: z.ZodType<Prisma.LineChannelInclude> = z
	.object({
		notificationChannel: z
			.union([z.boolean(), z.lazy(() => NotificationChannelArgsSchema)])
			.optional(),
	})
	.strict();

export const LineChannelArgsSchema: z.ZodType<Prisma.LineChannelDefaultArgs> = z
	.object({
		select: z.lazy(() => LineChannelSelectSchema).optional(),
		include: z.lazy(() => LineChannelIncludeSchema).optional(),
	})
	.strict();

export const LineChannelSelectSchema: z.ZodType<Prisma.LineChannelSelect> = z
	.object({
		id: z.boolean().optional(),
		notificationChannelId: z.boolean().optional(),
		lineUserId: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		notificationChannel: z
			.union([z.boolean(), z.lazy(() => NotificationChannelArgsSchema)])
			.optional(),
	})
	.strict();

// NOTIFICATION
//------------------------------------------------------

export const NotificationIncludeSchema: z.ZodType<Prisma.NotificationInclude> =
	z
		.object({
			notificationChannel: z
				.union([z.boolean(), z.lazy(() => NotificationChannelArgsSchema)])
				.optional(),
			vulnerability: z
				.union([z.boolean(), z.lazy(() => VulnerabilityArgsSchema)])
				.optional(),
		})
		.strict();

export const NotificationArgsSchema: z.ZodType<Prisma.NotificationDefaultArgs> =
	z
		.object({
			select: z.lazy(() => NotificationSelectSchema).optional(),
			include: z.lazy(() => NotificationIncludeSchema).optional(),
		})
		.strict();

export const NotificationSelectSchema: z.ZodType<Prisma.NotificationSelect> = z
	.object({
		id: z.boolean().optional(),
		notificationChannelId: z.boolean().optional(),
		vulnerabilityId: z.boolean().optional(),
		notifiedAt: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		notificationChannel: z
			.union([z.boolean(), z.lazy(() => NotificationChannelArgsSchema)])
			.optional(),
		vulnerability: z
			.union([z.boolean(), z.lazy(() => VulnerabilityArgsSchema)])
			.optional(),
	})
	.strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => UserWhereInputSchema),
				z.lazy(() => UserWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserWhereInputSchema),
				z.lazy(() => UserWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		cognitoSub: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigListRelationFilterSchema)
			.optional(),
		batches: z.lazy(() => BatchListRelationFilterSchema).optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelListRelationFilterSchema)
			.optional(),
	});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		cognitoSub: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigOrderByRelationAggregateInputSchema)
			.optional(),
		batches: z.lazy(() => BatchOrderByRelationAggregateInputSchema).optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelOrderByRelationAggregateInputSchema)
			.optional(),
	});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> =
	z
		.union([
			z.object({
				id: z.string(),
				cognitoSub: z.string(),
			}),
			z.object({
				id: z.string(),
			}),
			z.object({
				cognitoSub: z.string(),
			}),
		])
		.and(
			z.strictObject({
				id: z.string().optional(),
				cognitoSub: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => UserWhereInputSchema),
						z.lazy(() => UserWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => UserWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => UserWhereInputSchema),
						z.lazy(() => UserWhereInputSchema).array(),
					])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				vulnerabilityConfigs: z
					.lazy(() => VulnerabilityConfigListRelationFilterSchema)
					.optional(),
				batches: z.lazy(() => BatchListRelationFilterSchema).optional(),
				notificationChannels: z
					.lazy(() => NotificationChannelListRelationFilterSchema)
					.optional(),
			}),
		);

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		cognitoSub: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
	});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => UserScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
				z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		cognitoSub: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const EcosystemWhereInputSchema: z.ZodType<Prisma.EcosystemWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => EcosystemWhereInputSchema),
				z.lazy(() => EcosystemWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EcosystemWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EcosystemWhereInputSchema),
				z.lazy(() => EcosystemWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigListRelationFilterSchema)
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityListRelationFilterSchema)
			.optional(),
	});

export const EcosystemOrderByWithRelationInputSchema: z.ZodType<Prisma.EcosystemOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigOrderByRelationAggregateInputSchema)
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityOrderByRelationAggregateInputSchema)
			.optional(),
	});

export const EcosystemWhereUniqueInputSchema: z.ZodType<Prisma.EcosystemWhereUniqueInput> =
	z
		.union([
			z.object({
				id: z.string(),
				name: z.string(),
			}),
			z.object({
				id: z.string(),
			}),
			z.object({
				name: z.string(),
			}),
		])
		.and(
			z.strictObject({
				id: z.string().optional(),
				name: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => EcosystemWhereInputSchema),
						z.lazy(() => EcosystemWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => EcosystemWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => EcosystemWhereInputSchema),
						z.lazy(() => EcosystemWhereInputSchema).array(),
					])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				vulnerabilityConfigs: z
					.lazy(() => VulnerabilityConfigListRelationFilterSchema)
					.optional(),
				vulnerabilities: z
					.lazy(() => VulnerabilityListRelationFilterSchema)
					.optional(),
			}),
		);

export const EcosystemOrderByWithAggregationInputSchema: z.ZodType<Prisma.EcosystemOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => EcosystemCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => EcosystemMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => EcosystemMinOrderByAggregateInputSchema).optional(),
	});

export const EcosystemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EcosystemScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => EcosystemScalarWhereWithAggregatesInputSchema),
				z.lazy(() => EcosystemScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EcosystemScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EcosystemScalarWhereWithAggregatesInputSchema),
				z.lazy(() => EcosystemScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		name: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const VulnerabilityConfigWhereInputSchema: z.ZodType<Prisma.VulnerabilityConfigWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereInputSchema),
				z.lazy(() => VulnerabilityConfigWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityConfigWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereInputSchema),
				z.lazy(() => VulnerabilityConfigWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ecosystemId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => EnumSeverityFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z.lazy(() => DecimalFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		publishedLookbackDays: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		maxFetchCount: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		publishedOrderBy: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		user: z
			.union([
				z.lazy(() => UserScalarRelationFilterSchema),
				z.lazy(() => UserWhereInputSchema),
			])
			.optional(),
		ecosystem: z
			.union([
				z.lazy(() => EcosystemScalarRelationFilterSchema),
				z.lazy(() => EcosystemWhereInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigOrderByWithRelationInputSchema: z.ZodType<Prisma.VulnerabilityConfigOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		minSeverity: z.lazy(() => SortOrderSchema).optional(),
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
		publishedOrderBy: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		ecosystem: z.lazy(() => EcosystemOrderByWithRelationInputSchema).optional(),
	});

export const VulnerabilityConfigWhereUniqueInputSchema: z.ZodType<Prisma.VulnerabilityConfigWhereUniqueInput> =
	z
		.union([
			z.object({
				id: z.string(),
				userId_ecosystemId: z.lazy(
					() => VulnerabilityConfigUserIdEcosystemIdCompoundUniqueInputSchema,
				),
			}),
			z.object({
				id: z.string(),
			}),
			z.object({
				userId_ecosystemId: z.lazy(
					() => VulnerabilityConfigUserIdEcosystemIdCompoundUniqueInputSchema,
				),
			}),
		])
		.and(
			z.strictObject({
				id: z.string().optional(),
				userId_ecosystemId: z
					.lazy(
						() => VulnerabilityConfigUserIdEcosystemIdCompoundUniqueInputSchema,
					)
					.optional(),
				AND: z
					.union([
						z.lazy(() => VulnerabilityConfigWhereInputSchema),
						z.lazy(() => VulnerabilityConfigWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => VulnerabilityConfigWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => VulnerabilityConfigWhereInputSchema),
						z.lazy(() => VulnerabilityConfigWhereInputSchema).array(),
					])
					.optional(),
				userId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				ecosystemId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				minSeverity: z
					.union([
						z.lazy(() => EnumSeverityFilterSchema),
						z.lazy(() => SeveritySchema),
					])
					.optional(),
				minCvssScore: z
					.union([
						z.lazy(() => DecimalFilterSchema),
						z
							.union([
								z.number(),
								z.string(),
								z.instanceof(Decimal),
								z.instanceof(Prisma.Decimal),
								DecimalJsLikeSchema,
							])
							.refine((v) => isValidDecimalInput(v), {
								message: "Must be a Decimal",
							}),
					])
					.optional(),
				publishedLookbackDays: z
					.union([z.lazy(() => IntFilterSchema), z.number().int()])
					.optional(),
				maxFetchCount: z
					.union([z.lazy(() => IntFilterSchema), z.number().int()])
					.optional(),
				publishedOrderBy: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				user: z
					.union([
						z.lazy(() => UserScalarRelationFilterSchema),
						z.lazy(() => UserWhereInputSchema),
					])
					.optional(),
				ecosystem: z
					.union([
						z.lazy(() => EcosystemScalarRelationFilterSchema),
						z.lazy(() => EcosystemWhereInputSchema),
					])
					.optional(),
			}),
		);

export const VulnerabilityConfigOrderByWithAggregationInputSchema: z.ZodType<Prisma.VulnerabilityConfigOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		minSeverity: z.lazy(() => SortOrderSchema).optional(),
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
		publishedOrderBy: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z
			.lazy(() => VulnerabilityConfigCountOrderByAggregateInputSchema)
			.optional(),
		_avg: z
			.lazy(() => VulnerabilityConfigAvgOrderByAggregateInputSchema)
			.optional(),
		_max: z
			.lazy(() => VulnerabilityConfigMaxOrderByAggregateInputSchema)
			.optional(),
		_min: z
			.lazy(() => VulnerabilityConfigMinOrderByAggregateInputSchema)
			.optional(),
		_sum: z
			.lazy(() => VulnerabilityConfigSumOrderByAggregateInputSchema)
			.optional(),
	});

export const VulnerabilityConfigScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VulnerabilityConfigScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereWithAggregatesInputSchema),
				z
					.lazy(() => VulnerabilityConfigScalarWhereWithAggregatesInputSchema)
					.array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityConfigScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereWithAggregatesInputSchema),
				z
					.lazy(() => VulnerabilityConfigScalarWhereWithAggregatesInputSchema)
					.array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		userId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		ecosystemId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => EnumSeverityWithAggregatesFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z.lazy(() => DecimalWithAggregatesFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		publishedLookbackDays: z
			.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
			.optional(),
		maxFetchCount: z
			.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
			.optional(),
		publishedOrderBy: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const VulnerabilityWhereInputSchema: z.ZodType<Prisma.VulnerabilityWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityWhereInputSchema),
				z.lazy(() => VulnerabilityWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityWhereInputSchema),
				z.lazy(() => VulnerabilityWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ghsaId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		cveId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ecosystemId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		batchId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		packageName: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		severity: z
			.union([
				z.lazy(() => EnumSeverityNullableFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.lazy(() => DecimalFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		summary: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		llmSummary: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		publishedAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z.lazy(() => JsonFilterSchema).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		ecosystem: z
			.union([
				z.lazy(() => EcosystemScalarRelationFilterSchema),
				z.lazy(() => EcosystemWhereInputSchema),
			])
			.optional(),
		batch: z
			.union([
				z.lazy(() => BatchScalarRelationFilterSchema),
				z.lazy(() => BatchWhereInputSchema),
			])
			.optional(),
		notifications: z
			.lazy(() => NotificationListRelationFilterSchema)
			.optional(),
	});

export const VulnerabilityOrderByWithRelationInputSchema: z.ZodType<Prisma.VulnerabilityOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		ghsaId: z.lazy(() => SortOrderSchema).optional(),
		cveId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		batchId: z.lazy(() => SortOrderSchema).optional(),
		packageName: z.lazy(() => SortOrderSchema).optional(),
		severity: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
		summary: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		llmSummary: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		advisoryUrl: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		publishedAt: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		githubAdvisoryResponse: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		ecosystem: z.lazy(() => EcosystemOrderByWithRelationInputSchema).optional(),
		batch: z.lazy(() => BatchOrderByWithRelationInputSchema).optional(),
		notifications: z
			.lazy(() => NotificationOrderByRelationAggregateInputSchema)
			.optional(),
	});

export const VulnerabilityWhereUniqueInputSchema: z.ZodType<Prisma.VulnerabilityWhereUniqueInput> =
	z
		.union([
			z.object({
				id: z.uuid(),
				ghsaId_ecosystemId_packageName: z.lazy(
					() =>
						VulnerabilityGhsaIdEcosystemIdPackageNameCompoundUniqueInputSchema,
				),
			}),
			z.object({
				id: z.uuid(),
			}),
			z.object({
				ghsaId_ecosystemId_packageName: z.lazy(
					() =>
						VulnerabilityGhsaIdEcosystemIdPackageNameCompoundUniqueInputSchema,
				),
			}),
		])
		.and(
			z.strictObject({
				id: z.uuid().optional(),
				ghsaId_ecosystemId_packageName: z
					.lazy(
						() =>
							VulnerabilityGhsaIdEcosystemIdPackageNameCompoundUniqueInputSchema,
					)
					.optional(),
				AND: z
					.union([
						z.lazy(() => VulnerabilityWhereInputSchema),
						z.lazy(() => VulnerabilityWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => VulnerabilityWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => VulnerabilityWhereInputSchema),
						z.lazy(() => VulnerabilityWhereInputSchema).array(),
					])
					.optional(),
				ghsaId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				cveId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				ecosystemId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				batchId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				packageName: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				severity: z
					.union([
						z.lazy(() => EnumSeverityNullableFilterSchema),
						z.lazy(() => SeveritySchema),
					])
					.optional()
					.nullable(),
				cvssScore: z
					.union([
						z.lazy(() => DecimalFilterSchema),
						z
							.union([
								z.number(),
								z.string(),
								z.instanceof(Decimal),
								z.instanceof(Prisma.Decimal),
								DecimalJsLikeSchema,
							])
							.refine((v) => isValidDecimalInput(v), {
								message: "Must be a Decimal",
							}),
					])
					.optional(),
				summary: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				llmSummary: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				advisoryUrl: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				publishedAt: z
					.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
					.optional()
					.nullable(),
				githubAdvisoryResponse: z.lazy(() => JsonFilterSchema).optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				ecosystem: z
					.union([
						z.lazy(() => EcosystemScalarRelationFilterSchema),
						z.lazy(() => EcosystemWhereInputSchema),
					])
					.optional(),
				batch: z
					.union([
						z.lazy(() => BatchScalarRelationFilterSchema),
						z.lazy(() => BatchWhereInputSchema),
					])
					.optional(),
				notifications: z
					.lazy(() => NotificationListRelationFilterSchema)
					.optional(),
			}),
		);

export const VulnerabilityOrderByWithAggregationInputSchema: z.ZodType<Prisma.VulnerabilityOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		ghsaId: z.lazy(() => SortOrderSchema).optional(),
		cveId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		batchId: z.lazy(() => SortOrderSchema).optional(),
		packageName: z.lazy(() => SortOrderSchema).optional(),
		severity: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
		summary: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		llmSummary: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		advisoryUrl: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		publishedAt: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		githubAdvisoryResponse: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z
			.lazy(() => VulnerabilityCountOrderByAggregateInputSchema)
			.optional(),
		_avg: z.lazy(() => VulnerabilityAvgOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => VulnerabilityMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => VulnerabilityMinOrderByAggregateInputSchema).optional(),
		_sum: z.lazy(() => VulnerabilitySumOrderByAggregateInputSchema).optional(),
	});

export const VulnerabilityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VulnerabilityScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereWithAggregatesInputSchema),
				z.lazy(() => VulnerabilityScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereWithAggregatesInputSchema),
				z.lazy(() => VulnerabilityScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		ghsaId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		cveId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		ecosystemId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		batchId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		packageName: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		severity: z
			.union([
				z.lazy(() => EnumSeverityNullableWithAggregatesFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.lazy(() => DecimalWithAggregatesFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		summary: z
			.union([
				z.lazy(() => StringNullableWithAggregatesFilterSchema),
				z.string(),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.lazy(() => StringNullableWithAggregatesFilterSchema),
				z.string(),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.lazy(() => StringNullableWithAggregatesFilterSchema),
				z.string(),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.lazy(() => JsonWithAggregatesFilterSchema)
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const BatchWhereInputSchema: z.ZodType<Prisma.BatchWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => BatchWhereInputSchema),
				z.lazy(() => BatchWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => BatchWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => BatchWhereInputSchema),
				z.lazy(() => BatchWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		triggerType: z
			.union([
				z.lazy(() => EnumBatchTriggerTypeFilterSchema),
				z.lazy(() => BatchTriggerTypeSchema),
			])
			.optional(),
		triggeredBy: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		executedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		status: z
			.union([
				z.lazy(() => EnumBatchStatusFilterSchema),
				z.lazy(() => BatchStatusSchema),
			])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		user: z
			.union([
				z.lazy(() => UserNullableScalarRelationFilterSchema),
				z.lazy(() => UserWhereInputSchema),
			])
			.optional()
			.nullable(),
		vulnerabilities: z
			.lazy(() => VulnerabilityListRelationFilterSchema)
			.optional(),
	});

export const BatchOrderByWithRelationInputSchema: z.ZodType<Prisma.BatchOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		triggerType: z.lazy(() => SortOrderSchema).optional(),
		triggeredBy: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		executedAt: z.lazy(() => SortOrderSchema).optional(),
		status: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityOrderByRelationAggregateInputSchema)
			.optional(),
	});

export const BatchWhereUniqueInputSchema: z.ZodType<Prisma.BatchWhereUniqueInput> =
	z
		.object({
			id: z.uuid(),
		})
		.and(
			z.strictObject({
				id: z.uuid().optional(),
				AND: z
					.union([
						z.lazy(() => BatchWhereInputSchema),
						z.lazy(() => BatchWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => BatchWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => BatchWhereInputSchema),
						z.lazy(() => BatchWhereInputSchema).array(),
					])
					.optional(),
				triggerType: z
					.union([
						z.lazy(() => EnumBatchTriggerTypeFilterSchema),
						z.lazy(() => BatchTriggerTypeSchema),
					])
					.optional(),
				triggeredBy: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				executedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				status: z
					.union([
						z.lazy(() => EnumBatchStatusFilterSchema),
						z.lazy(() => BatchStatusSchema),
					])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				user: z
					.union([
						z.lazy(() => UserNullableScalarRelationFilterSchema),
						z.lazy(() => UserWhereInputSchema),
					])
					.optional()
					.nullable(),
				vulnerabilities: z
					.lazy(() => VulnerabilityListRelationFilterSchema)
					.optional(),
			}),
		);

export const BatchOrderByWithAggregationInputSchema: z.ZodType<Prisma.BatchOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		triggerType: z.lazy(() => SortOrderSchema).optional(),
		triggeredBy: z
			.union([
				z.lazy(() => SortOrderSchema),
				z.lazy(() => SortOrderInputSchema),
			])
			.optional(),
		executedAt: z.lazy(() => SortOrderSchema).optional(),
		status: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z.lazy(() => BatchCountOrderByAggregateInputSchema).optional(),
		_max: z.lazy(() => BatchMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => BatchMinOrderByAggregateInputSchema).optional(),
	});

export const BatchScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BatchScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => BatchScalarWhereWithAggregatesInputSchema),
				z.lazy(() => BatchScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => BatchScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => BatchScalarWhereWithAggregatesInputSchema),
				z.lazy(() => BatchScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => EnumBatchTriggerTypeWithAggregatesFilterSchema),
				z.lazy(() => BatchTriggerTypeSchema),
			])
			.optional(),
		triggeredBy: z
			.union([
				z.lazy(() => StringNullableWithAggregatesFilterSchema),
				z.string(),
			])
			.optional()
			.nullable(),
		executedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => EnumBatchStatusWithAggregatesFilterSchema),
				z.lazy(() => BatchStatusSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const NotificationChannelWhereInputSchema: z.ZodType<Prisma.NotificationChannelWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationChannelWhereInputSchema),
				z.lazy(() => NotificationChannelWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationChannelWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationChannelWhereInputSchema),
				z.lazy(() => NotificationChannelWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		type: z
			.union([
				z.lazy(() => EnumNotificationChannelTypeFilterSchema),
				z.lazy(() => NotificationChannelTypeSchema),
			])
			.optional(),
		maxNotificationLimit: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		enabled: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		user: z
			.union([
				z.lazy(() => UserScalarRelationFilterSchema),
				z.lazy(() => UserWhereInputSchema),
			])
			.optional(),
		lineChannel: z
			.union([
				z.lazy(() => LineChannelNullableScalarRelationFilterSchema),
				z.lazy(() => LineChannelWhereInputSchema),
			])
			.optional()
			.nullable(),
		notifications: z
			.lazy(() => NotificationListRelationFilterSchema)
			.optional(),
	});

export const NotificationChannelOrderByWithRelationInputSchema: z.ZodType<Prisma.NotificationChannelOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
		enabled: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		lineChannel: z
			.lazy(() => LineChannelOrderByWithRelationInputSchema)
			.optional(),
		notifications: z
			.lazy(() => NotificationOrderByRelationAggregateInputSchema)
			.optional(),
	});

export const NotificationChannelWhereUniqueInputSchema: z.ZodType<Prisma.NotificationChannelWhereUniqueInput> =
	z
		.object({
			id: z.string(),
		})
		.and(
			z.strictObject({
				id: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => NotificationChannelWhereInputSchema),
						z.lazy(() => NotificationChannelWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => NotificationChannelWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => NotificationChannelWhereInputSchema),
						z.lazy(() => NotificationChannelWhereInputSchema).array(),
					])
					.optional(),
				userId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				type: z
					.union([
						z.lazy(() => EnumNotificationChannelTypeFilterSchema),
						z.lazy(() => NotificationChannelTypeSchema),
					])
					.optional(),
				maxNotificationLimit: z
					.union([z.lazy(() => IntFilterSchema), z.number().int()])
					.optional(),
				enabled: z
					.union([z.lazy(() => BoolFilterSchema), z.boolean()])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				user: z
					.union([
						z.lazy(() => UserScalarRelationFilterSchema),
						z.lazy(() => UserWhereInputSchema),
					])
					.optional(),
				lineChannel: z
					.union([
						z.lazy(() => LineChannelNullableScalarRelationFilterSchema),
						z.lazy(() => LineChannelWhereInputSchema),
					])
					.optional()
					.nullable(),
				notifications: z
					.lazy(() => NotificationListRelationFilterSchema)
					.optional(),
			}),
		);

export const NotificationChannelOrderByWithAggregationInputSchema: z.ZodType<Prisma.NotificationChannelOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
		enabled: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z
			.lazy(() => NotificationChannelCountOrderByAggregateInputSchema)
			.optional(),
		_avg: z
			.lazy(() => NotificationChannelAvgOrderByAggregateInputSchema)
			.optional(),
		_max: z
			.lazy(() => NotificationChannelMaxOrderByAggregateInputSchema)
			.optional(),
		_min: z
			.lazy(() => NotificationChannelMinOrderByAggregateInputSchema)
			.optional(),
		_sum: z
			.lazy(() => NotificationChannelSumOrderByAggregateInputSchema)
			.optional(),
	});

export const NotificationChannelScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.NotificationChannelScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereWithAggregatesInputSchema),
				z
					.lazy(() => NotificationChannelScalarWhereWithAggregatesInputSchema)
					.array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationChannelScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereWithAggregatesInputSchema),
				z
					.lazy(() => NotificationChannelScalarWhereWithAggregatesInputSchema)
					.array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		userId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		type: z
			.union([
				z.lazy(() => EnumNotificationChannelTypeWithAggregatesFilterSchema),
				z.lazy(() => NotificationChannelTypeSchema),
			])
			.optional(),
		maxNotificationLimit: z
			.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
			.optional(),
		enabled: z
			.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const LineChannelWhereInputSchema: z.ZodType<Prisma.LineChannelWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => LineChannelWhereInputSchema),
				z.lazy(() => LineChannelWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => LineChannelWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => LineChannelWhereInputSchema),
				z.lazy(() => LineChannelWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		notificationChannelId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		lineUserId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		notificationChannel: z
			.union([
				z.lazy(() => NotificationChannelScalarRelationFilterSchema),
				z.lazy(() => NotificationChannelWhereInputSchema),
			])
			.optional(),
	});

export const LineChannelOrderByWithRelationInputSchema: z.ZodType<Prisma.LineChannelOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		lineUserId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		notificationChannel: z
			.lazy(() => NotificationChannelOrderByWithRelationInputSchema)
			.optional(),
	});

export const LineChannelWhereUniqueInputSchema: z.ZodType<Prisma.LineChannelWhereUniqueInput> =
	z
		.union([
			z.object({
				id: z.string(),
				notificationChannelId: z.string(),
				lineUserId: z.string(),
			}),
			z.object({
				id: z.string(),
				notificationChannelId: z.string(),
			}),
			z.object({
				id: z.string(),
				lineUserId: z.string(),
			}),
			z.object({
				id: z.string(),
			}),
			z.object({
				notificationChannelId: z.string(),
				lineUserId: z.string(),
			}),
			z.object({
				notificationChannelId: z.string(),
			}),
			z.object({
				lineUserId: z.string(),
			}),
		])
		.and(
			z.strictObject({
				id: z.string().optional(),
				notificationChannelId: z.string().optional(),
				lineUserId: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => LineChannelWhereInputSchema),
						z.lazy(() => LineChannelWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => LineChannelWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => LineChannelWhereInputSchema),
						z.lazy(() => LineChannelWhereInputSchema).array(),
					])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				notificationChannel: z
					.union([
						z.lazy(() => NotificationChannelScalarRelationFilterSchema),
						z.lazy(() => NotificationChannelWhereInputSchema),
					])
					.optional(),
			}),
		);

export const LineChannelOrderByWithAggregationInputSchema: z.ZodType<Prisma.LineChannelOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		lineUserId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z
			.lazy(() => LineChannelCountOrderByAggregateInputSchema)
			.optional(),
		_max: z.lazy(() => LineChannelMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => LineChannelMinOrderByAggregateInputSchema).optional(),
	});

export const LineChannelScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LineChannelScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => LineChannelScalarWhereWithAggregatesInputSchema),
				z.lazy(() => LineChannelScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => LineChannelScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => LineChannelScalarWhereWithAggregatesInputSchema),
				z.lazy(() => LineChannelScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		notificationChannelId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		lineUserId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const NotificationWhereInputSchema: z.ZodType<Prisma.NotificationWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationWhereInputSchema),
				z.lazy(() => NotificationWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationWhereInputSchema),
				z.lazy(() => NotificationWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		notificationChannelId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		vulnerabilityId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		notifiedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		notificationChannel: z
			.union([
				z.lazy(() => NotificationChannelScalarRelationFilterSchema),
				z.lazy(() => NotificationChannelWhereInputSchema),
			])
			.optional(),
		vulnerability: z
			.union([
				z.lazy(() => VulnerabilityScalarRelationFilterSchema),
				z.lazy(() => VulnerabilityWhereInputSchema),
			])
			.optional(),
	});

export const NotificationOrderByWithRelationInputSchema: z.ZodType<Prisma.NotificationOrderByWithRelationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityId: z.lazy(() => SortOrderSchema).optional(),
		notifiedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		notificationChannel: z
			.lazy(() => NotificationChannelOrderByWithRelationInputSchema)
			.optional(),
		vulnerability: z
			.lazy(() => VulnerabilityOrderByWithRelationInputSchema)
			.optional(),
	});

export const NotificationWhereUniqueInputSchema: z.ZodType<Prisma.NotificationWhereUniqueInput> =
	z
		.object({
			id: z.uuid(),
		})
		.and(
			z.strictObject({
				id: z.uuid().optional(),
				AND: z
					.union([
						z.lazy(() => NotificationWhereInputSchema),
						z.lazy(() => NotificationWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => NotificationWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => NotificationWhereInputSchema),
						z.lazy(() => NotificationWhereInputSchema).array(),
					])
					.optional(),
				notificationChannelId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				vulnerabilityId: z
					.union([z.lazy(() => StringFilterSchema), z.string()])
					.optional(),
				notifiedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				updatedAt: z
					.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
					.optional(),
				notificationChannel: z
					.union([
						z.lazy(() => NotificationChannelScalarRelationFilterSchema),
						z.lazy(() => NotificationChannelWhereInputSchema),
					])
					.optional(),
				vulnerability: z
					.union([
						z.lazy(() => VulnerabilityScalarRelationFilterSchema),
						z.lazy(() => VulnerabilityWhereInputSchema),
					])
					.optional(),
			}),
		);

export const NotificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.NotificationOrderByWithAggregationInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityId: z.lazy(() => SortOrderSchema).optional(),
		notifiedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		_count: z
			.lazy(() => NotificationCountOrderByAggregateInputSchema)
			.optional(),
		_max: z.lazy(() => NotificationMaxOrderByAggregateInputSchema).optional(),
		_min: z.lazy(() => NotificationMinOrderByAggregateInputSchema).optional(),
	});

export const NotificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.NotificationScalarWhereWithAggregatesInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationScalarWhereWithAggregatesInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema),
				z.lazy(() => NotificationScalarWhereWithAggregatesInputSchema).array(),
			])
			.optional(),
		id: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		notificationChannelId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		vulnerabilityId: z
			.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
			.optional(),
		notifiedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		createdAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
		updatedAt: z
			.union([
				z.lazy(() => DateTimeWithAggregatesFilterSchema),
				z.coerce.date(),
			])
			.optional(),
	});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigCreateNestedManyWithoutUserInputSchema)
			.optional(),
		batches: z
			.lazy(() => BatchCreateNestedManyWithoutUserInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelCreateNestedManyWithoutUserInputSchema)
			.optional(),
	});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
		batches: z
			.lazy(() => BatchUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
	});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		batches: z
			.lazy(() => BatchUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelUpdateManyWithoutUserNestedInputSchema)
			.optional(),
	});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
		batches: z
			.lazy(() => BatchUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
	});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const EcosystemCreateInputSchema: z.ZodType<Prisma.EcosystemCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() => VulnerabilityConfigCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityCreateNestedManyWithoutEcosystemInputSchema)
			.optional(),
	});

export const EcosystemUncheckedCreateInputSchema: z.ZodType<Prisma.EcosystemUncheckedCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
		vulnerabilities: z
			.lazy(
				() => VulnerabilityUncheckedCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
	});

export const EcosystemUpdateInputSchema: z.ZodType<Prisma.EcosystemUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() => VulnerabilityConfigUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUpdateManyWithoutEcosystemNestedInputSchema)
			.optional(),
	});

export const EcosystemUncheckedUpdateInputSchema: z.ZodType<Prisma.EcosystemUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
		vulnerabilities: z
			.lazy(
				() => VulnerabilityUncheckedUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
	});

export const EcosystemCreateManyInputSchema: z.ZodType<Prisma.EcosystemCreateManyInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const EcosystemUpdateManyMutationInputSchema: z.ZodType<Prisma.EcosystemUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const EcosystemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EcosystemUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigCreateInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(
			() => UserCreateNestedOneWithoutVulnerabilityConfigsInputSchema,
		),
		ecosystem: z.lazy(
			() => EcosystemCreateNestedOneWithoutVulnerabilityConfigsInputSchema,
		),
	});

export const VulnerabilityConfigUncheckedCreateInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		ecosystemId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigUpdateInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z
			.lazy(
				() => UserUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema,
			)
			.optional(),
		ecosystem: z
			.lazy(
				() =>
					EcosystemUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigCreateManyInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		ecosystemId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigUpdateManyMutationInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityCreateInputSchema: z.ZodType<Prisma.VulnerabilityCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		ecosystem: z.lazy(
			() => EcosystemCreateNestedOneWithoutVulnerabilitiesInputSchema,
		),
		batch: z.lazy(() => BatchCreateNestedOneWithoutVulnerabilitiesInputSchema),
		notifications: z
			.lazy(() => NotificationCreateNestedManyWithoutVulnerabilityInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedCreateInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		ecosystemId: z.string(),
		batchId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutVulnerabilityInputSchema,
			)
			.optional(),
	});

export const VulnerabilityUpdateInputSchema: z.ZodType<Prisma.VulnerabilityUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		ecosystem: z
			.lazy(
				() => EcosystemUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema,
			)
			.optional(),
		batch: z
			.lazy(() => BatchUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema)
			.optional(),
		notifications: z
			.lazy(() => NotificationUpdateManyWithoutVulnerabilityNestedInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		batchId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutVulnerabilityNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityCreateManyInputSchema: z.ZodType<Prisma.VulnerabilityCreateManyInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		ecosystemId: z.string(),
		batchId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityUpdateManyMutationInputSchema: z.ZodType<Prisma.VulnerabilityUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		batchId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const BatchCreateInputSchema: z.ZodType<Prisma.BatchCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutBatchesInputSchema).optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityCreateNestedManyWithoutBatchInputSchema)
			.optional(),
	});

export const BatchUncheckedCreateInputSchema: z.ZodType<Prisma.BatchUncheckedCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		triggeredBy: z.string().optional().nullable(),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUncheckedCreateNestedManyWithoutBatchInputSchema)
			.optional(),
	});

export const BatchUpdateInputSchema: z.ZodType<Prisma.BatchUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z.lazy(() => UserUpdateOneWithoutBatchesNestedInputSchema).optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUpdateManyWithoutBatchNestedInputSchema)
			.optional(),
	});

export const BatchUncheckedUpdateInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		triggeredBy: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUncheckedUpdateManyWithoutBatchNestedInputSchema)
			.optional(),
	});

export const BatchCreateManyInputSchema: z.ZodType<Prisma.BatchCreateManyInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		triggeredBy: z.string().optional().nullable(),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const BatchUpdateManyMutationInputSchema: z.ZodType<Prisma.BatchUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const BatchUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		triggeredBy: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationChannelCreateInputSchema: z.ZodType<Prisma.NotificationChannelCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(
			() => UserCreateNestedOneWithoutNotificationChannelsInputSchema,
		),
		lineChannel: z
			.lazy(
				() => LineChannelCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() => NotificationCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedCreateInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUpdateInputSchema: z.ZodType<Prisma.NotificationChannelUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z
			.lazy(
				() => UserUpdateOneRequiredWithoutNotificationChannelsNestedInputSchema,
			)
			.optional(),
		lineChannel: z
			.lazy(
				() => LineChannelUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() => NotificationUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedUpdateInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelCreateManyInputSchema: z.ZodType<Prisma.NotificationChannelCreateManyInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationChannelUpdateManyMutationInputSchema: z.ZodType<Prisma.NotificationChannelUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationChannelUncheckedUpdateManyInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const LineChannelCreateInputSchema: z.ZodType<Prisma.LineChannelCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		lineUserId: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notificationChannel: z.lazy(
			() => NotificationChannelCreateNestedOneWithoutLineChannelInputSchema,
		),
	});

export const LineChannelUncheckedCreateInputSchema: z.ZodType<Prisma.LineChannelUncheckedCreateInput> =
	z.strictObject({
		id: z.string().optional(),
		notificationChannelId: z.string(),
		lineUserId: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const LineChannelUpdateInputSchema: z.ZodType<Prisma.LineChannelUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notificationChannel: z
			.lazy(
				() =>
					NotificationChannelUpdateOneRequiredWithoutLineChannelNestedInputSchema,
			)
			.optional(),
	});

export const LineChannelUncheckedUpdateInputSchema: z.ZodType<Prisma.LineChannelUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const LineChannelCreateManyInputSchema: z.ZodType<Prisma.LineChannelCreateManyInput> =
	z.strictObject({
		id: z.string().optional(),
		notificationChannelId: z.string(),
		lineUserId: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const LineChannelUpdateManyMutationInputSchema: z.ZodType<Prisma.LineChannelUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const LineChannelUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LineChannelUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationCreateInputSchema: z.ZodType<Prisma.NotificationCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notificationChannel: z.lazy(
			() => NotificationChannelCreateNestedOneWithoutNotificationsInputSchema,
		),
		vulnerability: z.lazy(
			() => VulnerabilityCreateNestedOneWithoutNotificationsInputSchema,
		),
	});

export const NotificationUncheckedCreateInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notificationChannelId: z.string(),
		vulnerabilityId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationUpdateInputSchema: z.ZodType<Prisma.NotificationUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notificationChannel: z
			.lazy(
				() =>
					NotificationChannelUpdateOneRequiredWithoutNotificationsNestedInputSchema,
			)
			.optional(),
		vulnerability: z
			.lazy(
				() =>
					VulnerabilityUpdateOneRequiredWithoutNotificationsNestedInputSchema,
			)
			.optional(),
	});

export const NotificationUncheckedUpdateInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		vulnerabilityId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationCreateManyInputSchema: z.ZodType<Prisma.NotificationCreateManyInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notificationChannelId: z.string(),
		vulnerabilityId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationUpdateManyMutationInputSchema: z.ZodType<Prisma.NotificationUpdateManyMutationInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		vulnerabilityId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringFilterSchema)])
			.optional(),
	});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
			.optional(),
	});

export const VulnerabilityConfigListRelationFilterSchema: z.ZodType<Prisma.VulnerabilityConfigListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => VulnerabilityConfigWhereInputSchema).optional(),
		some: z.lazy(() => VulnerabilityConfigWhereInputSchema).optional(),
		none: z.lazy(() => VulnerabilityConfigWhereInputSchema).optional(),
	});

export const BatchListRelationFilterSchema: z.ZodType<Prisma.BatchListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => BatchWhereInputSchema).optional(),
		some: z.lazy(() => BatchWhereInputSchema).optional(),
		none: z.lazy(() => BatchWhereInputSchema).optional(),
	});

export const NotificationChannelListRelationFilterSchema: z.ZodType<Prisma.NotificationChannelListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
		some: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
		none: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
	});

export const VulnerabilityConfigOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	});

export const BatchOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BatchOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationChannelOrderByRelationAggregateInputSchema: z.ZodType<Prisma.NotificationChannelOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		cognitoSub: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		cognitoSub: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		cognitoSub: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	});

export const VulnerabilityListRelationFilterSchema: z.ZodType<Prisma.VulnerabilityListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
		some: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
		none: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
	});

export const VulnerabilityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VulnerabilityOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	});

export const EcosystemCountOrderByAggregateInputSchema: z.ZodType<Prisma.EcosystemCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const EcosystemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EcosystemMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const EcosystemMinOrderByAggregateInputSchema: z.ZodType<Prisma.EcosystemMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const EnumSeverityFilterSchema: z.ZodType<Prisma.EnumSeverityFilter> =
	z.strictObject({
		equals: z.lazy(() => SeveritySchema).optional(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityFilterSchema),
			])
			.optional(),
	});

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> =
	z.strictObject({
		equals: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		in: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		notIn: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		lt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		lte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		not: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => NestedDecimalFilterSchema),
			])
			.optional(),
	});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
	equals: z.number().optional(),
	in: z.number().array().optional(),
	notIn: z.number().array().optional(),
	lt: z.number().optional(),
	lte: z.number().optional(),
	gt: z.number().optional(),
	gte: z.number().optional(),
	not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => UserWhereInputSchema).optional(),
		isNot: z.lazy(() => UserWhereInputSchema).optional(),
	});

export const EcosystemScalarRelationFilterSchema: z.ZodType<Prisma.EcosystemScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => EcosystemWhereInputSchema).optional(),
		isNot: z.lazy(() => EcosystemWhereInputSchema).optional(),
	});

export const VulnerabilityConfigUserIdEcosystemIdCompoundUniqueInputSchema: z.ZodType<Prisma.VulnerabilityConfigUserIdEcosystemIdCompoundUniqueInput> =
	z.strictObject({
		userId: z.string(),
		ecosystemId: z.string(),
	});

export const VulnerabilityConfigCountOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		minSeverity: z.lazy(() => SortOrderSchema).optional(),
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
		publishedOrderBy: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityConfigAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigAvgOrderByAggregateInput> =
	z.strictObject({
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityConfigMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		minSeverity: z.lazy(() => SortOrderSchema).optional(),
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
		publishedOrderBy: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityConfigMinOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		minSeverity: z.lazy(() => SortOrderSchema).optional(),
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
		publishedOrderBy: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityConfigSumOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityConfigSumOrderByAggregateInput> =
	z.strictObject({
		minCvssScore: z.lazy(() => SortOrderSchema).optional(),
		publishedLookbackDays: z.lazy(() => SortOrderSchema).optional(),
		maxFetchCount: z.lazy(() => SortOrderSchema).optional(),
	});

export const EnumSeverityWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSeverityWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => SeveritySchema).optional(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumSeverityFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumSeverityFilterSchema).optional(),
	});

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> =
	z.strictObject({
		equals: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		in: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		notIn: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		lt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		lte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		not: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => NestedDecimalWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_min: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_max: z.lazy(() => NestedDecimalFilterSchema).optional(),
	});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> =
	z.strictObject({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_avg: z.lazy(() => NestedFloatFilterSchema).optional(),
		_sum: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedIntFilterSchema).optional(),
		_max: z.lazy(() => NestedIntFilterSchema).optional(),
	});

export const EnumSeverityNullableFilterSchema: z.ZodType<Prisma.EnumSeverityNullableFilter> =
	z.strictObject({
		equals: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityNullableFilterSchema),
			])
			.optional()
			.nullable(),
	});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeNullableFilterSchema),
			])
			.optional()
			.nullable(),
	});

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
	equals: InputJsonValueSchema.optional(),
	path: z.string().array().optional(),
	mode: z.lazy(() => QueryModeSchema).optional(),
	string_contains: z.string().optional(),
	string_starts_with: z.string().optional(),
	string_ends_with: z.string().optional(),
	array_starts_with: InputJsonValueSchema.optional().nullable(),
	array_ends_with: InputJsonValueSchema.optional().nullable(),
	array_contains: InputJsonValueSchema.optional().nullable(),
	lt: InputJsonValueSchema.optional(),
	lte: InputJsonValueSchema.optional(),
	gt: InputJsonValueSchema.optional(),
	gte: InputJsonValueSchema.optional(),
	not: InputJsonValueSchema.optional(),
});

export const BatchScalarRelationFilterSchema: z.ZodType<Prisma.BatchScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => BatchWhereInputSchema).optional(),
		isNot: z.lazy(() => BatchWhereInputSchema).optional(),
	});

export const NotificationListRelationFilterSchema: z.ZodType<Prisma.NotificationListRelationFilter> =
	z.strictObject({
		every: z.lazy(() => NotificationWhereInputSchema).optional(),
		some: z.lazy(() => NotificationWhereInputSchema).optional(),
		none: z.lazy(() => NotificationWhereInputSchema).optional(),
	});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> =
	z.strictObject({
		sort: z.lazy(() => SortOrderSchema),
		nulls: z.lazy(() => NullsOrderSchema).optional(),
	});

export const NotificationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.NotificationOrderByRelationAggregateInput> =
	z.strictObject({
		_count: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityGhsaIdEcosystemIdPackageNameCompoundUniqueInputSchema: z.ZodType<Prisma.VulnerabilityGhsaIdEcosystemIdPackageNameCompoundUniqueInput> =
	z.strictObject({
		ghsaId: z.string(),
		ecosystemId: z.string(),
		packageName: z.string(),
	});

export const VulnerabilityCountOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		ghsaId: z.lazy(() => SortOrderSchema).optional(),
		cveId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		batchId: z.lazy(() => SortOrderSchema).optional(),
		packageName: z.lazy(() => SortOrderSchema).optional(),
		severity: z.lazy(() => SortOrderSchema).optional(),
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
		summary: z.lazy(() => SortOrderSchema).optional(),
		llmSummary: z.lazy(() => SortOrderSchema).optional(),
		advisoryUrl: z.lazy(() => SortOrderSchema).optional(),
		publishedAt: z.lazy(() => SortOrderSchema).optional(),
		githubAdvisoryResponse: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityAvgOrderByAggregateInput> =
	z.strictObject({
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		ghsaId: z.lazy(() => SortOrderSchema).optional(),
		cveId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		batchId: z.lazy(() => SortOrderSchema).optional(),
		packageName: z.lazy(() => SortOrderSchema).optional(),
		severity: z.lazy(() => SortOrderSchema).optional(),
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
		summary: z.lazy(() => SortOrderSchema).optional(),
		llmSummary: z.lazy(() => SortOrderSchema).optional(),
		advisoryUrl: z.lazy(() => SortOrderSchema).optional(),
		publishedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityMinOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilityMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		ghsaId: z.lazy(() => SortOrderSchema).optional(),
		cveId: z.lazy(() => SortOrderSchema).optional(),
		ecosystemId: z.lazy(() => SortOrderSchema).optional(),
		batchId: z.lazy(() => SortOrderSchema).optional(),
		packageName: z.lazy(() => SortOrderSchema).optional(),
		severity: z.lazy(() => SortOrderSchema).optional(),
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
		summary: z.lazy(() => SortOrderSchema).optional(),
		llmSummary: z.lazy(() => SortOrderSchema).optional(),
		advisoryUrl: z.lazy(() => SortOrderSchema).optional(),
		publishedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilitySumOrderByAggregateInputSchema: z.ZodType<Prisma.VulnerabilitySumOrderByAggregateInput> =
	z.strictObject({
		cvssScore: z.lazy(() => SortOrderSchema).optional(),
	});

export const EnumSeverityNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSeverityNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumSeverityNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumSeverityNullableFilterSchema).optional(),
	});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([
				z.string(),
				z.lazy(() => NestedStringNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
	});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
	});

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> =
	z.strictObject({
		equals: InputJsonValueSchema.optional(),
		path: z.string().array().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		string_contains: z.string().optional(),
		string_starts_with: z.string().optional(),
		string_ends_with: z.string().optional(),
		array_starts_with: InputJsonValueSchema.optional().nullable(),
		array_ends_with: InputJsonValueSchema.optional().nullable(),
		array_contains: InputJsonValueSchema.optional().nullable(),
		lt: InputJsonValueSchema.optional(),
		lte: InputJsonValueSchema.optional(),
		gt: InputJsonValueSchema.optional(),
		gte: InputJsonValueSchema.optional(),
		not: InputJsonValueSchema.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedJsonFilterSchema).optional(),
		_max: z.lazy(() => NestedJsonFilterSchema).optional(),
	});

export const EnumBatchTriggerTypeFilterSchema: z.ZodType<Prisma.EnumBatchTriggerTypeFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchTriggerTypeSchema).optional(),
		in: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema),
			])
			.optional(),
	});

export const EnumBatchStatusFilterSchema: z.ZodType<Prisma.EnumBatchStatusFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchStatusSchema).optional(),
		in: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => NestedEnumBatchStatusFilterSchema),
			])
			.optional(),
	});

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> =
	z.strictObject({
		is: z
			.lazy(() => UserWhereInputSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => UserWhereInputSchema)
			.optional()
			.nullable(),
	});

export const BatchCountOrderByAggregateInputSchema: z.ZodType<Prisma.BatchCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		triggerType: z.lazy(() => SortOrderSchema).optional(),
		triggeredBy: z.lazy(() => SortOrderSchema).optional(),
		executedAt: z.lazy(() => SortOrderSchema).optional(),
		status: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const BatchMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BatchMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		triggerType: z.lazy(() => SortOrderSchema).optional(),
		triggeredBy: z.lazy(() => SortOrderSchema).optional(),
		executedAt: z.lazy(() => SortOrderSchema).optional(),
		status: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const BatchMinOrderByAggregateInputSchema: z.ZodType<Prisma.BatchMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		triggerType: z.lazy(() => SortOrderSchema).optional(),
		triggeredBy: z.lazy(() => SortOrderSchema).optional(),
		executedAt: z.lazy(() => SortOrderSchema).optional(),
		status: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const EnumBatchTriggerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBatchTriggerTypeWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchTriggerTypeSchema).optional(),
		in: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => NestedEnumBatchTriggerTypeWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema).optional(),
	});

export const EnumBatchStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBatchStatusWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchStatusSchema).optional(),
		in: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => NestedEnumBatchStatusWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
	});

export const EnumNotificationChannelTypeFilterSchema: z.ZodType<Prisma.EnumNotificationChannelTypeFilter> =
	z.strictObject({
		equals: z.lazy(() => NotificationChannelTypeSchema).optional(),
		in: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(() => NestedEnumNotificationChannelTypeFilterSchema),
			])
			.optional(),
	});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
	equals: z.boolean().optional(),
	not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
});

export const LineChannelNullableScalarRelationFilterSchema: z.ZodType<Prisma.LineChannelNullableScalarRelationFilter> =
	z.strictObject({
		is: z
			.lazy(() => LineChannelWhereInputSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => LineChannelWhereInputSchema)
			.optional()
			.nullable(),
	});

export const NotificationChannelCountOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationChannelCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
		enabled: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationChannelAvgOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationChannelAvgOrderByAggregateInput> =
	z.strictObject({
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationChannelMaxOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationChannelMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
		enabled: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationChannelMinOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationChannelMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
		enabled: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationChannelSumOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationChannelSumOrderByAggregateInput> =
	z.strictObject({
		maxNotificationLimit: z.lazy(() => SortOrderSchema).optional(),
	});

export const EnumNotificationChannelTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumNotificationChannelTypeWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => NotificationChannelTypeSchema).optional(),
		in: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => NestedEnumNotificationChannelTypeWithAggregatesFilterSchema,
				),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z
			.lazy(() => NestedEnumNotificationChannelTypeFilterSchema)
			.optional(),
		_max: z
			.lazy(() => NestedEnumNotificationChannelTypeFilterSchema)
			.optional(),
	});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> =
	z.strictObject({
		equals: z.boolean().optional(),
		not: z
			.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedBoolFilterSchema).optional(),
		_max: z.lazy(() => NestedBoolFilterSchema).optional(),
	});

export const NotificationChannelScalarRelationFilterSchema: z.ZodType<Prisma.NotificationChannelScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
		isNot: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
	});

export const LineChannelCountOrderByAggregateInputSchema: z.ZodType<Prisma.LineChannelCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		lineUserId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const LineChannelMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LineChannelMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		lineUserId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const LineChannelMinOrderByAggregateInputSchema: z.ZodType<Prisma.LineChannelMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		lineUserId: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityScalarRelationFilterSchema: z.ZodType<Prisma.VulnerabilityScalarRelationFilter> =
	z.strictObject({
		is: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
		isNot: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
	});

export const NotificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationCountOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityId: z.lazy(() => SortOrderSchema).optional(),
		notifiedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationMaxOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityId: z.lazy(() => SortOrderSchema).optional(),
		notifiedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const NotificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.NotificationMinOrderByAggregateInput> =
	z.strictObject({
		id: z.lazy(() => SortOrderSchema).optional(),
		notificationChannelId: z.lazy(() => SortOrderSchema).optional(),
		vulnerabilityId: z.lazy(() => SortOrderSchema).optional(),
		notifiedAt: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
	});

export const VulnerabilityConfigCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema).array(),
				z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyUserInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const BatchCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BatchCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutUserInputSchema),
				z.lazy(() => BatchCreateWithoutUserInputSchema).array(),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BatchCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const NotificationChannelCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema).array(),
				z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationChannelCreateManyUserInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema).array(),
				z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyUserInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const BatchUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.BatchUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutUserInputSchema),
				z.lazy(() => BatchCreateWithoutUserInputSchema).array(),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BatchCreateManyUserInputEnvelopeSchema).optional(),
		connect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const NotificationChannelUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedCreateNestedManyWithoutUserInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema).array(),
				z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationChannelCreateManyUserInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.string().optional(),
	});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.coerce.date().optional(),
	});

export const VulnerabilityConfigUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema).array(),
				z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyUserInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpdateManyWithWhereWithoutUserInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUpdateManyWithWhereWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const BatchUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BatchUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutUserInputSchema),
				z.lazy(() => BatchCreateWithoutUserInputSchema).array(),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => BatchUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => BatchUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BatchCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => BatchUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => BatchUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => BatchUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => BatchUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => BatchScalarWhereInputSchema),
				z.lazy(() => BatchScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const NotificationChannelUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.NotificationChannelUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema).array(),
				z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => NotificationChannelUpsertWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationChannelUpsertWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationChannelCreateManyUserInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => NotificationChannelUpdateWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationChannelUpdateWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => NotificationChannelUpdateManyWithWhereWithoutUserInputSchema,
				),
				z
					.lazy(
						() => NotificationChannelUpdateManyWithWhereWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereInputSchema),
				z.lazy(() => NotificationChannelScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
				z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema).array(),
				z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyUserInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => VulnerabilityConfigUpdateManyWithWhereWithoutUserInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUpdateManyWithWhereWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const BatchUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutUserInputSchema),
				z.lazy(() => BatchCreateWithoutUserInputSchema).array(),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema),
				z.lazy(() => BatchCreateOrConnectWithoutUserInputSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => BatchUpsertWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => BatchUpsertWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BatchCreateManyUserInputEnvelopeSchema).optional(),
		set: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => BatchWhereUniqueInputSchema),
				z.lazy(() => BatchWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => BatchUpdateWithWhereUniqueWithoutUserInputSchema),
				z.lazy(() => BatchUpdateWithWhereUniqueWithoutUserInputSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => BatchUpdateManyWithWhereWithoutUserInputSchema),
				z.lazy(() => BatchUpdateManyWithWhereWithoutUserInputSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => BatchScalarWhereInputSchema),
				z.lazy(() => BatchScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const NotificationChannelUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateManyWithoutUserNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
				z.lazy(() => NotificationChannelCreateWithoutUserInputSchema).array(),
				z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema),
				z
					.lazy(() => NotificationChannelCreateOrConnectWithoutUserInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => NotificationChannelUpsertWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationChannelUpsertWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationChannelCreateManyUserInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationChannelWhereUniqueInputSchema),
				z.lazy(() => NotificationChannelWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => NotificationChannelUpdateWithWhereUniqueWithoutUserInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationChannelUpdateWithWhereUniqueWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => NotificationChannelUpdateManyWithWhereWithoutUserInputSchema,
				),
				z
					.lazy(
						() => NotificationChannelUpdateManyWithWhereWithoutUserInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereInputSchema),
				z.lazy(() => NotificationChannelScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigCreateNestedManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateNestedManyWithoutEcosystemInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema)
					.array(),
				z.lazy(
					() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityCreateNestedManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityCreateNestedManyWithoutEcosystemInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedCreateNestedManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedCreateNestedManyWithoutEcosystemInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema)
					.array(),
				z.lazy(
					() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityUncheckedCreateNestedManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateNestedManyWithoutEcosystemInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigUpdateManyWithoutEcosystemNestedInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyWithoutEcosystemNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema)
					.array(),
				z.lazy(
					() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityUpdateManyWithoutEcosystemNestedInputSchema: z.ZodType<Prisma.VulnerabilityUpdateManyWithoutEcosystemNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => VulnerabilityUpdateManyWithWhereWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpdateManyWithWhereWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemNestedInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema)
					.array(),
				z.lazy(
					() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityConfigCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() =>
						VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() =>
							VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityUncheckedUpdateManyWithoutEcosystemNestedInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateManyWithoutEcosystemNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutEcosystemInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() => VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyEcosystemInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() => VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => VulnerabilityUpdateManyWithWhereWithoutEcosystemInputSchema,
				),
				z
					.lazy(
						() => VulnerabilityUpdateManyWithWhereWithoutEcosystemInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const UserCreateNestedOneWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutVulnerabilityConfigsInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutVulnerabilityConfigsInputSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	});

export const EcosystemCreateNestedOneWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemCreateNestedOneWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => EcosystemCreateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(
					() => EcosystemUncheckedCreateWithoutVulnerabilityConfigsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => EcosystemCreateOrConnectWithoutVulnerabilityConfigsInputSchema,
			)
			.optional(),
		connect: z.lazy(() => EcosystemWhereUniqueInputSchema).optional(),
	});

export const EnumSeverityFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSeverityFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.lazy(() => SeveritySchema).optional(),
	});

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> =
	z.strictObject({
		set: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		increment: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		decrement: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		multiply: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		divide: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
	});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.number().optional(),
		increment: z.number().optional(),
		decrement: z.number().optional(),
		multiply: z.number().optional(),
		divide: z.number().optional(),
	});

export const UserUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutVulnerabilityConfigsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutVulnerabilityConfigsInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutVulnerabilityConfigsInputSchema)
			.optional(),
		upsert: z
			.lazy(() => UserUpsertWithoutVulnerabilityConfigsInputSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() => UserUpdateToOneWithWhereWithoutVulnerabilityConfigsInputSchema,
				),
				z.lazy(() => UserUpdateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutVulnerabilityConfigsInputSchema),
			])
			.optional(),
	});

export const EcosystemUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema: z.ZodType<Prisma.EcosystemUpdateOneRequiredWithoutVulnerabilityConfigsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => EcosystemCreateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(
					() => EcosystemUncheckedCreateWithoutVulnerabilityConfigsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => EcosystemCreateOrConnectWithoutVulnerabilityConfigsInputSchema,
			)
			.optional(),
		upsert: z
			.lazy(() => EcosystemUpsertWithoutVulnerabilityConfigsInputSchema)
			.optional(),
		connect: z.lazy(() => EcosystemWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						EcosystemUpdateToOneWithWhereWithoutVulnerabilityConfigsInputSchema,
				),
				z.lazy(() => EcosystemUpdateWithoutVulnerabilityConfigsInputSchema),
				z.lazy(
					() => EcosystemUncheckedUpdateWithoutVulnerabilityConfigsInputSchema,
				),
			])
			.optional(),
	});

export const EcosystemCreateNestedOneWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemCreateNestedOneWithoutVulnerabilitiesInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => EcosystemCreateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => EcosystemUncheckedCreateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EcosystemCreateOrConnectWithoutVulnerabilitiesInputSchema)
			.optional(),
		connect: z.lazy(() => EcosystemWhereUniqueInputSchema).optional(),
	});

export const BatchCreateNestedOneWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchCreateNestedOneWithoutVulnerabilitiesInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BatchCreateOrConnectWithoutVulnerabilitiesInputSchema)
			.optional(),
		connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
	});

export const NotificationCreateNestedManyWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationCreateNestedManyWithoutVulnerabilityInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema).array(),
				z.lazy(
					() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyVulnerabilityInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const NotificationUncheckedCreateNestedManyWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutVulnerabilityInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema).array(),
				z.lazy(
					() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyVulnerabilityInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const NullableEnumSeverityFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumSeverityFieldUpdateOperationsInput> =
	z.strictObject({
		set: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
	});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.string().optional().nullable(),
	});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.coerce.date().optional().nullable(),
	});

export const EcosystemUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema: z.ZodType<Prisma.EcosystemUpdateOneRequiredWithoutVulnerabilitiesNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => EcosystemCreateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => EcosystemUncheckedCreateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EcosystemCreateOrConnectWithoutVulnerabilitiesInputSchema)
			.optional(),
		upsert: z
			.lazy(() => EcosystemUpsertWithoutVulnerabilitiesInputSchema)
			.optional(),
		connect: z.lazy(() => EcosystemWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() => EcosystemUpdateToOneWithWhereWithoutVulnerabilitiesInputSchema,
				),
				z.lazy(() => EcosystemUpdateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => EcosystemUncheckedUpdateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
	});

export const BatchUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema: z.ZodType<Prisma.BatchUpdateOneRequiredWithoutVulnerabilitiesNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => BatchCreateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => BatchUncheckedCreateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BatchCreateOrConnectWithoutVulnerabilitiesInputSchema)
			.optional(),
		upsert: z
			.lazy(() => BatchUpsertWithoutVulnerabilitiesInputSchema)
			.optional(),
		connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() => BatchUpdateToOneWithWhereWithoutVulnerabilitiesInputSchema,
				),
				z.lazy(() => BatchUpdateWithoutVulnerabilitiesInputSchema),
				z.lazy(() => BatchUncheckedUpdateWithoutVulnerabilitiesInputSchema),
			])
			.optional(),
	});

export const NotificationUpdateManyWithoutVulnerabilityNestedInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithoutVulnerabilityNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema).array(),
				z.lazy(
					() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						NotificationUpsertWithWhereUniqueWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpsertWithWhereUniqueWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyVulnerabilityInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateWithWhereUniqueWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateWithWhereUniqueWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => NotificationUpdateManyWithWhereWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateManyWithWhereWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const NotificationUncheckedUpdateManyWithoutVulnerabilityNestedInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutVulnerabilityNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
				z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema).array(),
				z.lazy(
					() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() => NotificationCreateOrConnectWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						NotificationUpsertWithWhereUniqueWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpsertWithWhereUniqueWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyVulnerabilityInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateWithWhereUniqueWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateWithWhereUniqueWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() => NotificationUpdateManyWithWhereWithoutVulnerabilityInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateManyWithWhereWithoutVulnerabilityInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const UserCreateNestedOneWithoutBatchesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBatchesInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutBatchesInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutBatchesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutBatchesInputSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	});

export const VulnerabilityCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityCreateNestedManyWithoutBatchInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyBatchInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityUncheckedCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateNestedManyWithoutBatchInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyBatchInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const EnumBatchTriggerTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBatchTriggerTypeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.lazy(() => BatchTriggerTypeSchema).optional(),
	});

export const EnumBatchStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBatchStatusFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.lazy(() => BatchStatusSchema).optional(),
	});

export const UserUpdateOneWithoutBatchesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutBatchesNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutBatchesInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutBatchesInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutBatchesInputSchema)
			.optional(),
		upsert: z.lazy(() => UserUpsertWithoutBatchesInputSchema).optional(),
		disconnect: z
			.union([z.boolean(), z.lazy(() => UserWhereInputSchema)])
			.optional(),
		delete: z
			.union([z.boolean(), z.lazy(() => UserWhereInputSchema)])
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(() => UserUpdateToOneWithWhereWithoutBatchesInputSchema),
				z.lazy(() => UserUpdateWithoutBatchesInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutBatchesInputSchema),
			])
			.optional(),
	});

export const VulnerabilityUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.VulnerabilityUpdateManyWithoutBatchNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => VulnerabilityUpsertWithWhereUniqueWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpsertWithWhereUniqueWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyBatchInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => VulnerabilityUpdateWithWhereUniqueWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpdateWithWhereUniqueWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => VulnerabilityUpdateManyWithWhereWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpdateManyWithWhereWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const VulnerabilityUncheckedUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateManyWithoutBatchNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
				z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema).array(),
				z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityCreateOrConnectWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => VulnerabilityUpsertWithWhereUniqueWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpsertWithWhereUniqueWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => VulnerabilityCreateManyBatchInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => VulnerabilityWhereUniqueInputSchema),
				z.lazy(() => VulnerabilityWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => VulnerabilityUpdateWithWhereUniqueWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpdateWithWhereUniqueWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => VulnerabilityUpdateManyWithWhereWithoutBatchInputSchema),
				z
					.lazy(() => VulnerabilityUpdateManyWithWhereWithoutBatchInputSchema)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const UserCreateNestedOneWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutNotificationChannelsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutNotificationChannelsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutNotificationChannelsInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutNotificationChannelsInputSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
	});

export const LineChannelCreateNestedOneWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelCreateNestedOneWithoutNotificationChannelInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => LineChannelCreateOrConnectWithoutNotificationChannelInputSchema,
			)
			.optional(),
		connect: z.lazy(() => LineChannelWhereUniqueInputSchema).optional(),
	});

export const NotificationCreateNestedManyWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationCreateNestedManyWithoutNotificationChannelInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
				z
					.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema)
					.array(),
				z.lazy(
					() =>
						NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() =>
						NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyNotificationChannelInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const LineChannelUncheckedCreateNestedOneWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUncheckedCreateNestedOneWithoutNotificationChannelInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => LineChannelCreateOrConnectWithoutNotificationChannelInputSchema,
			)
			.optional(),
		connect: z.lazy(() => LineChannelWhereUniqueInputSchema).optional(),
	});

export const NotificationUncheckedCreateNestedManyWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutNotificationChannelInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
				z
					.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema)
					.array(),
				z.lazy(
					() =>
						NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() =>
						NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyNotificationChannelInputEnvelopeSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
	});

export const EnumNotificationChannelTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumNotificationChannelTypeFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.lazy(() => NotificationChannelTypeSchema).optional(),
	});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
	z.strictObject({
		set: z.boolean().optional(),
	});

export const UserUpdateOneRequiredWithoutNotificationChannelsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotificationChannelsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => UserCreateWithoutNotificationChannelsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutNotificationChannelsInputSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => UserCreateOrConnectWithoutNotificationChannelsInputSchema)
			.optional(),
		upsert: z
			.lazy(() => UserUpsertWithoutNotificationChannelsInputSchema)
			.optional(),
		connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() => UserUpdateToOneWithWhereWithoutNotificationChannelsInputSchema,
				),
				z.lazy(() => UserUpdateWithoutNotificationChannelsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutNotificationChannelsInputSchema),
			])
			.optional(),
	});

export const LineChannelUpdateOneWithoutNotificationChannelNestedInputSchema: z.ZodType<Prisma.LineChannelUpdateOneWithoutNotificationChannelNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => LineChannelCreateOrConnectWithoutNotificationChannelInputSchema,
			)
			.optional(),
		upsert: z
			.lazy(() => LineChannelUpsertWithoutNotificationChannelInputSchema)
			.optional(),
		disconnect: z
			.union([z.boolean(), z.lazy(() => LineChannelWhereInputSchema)])
			.optional(),
		delete: z
			.union([z.boolean(), z.lazy(() => LineChannelWhereInputSchema)])
			.optional(),
		connect: z.lazy(() => LineChannelWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						LineChannelUpdateToOneWithWhereWithoutNotificationChannelInputSchema,
				),
				z.lazy(() => LineChannelUpdateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedUpdateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
	});

export const NotificationUpdateManyWithoutNotificationChannelNestedInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithoutNotificationChannelNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
				z
					.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema)
					.array(),
				z.lazy(
					() =>
						NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() =>
						NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						NotificationUpsertWithWhereUniqueWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpsertWithWhereUniqueWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyNotificationChannelInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateWithWhereUniqueWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateWithWhereUniqueWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateManyWithWhereWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateManyWithWhereWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const LineChannelUncheckedUpdateOneWithoutNotificationChannelNestedInputSchema: z.ZodType<Prisma.LineChannelUncheckedUpdateOneWithoutNotificationChannelNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => LineChannelCreateOrConnectWithoutNotificationChannelInputSchema,
			)
			.optional(),
		upsert: z
			.lazy(() => LineChannelUpsertWithoutNotificationChannelInputSchema)
			.optional(),
		disconnect: z
			.union([z.boolean(), z.lazy(() => LineChannelWhereInputSchema)])
			.optional(),
		delete: z
			.union([z.boolean(), z.lazy(() => LineChannelWhereInputSchema)])
			.optional(),
		connect: z.lazy(() => LineChannelWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						LineChannelUpdateToOneWithWhereWithoutNotificationChannelInputSchema,
				),
				z.lazy(() => LineChannelUpdateWithoutNotificationChannelInputSchema),
				z.lazy(
					() => LineChannelUncheckedUpdateWithoutNotificationChannelInputSchema,
				),
			])
			.optional(),
	});

export const NotificationUncheckedUpdateManyWithoutNotificationChannelNestedInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutNotificationChannelNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
				z
					.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema)
					.array(),
				z.lazy(
					() =>
						NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(
					() =>
						NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationCreateOrConnectWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(
					() =>
						NotificationUpsertWithWhereUniqueWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpsertWithWhereUniqueWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => NotificationCreateManyNotificationChannelInputEnvelopeSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => NotificationWhereUniqueInputSchema),
				z.lazy(() => NotificationWhereUniqueInputSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateWithWhereUniqueWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateWithWhereUniqueWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(
					() =>
						NotificationUpdateManyWithWhereWithoutNotificationChannelInputSchema,
				),
				z
					.lazy(
						() =>
							NotificationUpdateManyWithWhereWithoutNotificationChannelInputSchema,
					)
					.array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
	});

export const NotificationChannelCreateNestedOneWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelCreateNestedOneWithoutLineChannelInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutLineChannelInputSchema),
				z.lazy(
					() => NotificationChannelUncheckedCreateWithoutLineChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => NotificationChannelCreateOrConnectWithoutLineChannelInputSchema,
			)
			.optional(),
		connect: z.lazy(() => NotificationChannelWhereUniqueInputSchema).optional(),
	});

export const NotificationChannelUpdateOneRequiredWithoutLineChannelNestedInputSchema: z.ZodType<Prisma.NotificationChannelUpdateOneRequiredWithoutLineChannelNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutLineChannelInputSchema),
				z.lazy(
					() => NotificationChannelUncheckedCreateWithoutLineChannelInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => NotificationChannelCreateOrConnectWithoutLineChannelInputSchema,
			)
			.optional(),
		upsert: z
			.lazy(() => NotificationChannelUpsertWithoutLineChannelInputSchema)
			.optional(),
		connect: z.lazy(() => NotificationChannelWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationChannelUpdateToOneWithWhereWithoutLineChannelInputSchema,
				),
				z.lazy(() => NotificationChannelUpdateWithoutLineChannelInputSchema),
				z.lazy(
					() => NotificationChannelUncheckedUpdateWithoutLineChannelInputSchema,
				),
			])
			.optional(),
	});

export const NotificationChannelCreateNestedOneWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelCreateNestedOneWithoutNotificationsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutNotificationsInputSchema),
				z.lazy(
					() =>
						NotificationChannelUncheckedCreateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => NotificationChannelCreateOrConnectWithoutNotificationsInputSchema,
			)
			.optional(),
		connect: z.lazy(() => NotificationChannelWhereUniqueInputSchema).optional(),
	});

export const VulnerabilityCreateNestedOneWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityCreateNestedOneWithoutNotificationsInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutNotificationsInputSchema),
				z.lazy(
					() => VulnerabilityUncheckedCreateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => VulnerabilityCreateOrConnectWithoutNotificationsInputSchema)
			.optional(),
		connect: z.lazy(() => VulnerabilityWhereUniqueInputSchema).optional(),
	});

export const NotificationChannelUpdateOneRequiredWithoutNotificationsNestedInputSchema: z.ZodType<Prisma.NotificationChannelUpdateOneRequiredWithoutNotificationsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => NotificationChannelCreateWithoutNotificationsInputSchema),
				z.lazy(
					() =>
						NotificationChannelUncheckedCreateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(
				() => NotificationChannelCreateOrConnectWithoutNotificationsInputSchema,
			)
			.optional(),
		upsert: z
			.lazy(() => NotificationChannelUpsertWithoutNotificationsInputSchema)
			.optional(),
		connect: z.lazy(() => NotificationChannelWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						NotificationChannelUpdateToOneWithWhereWithoutNotificationsInputSchema,
				),
				z.lazy(() => NotificationChannelUpdateWithoutNotificationsInputSchema),
				z.lazy(
					() =>
						NotificationChannelUncheckedUpdateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
	});

export const VulnerabilityUpdateOneRequiredWithoutNotificationsNestedInputSchema: z.ZodType<Prisma.VulnerabilityUpdateOneRequiredWithoutNotificationsNestedInput> =
	z.strictObject({
		create: z
			.union([
				z.lazy(() => VulnerabilityCreateWithoutNotificationsInputSchema),
				z.lazy(
					() => VulnerabilityUncheckedCreateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => VulnerabilityCreateOrConnectWithoutNotificationsInputSchema)
			.optional(),
		upsert: z
			.lazy(() => VulnerabilityUpsertWithoutNotificationsInputSchema)
			.optional(),
		connect: z.lazy(() => VulnerabilityWhereUniqueInputSchema).optional(),
		update: z
			.union([
				z.lazy(
					() =>
						VulnerabilityUpdateToOneWithWhereWithoutNotificationsInputSchema,
				),
				z.lazy(() => VulnerabilityUpdateWithoutNotificationsInputSchema),
				z.lazy(
					() => VulnerabilityUncheckedUpdateWithoutNotificationsInputSchema,
				),
			])
			.optional(),
	});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringFilterSchema)])
			.optional(),
	});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
			.optional(),
	});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> =
	z.strictObject({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
	});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	});

export const NestedEnumSeverityFilterSchema: z.ZodType<Prisma.NestedEnumSeverityFilter> =
	z.strictObject({
		equals: z.lazy(() => SeveritySchema).optional(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityFilterSchema),
			])
			.optional(),
	});

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> =
	z.strictObject({
		equals: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		in: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		notIn: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		lt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		lte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		not: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => NestedDecimalFilterSchema),
			])
			.optional(),
	});

export const NestedEnumSeverityWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSeverityWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => SeveritySchema).optional(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumSeverityFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumSeverityFilterSchema).optional(),
	});

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> =
	z.strictObject({
		equals: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		in: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		notIn: z
			.union([
				z.number().array(),
				z.string().array(),
				z.instanceof(Decimal).array(),
				z.instanceof(Prisma.Decimal).array(),
				DecimalJsLikeSchema.array(),
			])
			.refine(
				(v) =>
					Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),
				{ message: "Must be a Decimal" },
			)
			.optional(),
		lt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		lte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gt: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		gte: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		not: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => NestedDecimalWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_min: z.lazy(() => NestedDecimalFilterSchema).optional(),
		_max: z.lazy(() => NestedDecimalFilterSchema).optional(),
	});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> =
	z.strictObject({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_avg: z.lazy(() => NestedFloatFilterSchema).optional(),
		_sum: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedIntFilterSchema).optional(),
		_max: z.lazy(() => NestedIntFilterSchema).optional(),
	});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> =
	z.strictObject({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedFloatFilterSchema)])
			.optional(),
	});

export const NestedEnumSeverityNullableFilterSchema: z.ZodType<Prisma.NestedEnumSeverityNullableFilter> =
	z.strictObject({
		equals: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityNullableFilterSchema),
			])
			.optional()
			.nullable(),
	});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeNullableFilterSchema),
			])
			.optional()
			.nullable(),
	});

export const NestedEnumSeverityNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSeverityNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		in: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		notIn: z
			.lazy(() => SeveritySchema)
			.array()
			.optional()
			.nullable(),
		not: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NestedEnumSeverityNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumSeverityNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumSeverityNullableFilterSchema).optional(),
	});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> =
	z.strictObject({
		equals: z.number().optional().nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
			.optional()
			.nullable(),
	});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([
				z.string(),
				z.lazy(() => NestedStringNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
	});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
	z.strictObject({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([
				z.coerce.date(),
				z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
			])
			.optional()
			.nullable(),
		_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
	});

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> =
	z.strictObject({
		equals: InputJsonValueSchema.optional(),
		path: z.string().array().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		string_contains: z.string().optional(),
		string_starts_with: z.string().optional(),
		string_ends_with: z.string().optional(),
		array_starts_with: InputJsonValueSchema.optional().nullable(),
		array_ends_with: InputJsonValueSchema.optional().nullable(),
		array_contains: InputJsonValueSchema.optional().nullable(),
		lt: InputJsonValueSchema.optional(),
		lte: InputJsonValueSchema.optional(),
		gt: InputJsonValueSchema.optional(),
		gte: InputJsonValueSchema.optional(),
		not: InputJsonValueSchema.optional(),
	});

export const NestedEnumBatchTriggerTypeFilterSchema: z.ZodType<Prisma.NestedEnumBatchTriggerTypeFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchTriggerTypeSchema).optional(),
		in: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema),
			])
			.optional(),
	});

export const NestedEnumBatchStatusFilterSchema: z.ZodType<Prisma.NestedEnumBatchStatusFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchStatusSchema).optional(),
		in: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => NestedEnumBatchStatusFilterSchema),
			])
			.optional(),
	});

export const NestedEnumBatchTriggerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBatchTriggerTypeWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchTriggerTypeSchema).optional(),
		in: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchTriggerTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => NestedEnumBatchTriggerTypeWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumBatchTriggerTypeFilterSchema).optional(),
	});

export const NestedEnumBatchStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBatchStatusWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => BatchStatusSchema).optional(),
		in: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BatchStatusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => NestedEnumBatchStatusWithAggregatesFilterSchema),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
		_max: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
	});

export const NestedEnumNotificationChannelTypeFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelTypeFilter> =
	z.strictObject({
		equals: z.lazy(() => NotificationChannelTypeSchema).optional(),
		in: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(() => NestedEnumNotificationChannelTypeFilterSchema),
			])
			.optional(),
	});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> =
	z.strictObject({
		equals: z.boolean().optional(),
		not: z
			.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)])
			.optional(),
	});

export const NestedEnumNotificationChannelTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumNotificationChannelTypeWithAggregatesFilter> =
	z.strictObject({
		equals: z.lazy(() => NotificationChannelTypeSchema).optional(),
		in: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => NotificationChannelTypeSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => NestedEnumNotificationChannelTypeWithAggregatesFilterSchema,
				),
			])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z
			.lazy(() => NestedEnumNotificationChannelTypeFilterSchema)
			.optional(),
		_max: z
			.lazy(() => NestedEnumNotificationChannelTypeFilterSchema)
			.optional(),
	});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
	z.strictObject({
		equals: z.boolean().optional(),
		not: z
			.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedBoolFilterSchema).optional(),
		_max: z.lazy(() => NestedBoolFilterSchema).optional(),
	});

export const VulnerabilityConfigCreateWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateWithoutUserInput> =
	z.strictObject({
		id: z.string().optional(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		ecosystem: z.lazy(
			() => EcosystemCreateNestedOneWithoutVulnerabilityConfigsInputSchema,
		),
	});

export const VulnerabilityConfigUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.string().optional(),
		ecosystemId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
			z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const VulnerabilityConfigCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => VulnerabilityConfigCreateManyUserInputSchema),
			z.lazy(() => VulnerabilityConfigCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const BatchCreateWithoutUserInputSchema: z.ZodType<Prisma.BatchCreateWithoutUserInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityCreateNestedManyWithoutBatchInputSchema)
			.optional(),
	});

export const BatchUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUncheckedCreateNestedManyWithoutBatchInputSchema)
			.optional(),
	});

export const BatchCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => BatchWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => BatchCreateWithoutUserInputSchema),
			z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const BatchCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.BatchCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => BatchCreateManyUserInputSchema),
			z.lazy(() => BatchCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const NotificationChannelCreateWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelCreateWithoutUserInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		lineChannel: z
			.lazy(
				() => LineChannelCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() => NotificationCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedCreateWithoutUserInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelCreateOrConnectWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
			z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const NotificationChannelCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.NotificationChannelCreateManyUserInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => NotificationChannelCreateManyUserInputSchema),
			z.lazy(() => NotificationChannelCreateManyUserInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => VulnerabilityConfigUpdateWithoutUserInputSchema),
			z.lazy(() => VulnerabilityConfigUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => VulnerabilityConfigCreateWithoutUserInputSchema),
			z.lazy(() => VulnerabilityConfigUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityConfigUpdateWithoutUserInputSchema),
			z.lazy(() => VulnerabilityConfigUncheckedUpdateWithoutUserInputSchema),
		]),
	});

export const VulnerabilityConfigUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityConfigUpdateManyMutationInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedUpdateManyWithoutUserInputSchema,
			),
		]),
	});

export const VulnerabilityConfigScalarWhereInputSchema: z.ZodType<Prisma.VulnerabilityConfigScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityConfigScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
				z.lazy(() => VulnerabilityConfigScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ecosystemId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => EnumSeverityFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z.lazy(() => DecimalFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		publishedLookbackDays: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		maxFetchCount: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		publishedOrderBy: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
	});

export const BatchUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BatchUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => BatchWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => BatchUpdateWithoutUserInputSchema),
			z.lazy(() => BatchUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => BatchCreateWithoutUserInputSchema),
			z.lazy(() => BatchUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const BatchUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.BatchUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => BatchWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => BatchUpdateWithoutUserInputSchema),
			z.lazy(() => BatchUncheckedUpdateWithoutUserInputSchema),
		]),
	});

export const BatchUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.BatchUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => BatchScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => BatchUpdateManyMutationInputSchema),
			z.lazy(() => BatchUncheckedUpdateManyWithoutUserInputSchema),
		]),
	});

export const BatchScalarWhereInputSchema: z.ZodType<Prisma.BatchScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => BatchScalarWhereInputSchema),
				z.lazy(() => BatchScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => BatchScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => BatchScalarWhereInputSchema),
				z.lazy(() => BatchScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		triggerType: z
			.union([
				z.lazy(() => EnumBatchTriggerTypeFilterSchema),
				z.lazy(() => BatchTriggerTypeSchema),
			])
			.optional(),
		triggeredBy: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		executedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		status: z
			.union([
				z.lazy(() => EnumBatchStatusFilterSchema),
				z.lazy(() => BatchStatusSchema),
			])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
	});

export const NotificationChannelUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUpsertWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutUserInputSchema),
			z.lazy(() => NotificationChannelUncheckedUpdateWithoutUserInputSchema),
		]),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutUserInputSchema),
			z.lazy(() => NotificationChannelUncheckedCreateWithoutUserInputSchema),
		]),
	});

export const NotificationChannelUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUpdateWithWhereUniqueWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutUserInputSchema),
			z.lazy(() => NotificationChannelUncheckedUpdateWithoutUserInputSchema),
		]),
	});

export const NotificationChannelUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUpdateManyWithWhereWithoutUserInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => NotificationChannelUpdateManyMutationInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedUpdateManyWithoutUserInputSchema,
			),
		]),
	});

export const NotificationChannelScalarWhereInputSchema: z.ZodType<Prisma.NotificationChannelScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereInputSchema),
				z.lazy(() => NotificationChannelScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationChannelScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationChannelScalarWhereInputSchema),
				z.lazy(() => NotificationChannelScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		type: z
			.union([
				z.lazy(() => EnumNotificationChannelTypeFilterSchema),
				z.lazy(() => NotificationChannelTypeSchema),
			])
			.optional(),
		maxNotificationLimit: z
			.union([z.lazy(() => IntFilterSchema), z.number()])
			.optional(),
		enabled: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
	});

export const VulnerabilityConfigCreateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateWithoutEcosystemInput> =
	z.strictObject({
		id: z.string().optional(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(
			() => UserCreateNestedOneWithoutVulnerabilityConfigsInputSchema,
		),
	});

export const VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedCreateWithoutEcosystemInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigCreateOrConnectWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateOrConnectWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
			),
		]),
	});

export const VulnerabilityConfigCreateManyEcosystemInputEnvelopeSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyEcosystemInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => VulnerabilityConfigCreateManyEcosystemInputSchema),
			z.lazy(() => VulnerabilityConfigCreateManyEcosystemInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const VulnerabilityCreateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityCreateWithoutEcosystemInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		batch: z.lazy(() => BatchCreateNestedOneWithoutVulnerabilitiesInputSchema),
		notifications: z
			.lazy(() => NotificationCreateNestedManyWithoutVulnerabilityInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedCreateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateWithoutEcosystemInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		batchId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutVulnerabilityInputSchema,
			)
			.optional(),
	});

export const VulnerabilityCreateOrConnectWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityCreateOrConnectWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
		]),
	});

export const VulnerabilityCreateManyEcosystemInputEnvelopeSchema: z.ZodType<Prisma.VulnerabilityCreateManyEcosystemInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => VulnerabilityCreateManyEcosystemInputSchema),
			z.lazy(() => VulnerabilityCreateManyEcosystemInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpsertWithWhereUniqueWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => VulnerabilityConfigUpdateWithoutEcosystemInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedUpdateWithoutEcosystemInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => VulnerabilityConfigCreateWithoutEcosystemInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedCreateWithoutEcosystemInputSchema,
			),
		]),
	});

export const VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateWithWhereUniqueWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityConfigUpdateWithoutEcosystemInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedUpdateWithoutEcosystemInputSchema,
			),
		]),
	});

export const VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyWithWhereWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityConfigScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityConfigUpdateManyMutationInputSchema),
			z.lazy(
				() => VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemInputSchema,
			),
		]),
	});

export const VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUpsertWithWhereUniqueWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutEcosystemInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutEcosystemInputSchema),
		]),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutEcosystemInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutEcosystemInputSchema),
		]),
	});

export const VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUpdateWithWhereUniqueWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutEcosystemInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutEcosystemInputSchema),
		]),
	});

export const VulnerabilityUpdateManyWithWhereWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUpdateManyWithWhereWithoutEcosystemInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityUpdateManyMutationInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateManyWithoutEcosystemInputSchema),
		]),
	});

export const VulnerabilityScalarWhereInputSchema: z.ZodType<Prisma.VulnerabilityScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VulnerabilityScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VulnerabilityScalarWhereInputSchema),
				z.lazy(() => VulnerabilityScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ghsaId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		cveId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		ecosystemId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		batchId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		packageName: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		severity: z
			.union([
				z.lazy(() => EnumSeverityNullableFilterSchema),
				z.lazy(() => SeveritySchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.lazy(() => DecimalFilterSchema),
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
			])
			.optional(),
		summary: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		llmSummary: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		publishedAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z.lazy(() => JsonFilterSchema).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
	});

export const UserCreateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserCreateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		batches: z
			.lazy(() => BatchCreateNestedManyWithoutUserInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelCreateNestedManyWithoutUserInputSchema)
			.optional(),
	});

export const UserUncheckedCreateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		batches: z
			.lazy(() => BatchUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
	});

export const UserCreateOrConnectWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutVulnerabilityConfigsInputSchema),
		]),
	});

export const EcosystemCreateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemCreateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityCreateNestedManyWithoutEcosystemInputSchema)
			.optional(),
	});

export const EcosystemUncheckedCreateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemUncheckedCreateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilities: z
			.lazy(
				() => VulnerabilityUncheckedCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
	});

export const EcosystemCreateOrConnectWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemCreateOrConnectWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		where: z.lazy(() => EcosystemWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => EcosystemCreateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(
				() => EcosystemUncheckedCreateWithoutVulnerabilityConfigsInputSchema,
			),
		]),
	});

export const UserUpsertWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserUpsertWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutVulnerabilityConfigsInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutVulnerabilityConfigsInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	});

export const UserUpdateToOneWithWhereWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutVulnerabilityConfigsInputSchema),
		]),
	});

export const UserUpdateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserUpdateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		batches: z
			.lazy(() => BatchUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelUpdateManyWithoutUserNestedInputSchema)
			.optional(),
	});

export const UserUncheckedUpdateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		batches: z
			.lazy(() => BatchUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
	});

export const EcosystemUpsertWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemUpsertWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => EcosystemUpdateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(
				() => EcosystemUncheckedUpdateWithoutVulnerabilityConfigsInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => EcosystemCreateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(
				() => EcosystemUncheckedCreateWithoutVulnerabilityConfigsInputSchema,
			),
		]),
		where: z.lazy(() => EcosystemWhereInputSchema).optional(),
	});

export const EcosystemUpdateToOneWithWhereWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemUpdateToOneWithWhereWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		where: z.lazy(() => EcosystemWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => EcosystemUpdateWithoutVulnerabilityConfigsInputSchema),
			z.lazy(
				() => EcosystemUncheckedUpdateWithoutVulnerabilityConfigsInputSchema,
			),
		]),
	});

export const EcosystemUpdateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemUpdateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUpdateManyWithoutEcosystemNestedInputSchema)
			.optional(),
	});

export const EcosystemUncheckedUpdateWithoutVulnerabilityConfigsInputSchema: z.ZodType<Prisma.EcosystemUncheckedUpdateWithoutVulnerabilityConfigsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilities: z
			.lazy(
				() => VulnerabilityUncheckedUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
	});

export const EcosystemCreateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemCreateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() => VulnerabilityConfigCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
	});

export const EcosystemUncheckedCreateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemUncheckedCreateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z.string().optional(),
		name: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedCreateNestedManyWithoutEcosystemInputSchema,
			)
			.optional(),
	});

export const EcosystemCreateOrConnectWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemCreateOrConnectWithoutVulnerabilitiesInput> =
	z.strictObject({
		where: z.lazy(() => EcosystemWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => EcosystemCreateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => EcosystemUncheckedCreateWithoutVulnerabilitiesInputSchema),
		]),
	});

export const BatchCreateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchCreateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutBatchesInputSchema).optional(),
	});

export const BatchUncheckedCreateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		triggeredBy: z.string().optional().nullable(),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const BatchCreateOrConnectWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutVulnerabilitiesInput> =
	z.strictObject({
		where: z.lazy(() => BatchWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => BatchCreateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => BatchUncheckedCreateWithoutVulnerabilitiesInputSchema),
		]),
	});

export const NotificationCreateWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationCreateWithoutVulnerabilityInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notificationChannel: z.lazy(
			() => NotificationChannelCreateNestedOneWithoutNotificationsInputSchema,
		),
	});

export const NotificationUncheckedCreateWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateWithoutVulnerabilityInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notificationChannelId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationCreateOrConnectWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationCreateOrConnectWithoutVulnerabilityInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
			z.lazy(() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema),
		]),
	});

export const NotificationCreateManyVulnerabilityInputEnvelopeSchema: z.ZodType<Prisma.NotificationCreateManyVulnerabilityInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => NotificationCreateManyVulnerabilityInputSchema),
			z.lazy(() => NotificationCreateManyVulnerabilityInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const EcosystemUpsertWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemUpsertWithoutVulnerabilitiesInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => EcosystemUpdateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => EcosystemUncheckedUpdateWithoutVulnerabilitiesInputSchema),
		]),
		create: z.union([
			z.lazy(() => EcosystemCreateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => EcosystemUncheckedCreateWithoutVulnerabilitiesInputSchema),
		]),
		where: z.lazy(() => EcosystemWhereInputSchema).optional(),
	});

export const EcosystemUpdateToOneWithWhereWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemUpdateToOneWithWhereWithoutVulnerabilitiesInput> =
	z.strictObject({
		where: z.lazy(() => EcosystemWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => EcosystemUpdateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => EcosystemUncheckedUpdateWithoutVulnerabilitiesInputSchema),
		]),
	});

export const EcosystemUpdateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemUpdateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() => VulnerabilityConfigUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
	});

export const EcosystemUncheckedUpdateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.EcosystemUncheckedUpdateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemNestedInputSchema,
			)
			.optional(),
	});

export const BatchUpsertWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchUpsertWithoutVulnerabilitiesInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => BatchUpdateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => BatchUncheckedUpdateWithoutVulnerabilitiesInputSchema),
		]),
		create: z.union([
			z.lazy(() => BatchCreateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => BatchUncheckedCreateWithoutVulnerabilitiesInputSchema),
		]),
		where: z.lazy(() => BatchWhereInputSchema).optional(),
	});

export const BatchUpdateToOneWithWhereWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchUpdateToOneWithWhereWithoutVulnerabilitiesInput> =
	z.strictObject({
		where: z.lazy(() => BatchWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => BatchUpdateWithoutVulnerabilitiesInputSchema),
			z.lazy(() => BatchUncheckedUpdateWithoutVulnerabilitiesInputSchema),
		]),
	});

export const BatchUpdateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchUpdateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z.lazy(() => UserUpdateOneWithoutBatchesNestedInputSchema).optional(),
	});

export const BatchUncheckedUpdateWithoutVulnerabilitiesInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutVulnerabilitiesInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		triggeredBy: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationUpsertWithWhereUniqueWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutVulnerabilityInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => NotificationUpdateWithoutVulnerabilityInputSchema),
			z.lazy(() => NotificationUncheckedUpdateWithoutVulnerabilityInputSchema),
		]),
		create: z.union([
			z.lazy(() => NotificationCreateWithoutVulnerabilityInputSchema),
			z.lazy(() => NotificationUncheckedCreateWithoutVulnerabilityInputSchema),
		]),
	});

export const NotificationUpdateWithWhereUniqueWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutVulnerabilityInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => NotificationUpdateWithoutVulnerabilityInputSchema),
			z.lazy(() => NotificationUncheckedUpdateWithoutVulnerabilityInputSchema),
		]),
	});

export const NotificationUpdateManyWithWhereWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutVulnerabilityInput> =
	z.strictObject({
		where: z.lazy(() => NotificationScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => NotificationUpdateManyMutationInputSchema),
			z.lazy(
				() => NotificationUncheckedUpdateManyWithoutVulnerabilityInputSchema,
			),
		]),
	});

export const NotificationScalarWhereInputSchema: z.ZodType<Prisma.NotificationScalarWhereInput> =
	z.strictObject({
		AND: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => NotificationScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => NotificationScalarWhereInputSchema),
				z.lazy(() => NotificationScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		notificationChannelId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		vulnerabilityId: z
			.union([z.lazy(() => StringFilterSchema), z.string()])
			.optional(),
		notifiedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
			.optional(),
	});

export const UserCreateWithoutBatchesInputSchema: z.ZodType<Prisma.UserCreateWithoutBatchesInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigCreateNestedManyWithoutUserInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelCreateNestedManyWithoutUserInputSchema)
			.optional(),
	});

export const UserUncheckedCreateWithoutBatchesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBatchesInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
	});

export const UserCreateOrConnectWithoutBatchesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBatchesInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutBatchesInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutBatchesInputSchema),
		]),
	});

export const VulnerabilityCreateWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityCreateWithoutBatchInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		ecosystem: z.lazy(
			() => EcosystemCreateNestedOneWithoutVulnerabilitiesInputSchema,
		),
		notifications: z
			.lazy(() => NotificationCreateNestedManyWithoutVulnerabilityInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedCreateWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateWithoutBatchInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		ecosystemId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutVulnerabilityInputSchema,
			)
			.optional(),
	});

export const VulnerabilityCreateOrConnectWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityCreateOrConnectWithoutBatchInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
		]),
	});

export const VulnerabilityCreateManyBatchInputEnvelopeSchema: z.ZodType<Prisma.VulnerabilityCreateManyBatchInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => VulnerabilityCreateManyBatchInputSchema),
			z.lazy(() => VulnerabilityCreateManyBatchInputSchema).array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const UserUpsertWithoutBatchesInputSchema: z.ZodType<Prisma.UserUpsertWithoutBatchesInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutBatchesInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutBatchesInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutBatchesInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutBatchesInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	});

export const UserUpdateToOneWithWhereWithoutBatchesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBatchesInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutBatchesInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutBatchesInputSchema),
		]),
	});

export const UserUpdateWithoutBatchesInputSchema: z.ZodType<Prisma.UserUpdateWithoutBatchesInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		notificationChannels: z
			.lazy(() => NotificationChannelUpdateManyWithoutUserNestedInputSchema)
			.optional(),
	});

export const UserUncheckedUpdateWithoutBatchesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBatchesInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
		notificationChannels: z
			.lazy(
				() =>
					NotificationChannelUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityUpsertWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUpsertWithWhereUniqueWithoutBatchInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutBatchInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutBatchInputSchema),
		]),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutBatchInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutBatchInputSchema),
		]),
	});

export const VulnerabilityUpdateWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUpdateWithWhereUniqueWithoutBatchInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutBatchInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutBatchInputSchema),
		]),
	});

export const VulnerabilityUpdateManyWithWhereWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUpdateManyWithWhereWithoutBatchInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => VulnerabilityUpdateManyMutationInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateManyWithoutBatchInputSchema),
		]),
	});

export const UserCreateWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserCreateWithoutNotificationChannelsInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigCreateNestedManyWithoutUserInputSchema)
			.optional(),
		batches: z
			.lazy(() => BatchCreateNestedManyWithoutUserInputSchema)
			.optional(),
	});

export const UserUncheckedCreateWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutNotificationChannelsInput> =
	z.strictObject({
		id: z.string().optional(),
		cognitoSub: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedCreateNestedManyWithoutUserInputSchema,
			)
			.optional(),
		batches: z
			.lazy(() => BatchUncheckedCreateNestedManyWithoutUserInputSchema)
			.optional(),
	});

export const UserCreateOrConnectWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutNotificationChannelsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => UserCreateWithoutNotificationChannelsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutNotificationChannelsInputSchema),
		]),
	});

export const LineChannelCreateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelCreateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z.string().optional(),
		lineUserId: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const LineChannelUncheckedCreateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUncheckedCreateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z.string().optional(),
		lineUserId: z.string(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const LineChannelCreateOrConnectWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelCreateOrConnectWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => LineChannelWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const NotificationCreateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationCreateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		vulnerability: z.lazy(
			() => VulnerabilityCreateNestedOneWithoutNotificationsInputSchema,
		),
	});

export const NotificationUncheckedCreateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUncheckedCreateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z.uuid().optional(),
		vulnerabilityId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationCreateOrConnectWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationCreateOrConnectWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const NotificationCreateManyNotificationChannelInputEnvelopeSchema: z.ZodType<Prisma.NotificationCreateManyNotificationChannelInputEnvelope> =
	z.strictObject({
		data: z.union([
			z.lazy(() => NotificationCreateManyNotificationChannelInputSchema),
			z
				.lazy(() => NotificationCreateManyNotificationChannelInputSchema)
				.array(),
		]),
		skipDuplicates: z.boolean().optional(),
	});

export const UserUpsertWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserUpsertWithoutNotificationChannelsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => UserUpdateWithoutNotificationChannelsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutNotificationChannelsInputSchema),
		]),
		create: z.union([
			z.lazy(() => UserCreateWithoutNotificationChannelsInputSchema),
			z.lazy(() => UserUncheckedCreateWithoutNotificationChannelsInputSchema),
		]),
		where: z.lazy(() => UserWhereInputSchema).optional(),
	});

export const UserUpdateToOneWithWhereWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutNotificationChannelsInput> =
	z.strictObject({
		where: z.lazy(() => UserWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => UserUpdateWithoutNotificationChannelsInputSchema),
			z.lazy(() => UserUncheckedUpdateWithoutNotificationChannelsInputSchema),
		]),
	});

export const UserUpdateWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserUpdateWithoutNotificationChannelsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(() => VulnerabilityConfigUpdateManyWithoutUserNestedInputSchema)
			.optional(),
		batches: z
			.lazy(() => BatchUpdateManyWithoutUserNestedInputSchema)
			.optional(),
	});

export const UserUncheckedUpdateWithoutNotificationChannelsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutNotificationChannelsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cognitoSub: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilityConfigs: z
			.lazy(
				() =>
					VulnerabilityConfigUncheckedUpdateManyWithoutUserNestedInputSchema,
			)
			.optional(),
		batches: z
			.lazy(() => BatchUncheckedUpdateManyWithoutUserNestedInputSchema)
			.optional(),
	});

export const LineChannelUpsertWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUpsertWithoutNotificationChannelInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => LineChannelUpdateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => LineChannelUncheckedUpdateWithoutNotificationChannelInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => LineChannelCreateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => LineChannelUncheckedCreateWithoutNotificationChannelInputSchema,
			),
		]),
		where: z.lazy(() => LineChannelWhereInputSchema).optional(),
	});

export const LineChannelUpdateToOneWithWhereWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUpdateToOneWithWhereWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => LineChannelWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => LineChannelUpdateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => LineChannelUncheckedUpdateWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const LineChannelUpdateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUpdateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const LineChannelUncheckedUpdateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.LineChannelUncheckedUpdateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		lineUserId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationUpsertWithWhereUniqueWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		update: z.union([
			z.lazy(() => NotificationUpdateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => NotificationUncheckedUpdateWithoutNotificationChannelInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => NotificationCreateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => NotificationUncheckedCreateWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const NotificationUpdateWithWhereUniqueWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationWhereUniqueInputSchema),
		data: z.union([
			z.lazy(() => NotificationUpdateWithoutNotificationChannelInputSchema),
			z.lazy(
				() => NotificationUncheckedUpdateWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const NotificationUpdateManyWithWhereWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutNotificationChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationScalarWhereInputSchema),
		data: z.union([
			z.lazy(() => NotificationUpdateManyMutationInputSchema),
			z.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutNotificationChannelInputSchema,
			),
		]),
	});

export const NotificationChannelCreateWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelCreateWithoutLineChannelInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(
			() => UserCreateNestedOneWithoutNotificationChannelsInputSchema,
		),
		notifications: z
			.lazy(
				() => NotificationCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedCreateWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedCreateWithoutLineChannelInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedCreateNestedManyWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelCreateOrConnectWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelCreateOrConnectWithoutLineChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutLineChannelInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedCreateWithoutLineChannelInputSchema,
			),
		]),
	});

export const NotificationChannelUpsertWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelUpsertWithoutLineChannelInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutLineChannelInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedUpdateWithoutLineChannelInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutLineChannelInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedCreateWithoutLineChannelInputSchema,
			),
		]),
		where: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
	});

export const NotificationChannelUpdateToOneWithWhereWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelUpdateToOneWithWhereWithoutLineChannelInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutLineChannelInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedUpdateWithoutLineChannelInputSchema,
			),
		]),
	});

export const NotificationChannelUpdateWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelUpdateWithoutLineChannelInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z
			.lazy(
				() => UserUpdateOneRequiredWithoutNotificationChannelsNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() => NotificationUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedUpdateWithoutLineChannelInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateWithoutLineChannelInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelCreateWithoutNotificationsInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(
			() => UserCreateNestedOneWithoutNotificationChannelsInputSchema,
		),
		lineChannel: z
			.lazy(
				() => LineChannelCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedCreateWithoutNotificationsInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedCreateNestedOneWithoutNotificationChannelInputSchema,
			)
			.optional(),
	});

export const NotificationChannelCreateOrConnectWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelCreateOrConnectWithoutNotificationsInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutNotificationsInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedCreateWithoutNotificationsInputSchema,
			),
		]),
	});

export const VulnerabilityCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityCreateWithoutNotificationsInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		ecosystem: z.lazy(
			() => EcosystemCreateNestedOneWithoutVulnerabilitiesInputSchema,
		),
		batch: z.lazy(() => BatchCreateNestedOneWithoutVulnerabilitiesInputSchema),
	});

export const VulnerabilityUncheckedCreateWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedCreateWithoutNotificationsInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		ecosystemId: z.string(),
		batchId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityCreateOrConnectWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityCreateOrConnectWithoutNotificationsInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereUniqueInputSchema),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutNotificationsInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutNotificationsInputSchema),
		]),
	});

export const NotificationChannelUpsertWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelUpsertWithoutNotificationsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutNotificationsInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedUpdateWithoutNotificationsInputSchema,
			),
		]),
		create: z.union([
			z.lazy(() => NotificationChannelCreateWithoutNotificationsInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedCreateWithoutNotificationsInputSchema,
			),
		]),
		where: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
	});

export const NotificationChannelUpdateToOneWithWhereWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelUpdateToOneWithWhereWithoutNotificationsInput> =
	z.strictObject({
		where: z.lazy(() => NotificationChannelWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => NotificationChannelUpdateWithoutNotificationsInputSchema),
			z.lazy(
				() => NotificationChannelUncheckedUpdateWithoutNotificationsInputSchema,
			),
		]),
	});

export const NotificationChannelUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelUpdateWithoutNotificationsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z
			.lazy(
				() => UserUpdateOneRequiredWithoutNotificationChannelsNestedInputSchema,
			)
			.optional(),
		lineChannel: z
			.lazy(
				() => LineChannelUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateWithoutNotificationsInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityUpsertWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityUpsertWithoutNotificationsInput> =
	z.strictObject({
		update: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutNotificationsInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutNotificationsInputSchema),
		]),
		create: z.union([
			z.lazy(() => VulnerabilityCreateWithoutNotificationsInputSchema),
			z.lazy(() => VulnerabilityUncheckedCreateWithoutNotificationsInputSchema),
		]),
		where: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
	});

export const VulnerabilityUpdateToOneWithWhereWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityUpdateToOneWithWhereWithoutNotificationsInput> =
	z.strictObject({
		where: z.lazy(() => VulnerabilityWhereInputSchema).optional(),
		data: z.union([
			z.lazy(() => VulnerabilityUpdateWithoutNotificationsInputSchema),
			z.lazy(() => VulnerabilityUncheckedUpdateWithoutNotificationsInputSchema),
		]),
	});

export const VulnerabilityUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityUpdateWithoutNotificationsInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		ecosystem: z
			.lazy(
				() => EcosystemUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema,
			)
			.optional(),
		batch: z
			.lazy(() => BatchUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateWithoutNotificationsInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateWithoutNotificationsInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		batchId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigCreateManyUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyUserInput> =
	z.strictObject({
		id: z.string().optional(),
		ecosystemId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const BatchCreateManyUserInputSchema: z.ZodType<Prisma.BatchCreateManyUserInput> =
	z.strictObject({
		id: z.uuid().optional(),
		triggerType: z.lazy(() => BatchTriggerTypeSchema),
		executedAt: z.coerce.date(),
		status: z.lazy(() => BatchStatusSchema),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationChannelCreateManyUserInputSchema: z.ZodType<Prisma.NotificationChannelCreateManyUserInput> =
	z.strictObject({
		id: z.string().optional(),
		type: z.lazy(() => NotificationChannelTypeSchema),
		maxNotificationLimit: z.number().int().optional(),
		enabled: z.boolean().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigUpdateWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		ecosystem: z
			.lazy(
				() =>
					EcosystemUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const BatchUpdateWithoutUserInputSchema: z.ZodType<Prisma.BatchUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUpdateManyWithoutBatchNestedInputSchema)
			.optional(),
	});

export const BatchUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerabilities: z
			.lazy(() => VulnerabilityUncheckedUpdateManyWithoutBatchNestedInputSchema)
			.optional(),
	});

export const BatchUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		triggerType: z
			.union([
				z.lazy(() => BatchTriggerTypeSchema),
				z.lazy(() => EnumBatchTriggerTypeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		executedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		status: z
			.union([
				z.lazy(() => BatchStatusSchema),
				z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationChannelUpdateWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		lineChannel: z
			.lazy(
				() => LineChannelUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() => NotificationUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		lineChannel: z
			.lazy(
				() =>
					LineChannelUncheckedUpdateOneWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutNotificationChannelNestedInputSchema,
			)
			.optional(),
	});

export const NotificationChannelUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.NotificationChannelUncheckedUpdateManyWithoutUserInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		type: z
			.union([
				z.lazy(() => NotificationChannelTypeSchema),
				z.lazy(
					() => EnumNotificationChannelTypeFieldUpdateOperationsInputSchema,
				),
			])
			.optional(),
		maxNotificationLimit: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		enabled: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigCreateManyEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyEcosystemInput> =
	z.strictObject({
		id: z.string().optional(),
		userId: z.string(),
		minSeverity: z.lazy(() => SeveritySchema).optional(),
		minCvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" })
			.optional(),
		publishedLookbackDays: z.number().int().optional(),
		maxFetchCount: z.number().int().optional(),
		publishedOrderBy: z.string().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityCreateManyEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityCreateManyEcosystemInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		batchId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityConfigUpdateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		user: z
			.lazy(
				() => UserUpdateOneRequiredWithoutVulnerabilityConfigsNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityConfigUncheckedUpdateManyWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		minSeverity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => EnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional(),
		minCvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedLookbackDays: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		maxFetchCount: z
			.union([
				z.number().int(),
				z.lazy(() => IntFieldUpdateOperationsInputSchema),
			])
			.optional(),
		publishedOrderBy: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityUpdateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUpdateWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		batch: z
			.lazy(() => BatchUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema)
			.optional(),
		notifications: z
			.lazy(() => NotificationUpdateManyWithoutVulnerabilityNestedInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		batchId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutVulnerabilityNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateManyWithoutEcosystemInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateManyWithoutEcosystemInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		batchId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationCreateManyVulnerabilityInputSchema: z.ZodType<Prisma.NotificationCreateManyVulnerabilityInput> =
	z.strictObject({
		id: z.uuid().optional(),
		notificationChannelId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationUpdateWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUpdateWithoutVulnerabilityInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notificationChannel: z
			.lazy(
				() =>
					NotificationChannelUpdateOneRequiredWithoutNotificationsNestedInputSchema,
			)
			.optional(),
	});

export const NotificationUncheckedUpdateWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateWithoutVulnerabilityInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationUncheckedUpdateManyWithoutVulnerabilityInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutVulnerabilityInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notificationChannelId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const VulnerabilityCreateManyBatchInputSchema: z.ZodType<Prisma.VulnerabilityCreateManyBatchInput> =
	z.strictObject({
		id: z.uuid().optional(),
		ghsaId: z.string(),
		cveId: z.string(),
		ecosystemId: z.string(),
		packageName: z.string(),
		severity: z
			.lazy(() => SeveritySchema)
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z.number(),
				z.string(),
				z.instanceof(Decimal),
				z.instanceof(Prisma.Decimal),
				DecimalJsLikeSchema,
			])
			.refine((v) => isValidDecimalInput(v), { message: "Must be a Decimal" }),
		summary: z.string().optional().nullable(),
		llmSummary: z.string().optional().nullable(),
		advisoryUrl: z.string().optional().nullable(),
		publishedAt: z.coerce.date().optional().nullable(),
		githubAdvisoryResponse: z.union([
			z.lazy(() => JsonNullValueInputSchema),
			InputJsonValueSchema,
		]),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const VulnerabilityUpdateWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUpdateWithoutBatchInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		ecosystem: z
			.lazy(
				() => EcosystemUpdateOneRequiredWithoutVulnerabilitiesNestedInputSchema,
			)
			.optional(),
		notifications: z
			.lazy(() => NotificationUpdateManyWithoutVulnerabilityNestedInputSchema)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateWithoutBatchInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		notifications: z
			.lazy(
				() =>
					NotificationUncheckedUpdateManyWithoutVulnerabilityNestedInputSchema,
			)
			.optional(),
	});

export const VulnerabilityUncheckedUpdateManyWithoutBatchInputSchema: z.ZodType<Prisma.VulnerabilityUncheckedUpdateManyWithoutBatchInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ghsaId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		cveId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		ecosystemId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		packageName: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		severity: z
			.union([
				z.lazy(() => SeveritySchema),
				z.lazy(() => NullableEnumSeverityFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		cvssScore: z
			.union([
				z
					.union([
						z.number(),
						z.string(),
						z.instanceof(Decimal),
						z.instanceof(Prisma.Decimal),
						DecimalJsLikeSchema,
					])
					.refine((v) => isValidDecimalInput(v), {
						message: "Must be a Decimal",
					}),
				z.lazy(() => DecimalFieldUpdateOperationsInputSchema),
			])
			.optional(),
		summary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		llmSummary: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		advisoryUrl: z
			.union([
				z.string(),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		publishedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		githubAdvisoryResponse: z
			.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationCreateManyNotificationChannelInputSchema: z.ZodType<Prisma.NotificationCreateManyNotificationChannelInput> =
	z.strictObject({
		id: z.uuid().optional(),
		vulnerabilityId: z.string(),
		notifiedAt: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	});

export const NotificationUpdateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUpdateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		vulnerability: z
			.lazy(
				() =>
					VulnerabilityUpdateOneRequiredWithoutNotificationsNestedInputSchema,
			)
			.optional(),
	});

export const NotificationUncheckedUpdateWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateWithoutNotificationChannelInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		vulnerabilityId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

export const NotificationUncheckedUpdateManyWithoutNotificationChannelInputSchema: z.ZodType<Prisma.NotificationUncheckedUpdateManyWithoutNotificationChannelInput> =
	z.strictObject({
		id: z
			.union([z.uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		vulnerabilityId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		notifiedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
		updatedAt: z
			.union([
				z.coerce.date(),
				z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
			])
			.optional(),
	});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([
				UserOrderByWithRelationInputSchema.array(),
				UserOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> =
	z
		.object({
			select: UserSelectSchema.optional(),
			include: UserIncludeSchema.optional(),
			where: UserWhereInputSchema.optional(),
			orderBy: z
				.union([
					UserOrderByWithRelationInputSchema.array(),
					UserOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: UserWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([
				UserOrderByWithRelationInputSchema.array(),
				UserOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([
				UserOrderByWithRelationInputSchema.array(),
				UserOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([
				UserOrderByWithAggregationInputSchema.array(),
				UserOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: UserScalarFieldEnumSchema.array(),
		having: UserScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> =
	z
		.object({
			select: UserSelectSchema.optional(),
			include: UserIncludeSchema.optional(),
			where: UserWhereUniqueInputSchema,
		})
		.strict();

export const EcosystemFindFirstArgsSchema: z.ZodType<Prisma.EcosystemFindFirstArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereInputSchema.optional(),
			orderBy: z
				.union([
					EcosystemOrderByWithRelationInputSchema.array(),
					EcosystemOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: EcosystemWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					EcosystemScalarFieldEnumSchema,
					EcosystemScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const EcosystemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EcosystemFindFirstOrThrowArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereInputSchema.optional(),
			orderBy: z
				.union([
					EcosystemOrderByWithRelationInputSchema.array(),
					EcosystemOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: EcosystemWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					EcosystemScalarFieldEnumSchema,
					EcosystemScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const EcosystemFindManyArgsSchema: z.ZodType<Prisma.EcosystemFindManyArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereInputSchema.optional(),
			orderBy: z
				.union([
					EcosystemOrderByWithRelationInputSchema.array(),
					EcosystemOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: EcosystemWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					EcosystemScalarFieldEnumSchema,
					EcosystemScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const EcosystemAggregateArgsSchema: z.ZodType<Prisma.EcosystemAggregateArgs> =
	z
		.object({
			where: EcosystemWhereInputSchema.optional(),
			orderBy: z
				.union([
					EcosystemOrderByWithRelationInputSchema.array(),
					EcosystemOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: EcosystemWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const EcosystemGroupByArgsSchema: z.ZodType<Prisma.EcosystemGroupByArgs> =
	z
		.object({
			where: EcosystemWhereInputSchema.optional(),
			orderBy: z
				.union([
					EcosystemOrderByWithAggregationInputSchema.array(),
					EcosystemOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: EcosystemScalarFieldEnumSchema.array(),
			having: EcosystemScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const EcosystemFindUniqueArgsSchema: z.ZodType<Prisma.EcosystemFindUniqueArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereUniqueInputSchema,
		})
		.strict();

export const EcosystemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EcosystemFindUniqueOrThrowArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityConfigFindFirstArgsSchema: z.ZodType<Prisma.VulnerabilityConfigFindFirstArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityConfigOrderByWithRelationInputSchema.array(),
					VulnerabilityConfigOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityConfigWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityConfigScalarFieldEnumSchema,
					VulnerabilityConfigScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityConfigFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VulnerabilityConfigFindFirstOrThrowArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityConfigOrderByWithRelationInputSchema.array(),
					VulnerabilityConfigOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityConfigWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityConfigScalarFieldEnumSchema,
					VulnerabilityConfigScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityConfigFindManyArgsSchema: z.ZodType<Prisma.VulnerabilityConfigFindManyArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityConfigOrderByWithRelationInputSchema.array(),
					VulnerabilityConfigOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityConfigWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityConfigScalarFieldEnumSchema,
					VulnerabilityConfigScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityConfigAggregateArgsSchema: z.ZodType<Prisma.VulnerabilityConfigAggregateArgs> =
	z
		.object({
			where: VulnerabilityConfigWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityConfigOrderByWithRelationInputSchema.array(),
					VulnerabilityConfigOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityConfigWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const VulnerabilityConfigGroupByArgsSchema: z.ZodType<Prisma.VulnerabilityConfigGroupByArgs> =
	z
		.object({
			where: VulnerabilityConfigWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityConfigOrderByWithAggregationInputSchema.array(),
					VulnerabilityConfigOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: VulnerabilityConfigScalarFieldEnumSchema.array(),
			having:
				VulnerabilityConfigScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const VulnerabilityConfigFindUniqueArgsSchema: z.ZodType<Prisma.VulnerabilityConfigFindUniqueArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityConfigFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VulnerabilityConfigFindUniqueOrThrowArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityFindFirstArgsSchema: z.ZodType<Prisma.VulnerabilityFindFirstArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityOrderByWithRelationInputSchema.array(),
					VulnerabilityOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityScalarFieldEnumSchema,
					VulnerabilityScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VulnerabilityFindFirstOrThrowArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityOrderByWithRelationInputSchema.array(),
					VulnerabilityOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityScalarFieldEnumSchema,
					VulnerabilityScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityFindManyArgsSchema: z.ZodType<Prisma.VulnerabilityFindManyArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityOrderByWithRelationInputSchema.array(),
					VulnerabilityOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					VulnerabilityScalarFieldEnumSchema,
					VulnerabilityScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const VulnerabilityAggregateArgsSchema: z.ZodType<Prisma.VulnerabilityAggregateArgs> =
	z
		.object({
			where: VulnerabilityWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityOrderByWithRelationInputSchema.array(),
					VulnerabilityOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VulnerabilityWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const VulnerabilityGroupByArgsSchema: z.ZodType<Prisma.VulnerabilityGroupByArgs> =
	z
		.object({
			where: VulnerabilityWhereInputSchema.optional(),
			orderBy: z
				.union([
					VulnerabilityOrderByWithAggregationInputSchema.array(),
					VulnerabilityOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: VulnerabilityScalarFieldEnumSchema.array(),
			having: VulnerabilityScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const VulnerabilityFindUniqueArgsSchema: z.ZodType<Prisma.VulnerabilityFindUniqueArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VulnerabilityFindUniqueOrThrowArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereUniqueInputSchema,
		})
		.strict();

export const BatchFindFirstArgsSchema: z.ZodType<Prisma.BatchFindFirstArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		where: BatchWhereInputSchema.optional(),
		orderBy: z
			.union([
				BatchOrderByWithRelationInputSchema.array(),
				BatchOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: BatchWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const BatchFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BatchFindFirstOrThrowArgs> =
	z
		.object({
			select: BatchSelectSchema.optional(),
			include: BatchIncludeSchema.optional(),
			where: BatchWhereInputSchema.optional(),
			orderBy: z
				.union([
					BatchOrderByWithRelationInputSchema.array(),
					BatchOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: BatchWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict();

export const BatchFindManyArgsSchema: z.ZodType<Prisma.BatchFindManyArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		where: BatchWhereInputSchema.optional(),
		orderBy: z
			.union([
				BatchOrderByWithRelationInputSchema.array(),
				BatchOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: BatchWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const BatchAggregateArgsSchema: z.ZodType<Prisma.BatchAggregateArgs> = z
	.object({
		where: BatchWhereInputSchema.optional(),
		orderBy: z
			.union([
				BatchOrderByWithRelationInputSchema.array(),
				BatchOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: BatchWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const BatchGroupByArgsSchema: z.ZodType<Prisma.BatchGroupByArgs> = z
	.object({
		where: BatchWhereInputSchema.optional(),
		orderBy: z
			.union([
				BatchOrderByWithAggregationInputSchema.array(),
				BatchOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: BatchScalarFieldEnumSchema.array(),
		having: BatchScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const BatchFindUniqueArgsSchema: z.ZodType<Prisma.BatchFindUniqueArgs> =
	z
		.object({
			select: BatchSelectSchema.optional(),
			include: BatchIncludeSchema.optional(),
			where: BatchWhereUniqueInputSchema,
		})
		.strict();

export const BatchFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BatchFindUniqueOrThrowArgs> =
	z
		.object({
			select: BatchSelectSchema.optional(),
			include: BatchIncludeSchema.optional(),
			where: BatchWhereUniqueInputSchema,
		})
		.strict();

export const NotificationChannelFindFirstArgsSchema: z.ZodType<Prisma.NotificationChannelFindFirstArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationChannelOrderByWithRelationInputSchema.array(),
					NotificationChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationChannelScalarFieldEnumSchema,
					NotificationChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationChannelFindFirstOrThrowArgsSchema: z.ZodType<Prisma.NotificationChannelFindFirstOrThrowArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationChannelOrderByWithRelationInputSchema.array(),
					NotificationChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationChannelScalarFieldEnumSchema,
					NotificationChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationChannelFindManyArgsSchema: z.ZodType<Prisma.NotificationChannelFindManyArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationChannelOrderByWithRelationInputSchema.array(),
					NotificationChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationChannelScalarFieldEnumSchema,
					NotificationChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationChannelAggregateArgsSchema: z.ZodType<Prisma.NotificationChannelAggregateArgs> =
	z
		.object({
			where: NotificationChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationChannelOrderByWithRelationInputSchema.array(),
					NotificationChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const NotificationChannelGroupByArgsSchema: z.ZodType<Prisma.NotificationChannelGroupByArgs> =
	z
		.object({
			where: NotificationChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationChannelOrderByWithAggregationInputSchema.array(),
					NotificationChannelOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: NotificationChannelScalarFieldEnumSchema.array(),
			having:
				NotificationChannelScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const NotificationChannelFindUniqueArgsSchema: z.ZodType<Prisma.NotificationChannelFindUniqueArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereUniqueInputSchema,
		})
		.strict();

export const NotificationChannelFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.NotificationChannelFindUniqueOrThrowArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereUniqueInputSchema,
		})
		.strict();

export const LineChannelFindFirstArgsSchema: z.ZodType<Prisma.LineChannelFindFirstArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					LineChannelOrderByWithRelationInputSchema.array(),
					LineChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: LineChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					LineChannelScalarFieldEnumSchema,
					LineChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const LineChannelFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LineChannelFindFirstOrThrowArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					LineChannelOrderByWithRelationInputSchema.array(),
					LineChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: LineChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					LineChannelScalarFieldEnumSchema,
					LineChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const LineChannelFindManyArgsSchema: z.ZodType<Prisma.LineChannelFindManyArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					LineChannelOrderByWithRelationInputSchema.array(),
					LineChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: LineChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					LineChannelScalarFieldEnumSchema,
					LineChannelScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const LineChannelAggregateArgsSchema: z.ZodType<Prisma.LineChannelAggregateArgs> =
	z
		.object({
			where: LineChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					LineChannelOrderByWithRelationInputSchema.array(),
					LineChannelOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: LineChannelWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const LineChannelGroupByArgsSchema: z.ZodType<Prisma.LineChannelGroupByArgs> =
	z
		.object({
			where: LineChannelWhereInputSchema.optional(),
			orderBy: z
				.union([
					LineChannelOrderByWithAggregationInputSchema.array(),
					LineChannelOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: LineChannelScalarFieldEnumSchema.array(),
			having: LineChannelScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const LineChannelFindUniqueArgsSchema: z.ZodType<Prisma.LineChannelFindUniqueArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereUniqueInputSchema,
		})
		.strict();

export const LineChannelFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LineChannelFindUniqueOrThrowArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereUniqueInputSchema,
		})
		.strict();

export const NotificationFindFirstArgsSchema: z.ZodType<Prisma.NotificationFindFirstArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationOrderByWithRelationInputSchema.array(),
					NotificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationScalarFieldEnumSchema,
					NotificationScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.NotificationFindFirstOrThrowArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationOrderByWithRelationInputSchema.array(),
					NotificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationScalarFieldEnumSchema,
					NotificationScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationFindManyArgsSchema: z.ZodType<Prisma.NotificationFindManyArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationOrderByWithRelationInputSchema.array(),
					NotificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([
					NotificationScalarFieldEnumSchema,
					NotificationScalarFieldEnumSchema.array(),
				])
				.optional(),
		})
		.strict();

export const NotificationAggregateArgsSchema: z.ZodType<Prisma.NotificationAggregateArgs> =
	z
		.object({
			where: NotificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationOrderByWithRelationInputSchema.array(),
					NotificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: NotificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const NotificationGroupByArgsSchema: z.ZodType<Prisma.NotificationGroupByArgs> =
	z
		.object({
			where: NotificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					NotificationOrderByWithAggregationInputSchema.array(),
					NotificationOrderByWithAggregationInputSchema,
				])
				.optional(),
			by: NotificationScalarFieldEnumSchema.array(),
			having: NotificationScalarWhereWithAggregatesInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
		})
		.strict();

export const NotificationFindUniqueArgsSchema: z.ZodType<Prisma.NotificationFindUniqueArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereUniqueInputSchema,
		})
		.strict();

export const NotificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.NotificationFindUniqueOrThrowArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereUniqueInputSchema,
		})
		.strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
	})
	.strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
		create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
		update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
	})
	.strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z
	.object({
		data: z.union([
			UserCreateManyInputSchema,
			UserCreateManyInputSchema.array(),
		]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				UserCreateManyInputSchema,
				UserCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
	.object({
		data: z.union([
			UserUpdateManyMutationInputSchema,
			UserUncheckedUpdateManyInputSchema,
		]),
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				UserUpdateManyMutationInputSchema,
				UserUncheckedUpdateManyInputSchema,
			]),
			where: UserWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const EcosystemCreateArgsSchema: z.ZodType<Prisma.EcosystemCreateArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			data: z.union([
				EcosystemCreateInputSchema,
				EcosystemUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const EcosystemUpsertArgsSchema: z.ZodType<Prisma.EcosystemUpsertArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereUniqueInputSchema,
			create: z.union([
				EcosystemCreateInputSchema,
				EcosystemUncheckedCreateInputSchema,
			]),
			update: z.union([
				EcosystemUpdateInputSchema,
				EcosystemUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const EcosystemCreateManyArgsSchema: z.ZodType<Prisma.EcosystemCreateManyArgs> =
	z
		.object({
			data: z.union([
				EcosystemCreateManyInputSchema,
				EcosystemCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const EcosystemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EcosystemCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				EcosystemCreateManyInputSchema,
				EcosystemCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const EcosystemDeleteArgsSchema: z.ZodType<Prisma.EcosystemDeleteArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			where: EcosystemWhereUniqueInputSchema,
		})
		.strict();

export const EcosystemUpdateArgsSchema: z.ZodType<Prisma.EcosystemUpdateArgs> =
	z
		.object({
			select: EcosystemSelectSchema.optional(),
			include: EcosystemIncludeSchema.optional(),
			data: z.union([
				EcosystemUpdateInputSchema,
				EcosystemUncheckedUpdateInputSchema,
			]),
			where: EcosystemWhereUniqueInputSchema,
		})
		.strict();

export const EcosystemUpdateManyArgsSchema: z.ZodType<Prisma.EcosystemUpdateManyArgs> =
	z
		.object({
			data: z.union([
				EcosystemUpdateManyMutationInputSchema,
				EcosystemUncheckedUpdateManyInputSchema,
			]),
			where: EcosystemWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const EcosystemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EcosystemUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				EcosystemUpdateManyMutationInputSchema,
				EcosystemUncheckedUpdateManyInputSchema,
			]),
			where: EcosystemWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const EcosystemDeleteManyArgsSchema: z.ZodType<Prisma.EcosystemDeleteManyArgs> =
	z
		.object({
			where: EcosystemWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityConfigCreateArgsSchema: z.ZodType<Prisma.VulnerabilityConfigCreateArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			data: z.union([
				VulnerabilityConfigCreateInputSchema,
				VulnerabilityConfigUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const VulnerabilityConfigUpsertArgsSchema: z.ZodType<Prisma.VulnerabilityConfigUpsertArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereUniqueInputSchema,
			create: z.union([
				VulnerabilityConfigCreateInputSchema,
				VulnerabilityConfigUncheckedCreateInputSchema,
			]),
			update: z.union([
				VulnerabilityConfigUpdateInputSchema,
				VulnerabilityConfigUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const VulnerabilityConfigCreateManyArgsSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityConfigCreateManyInputSchema,
				VulnerabilityConfigCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const VulnerabilityConfigCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VulnerabilityConfigCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityConfigCreateManyInputSchema,
				VulnerabilityConfigCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const VulnerabilityConfigDeleteArgsSchema: z.ZodType<Prisma.VulnerabilityConfigDeleteArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			where: VulnerabilityConfigWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityConfigUpdateArgsSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateArgs> =
	z
		.object({
			select: VulnerabilityConfigSelectSchema.optional(),
			include: VulnerabilityConfigIncludeSchema.optional(),
			data: z.union([
				VulnerabilityConfigUpdateInputSchema,
				VulnerabilityConfigUncheckedUpdateInputSchema,
			]),
			where: VulnerabilityConfigWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityConfigUpdateManyArgsSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityConfigUpdateManyMutationInputSchema,
				VulnerabilityConfigUncheckedUpdateManyInputSchema,
			]),
			where: VulnerabilityConfigWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityConfigUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VulnerabilityConfigUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityConfigUpdateManyMutationInputSchema,
				VulnerabilityConfigUncheckedUpdateManyInputSchema,
			]),
			where: VulnerabilityConfigWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityConfigDeleteManyArgsSchema: z.ZodType<Prisma.VulnerabilityConfigDeleteManyArgs> =
	z
		.object({
			where: VulnerabilityConfigWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityCreateArgsSchema: z.ZodType<Prisma.VulnerabilityCreateArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			data: z.union([
				VulnerabilityCreateInputSchema,
				VulnerabilityUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const VulnerabilityUpsertArgsSchema: z.ZodType<Prisma.VulnerabilityUpsertArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereUniqueInputSchema,
			create: z.union([
				VulnerabilityCreateInputSchema,
				VulnerabilityUncheckedCreateInputSchema,
			]),
			update: z.union([
				VulnerabilityUpdateInputSchema,
				VulnerabilityUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const VulnerabilityCreateManyArgsSchema: z.ZodType<Prisma.VulnerabilityCreateManyArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityCreateManyInputSchema,
				VulnerabilityCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const VulnerabilityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VulnerabilityCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityCreateManyInputSchema,
				VulnerabilityCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const VulnerabilityDeleteArgsSchema: z.ZodType<Prisma.VulnerabilityDeleteArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			where: VulnerabilityWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityUpdateArgsSchema: z.ZodType<Prisma.VulnerabilityUpdateArgs> =
	z
		.object({
			select: VulnerabilitySelectSchema.optional(),
			include: VulnerabilityIncludeSchema.optional(),
			data: z.union([
				VulnerabilityUpdateInputSchema,
				VulnerabilityUncheckedUpdateInputSchema,
			]),
			where: VulnerabilityWhereUniqueInputSchema,
		})
		.strict();

export const VulnerabilityUpdateManyArgsSchema: z.ZodType<Prisma.VulnerabilityUpdateManyArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityUpdateManyMutationInputSchema,
				VulnerabilityUncheckedUpdateManyInputSchema,
			]),
			where: VulnerabilityWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VulnerabilityUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VulnerabilityUpdateManyMutationInputSchema,
				VulnerabilityUncheckedUpdateManyInputSchema,
			]),
			where: VulnerabilityWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VulnerabilityDeleteManyArgsSchema: z.ZodType<Prisma.VulnerabilityDeleteManyArgs> =
	z
		.object({
			where: VulnerabilityWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const BatchCreateArgsSchema: z.ZodType<Prisma.BatchCreateArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		data: z.union([BatchCreateInputSchema, BatchUncheckedCreateInputSchema]),
	})
	.strict();

export const BatchUpsertArgsSchema: z.ZodType<Prisma.BatchUpsertArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		where: BatchWhereUniqueInputSchema,
		create: z.union([BatchCreateInputSchema, BatchUncheckedCreateInputSchema]),
		update: z.union([BatchUpdateInputSchema, BatchUncheckedUpdateInputSchema]),
	})
	.strict();

export const BatchCreateManyArgsSchema: z.ZodType<Prisma.BatchCreateManyArgs> =
	z
		.object({
			data: z.union([
				BatchCreateManyInputSchema,
				BatchCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const BatchCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BatchCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				BatchCreateManyInputSchema,
				BatchCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const BatchDeleteArgsSchema: z.ZodType<Prisma.BatchDeleteArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		where: BatchWhereUniqueInputSchema,
	})
	.strict();

export const BatchUpdateArgsSchema: z.ZodType<Prisma.BatchUpdateArgs> = z
	.object({
		select: BatchSelectSchema.optional(),
		include: BatchIncludeSchema.optional(),
		data: z.union([BatchUpdateInputSchema, BatchUncheckedUpdateInputSchema]),
		where: BatchWhereUniqueInputSchema,
	})
	.strict();

export const BatchUpdateManyArgsSchema: z.ZodType<Prisma.BatchUpdateManyArgs> =
	z
		.object({
			data: z.union([
				BatchUpdateManyMutationInputSchema,
				BatchUncheckedUpdateManyInputSchema,
			]),
			where: BatchWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const BatchUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BatchUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				BatchUpdateManyMutationInputSchema,
				BatchUncheckedUpdateManyInputSchema,
			]),
			where: BatchWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const BatchDeleteManyArgsSchema: z.ZodType<Prisma.BatchDeleteManyArgs> =
	z
		.object({
			where: BatchWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationChannelCreateArgsSchema: z.ZodType<Prisma.NotificationChannelCreateArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			data: z.union([
				NotificationChannelCreateInputSchema,
				NotificationChannelUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const NotificationChannelUpsertArgsSchema: z.ZodType<Prisma.NotificationChannelUpsertArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereUniqueInputSchema,
			create: z.union([
				NotificationChannelCreateInputSchema,
				NotificationChannelUncheckedCreateInputSchema,
			]),
			update: z.union([
				NotificationChannelUpdateInputSchema,
				NotificationChannelUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const NotificationChannelCreateManyArgsSchema: z.ZodType<Prisma.NotificationChannelCreateManyArgs> =
	z
		.object({
			data: z.union([
				NotificationChannelCreateManyInputSchema,
				NotificationChannelCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const NotificationChannelCreateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationChannelCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				NotificationChannelCreateManyInputSchema,
				NotificationChannelCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const NotificationChannelDeleteArgsSchema: z.ZodType<Prisma.NotificationChannelDeleteArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			where: NotificationChannelWhereUniqueInputSchema,
		})
		.strict();

export const NotificationChannelUpdateArgsSchema: z.ZodType<Prisma.NotificationChannelUpdateArgs> =
	z
		.object({
			select: NotificationChannelSelectSchema.optional(),
			include: NotificationChannelIncludeSchema.optional(),
			data: z.union([
				NotificationChannelUpdateInputSchema,
				NotificationChannelUncheckedUpdateInputSchema,
			]),
			where: NotificationChannelWhereUniqueInputSchema,
		})
		.strict();

export const NotificationChannelUpdateManyArgsSchema: z.ZodType<Prisma.NotificationChannelUpdateManyArgs> =
	z
		.object({
			data: z.union([
				NotificationChannelUpdateManyMutationInputSchema,
				NotificationChannelUncheckedUpdateManyInputSchema,
			]),
			where: NotificationChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationChannelUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationChannelUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				NotificationChannelUpdateManyMutationInputSchema,
				NotificationChannelUncheckedUpdateManyInputSchema,
			]),
			where: NotificationChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationChannelDeleteManyArgsSchema: z.ZodType<Prisma.NotificationChannelDeleteManyArgs> =
	z
		.object({
			where: NotificationChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const LineChannelCreateArgsSchema: z.ZodType<Prisma.LineChannelCreateArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			data: z.union([
				LineChannelCreateInputSchema,
				LineChannelUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const LineChannelUpsertArgsSchema: z.ZodType<Prisma.LineChannelUpsertArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereUniqueInputSchema,
			create: z.union([
				LineChannelCreateInputSchema,
				LineChannelUncheckedCreateInputSchema,
			]),
			update: z.union([
				LineChannelUpdateInputSchema,
				LineChannelUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const LineChannelCreateManyArgsSchema: z.ZodType<Prisma.LineChannelCreateManyArgs> =
	z
		.object({
			data: z.union([
				LineChannelCreateManyInputSchema,
				LineChannelCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const LineChannelCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LineChannelCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				LineChannelCreateManyInputSchema,
				LineChannelCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const LineChannelDeleteArgsSchema: z.ZodType<Prisma.LineChannelDeleteArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			where: LineChannelWhereUniqueInputSchema,
		})
		.strict();

export const LineChannelUpdateArgsSchema: z.ZodType<Prisma.LineChannelUpdateArgs> =
	z
		.object({
			select: LineChannelSelectSchema.optional(),
			include: LineChannelIncludeSchema.optional(),
			data: z.union([
				LineChannelUpdateInputSchema,
				LineChannelUncheckedUpdateInputSchema,
			]),
			where: LineChannelWhereUniqueInputSchema,
		})
		.strict();

export const LineChannelUpdateManyArgsSchema: z.ZodType<Prisma.LineChannelUpdateManyArgs> =
	z
		.object({
			data: z.union([
				LineChannelUpdateManyMutationInputSchema,
				LineChannelUncheckedUpdateManyInputSchema,
			]),
			where: LineChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const LineChannelUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.LineChannelUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				LineChannelUpdateManyMutationInputSchema,
				LineChannelUncheckedUpdateManyInputSchema,
			]),
			where: LineChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const LineChannelDeleteManyArgsSchema: z.ZodType<Prisma.LineChannelDeleteManyArgs> =
	z
		.object({
			where: LineChannelWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationCreateArgsSchema: z.ZodType<Prisma.NotificationCreateArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			data: z.union([
				NotificationCreateInputSchema,
				NotificationUncheckedCreateInputSchema,
			]),
		})
		.strict();

export const NotificationUpsertArgsSchema: z.ZodType<Prisma.NotificationUpsertArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereUniqueInputSchema,
			create: z.union([
				NotificationCreateInputSchema,
				NotificationUncheckedCreateInputSchema,
			]),
			update: z.union([
				NotificationUpdateInputSchema,
				NotificationUncheckedUpdateInputSchema,
			]),
		})
		.strict();

export const NotificationCreateManyArgsSchema: z.ZodType<Prisma.NotificationCreateManyArgs> =
	z
		.object({
			data: z.union([
				NotificationCreateManyInputSchema,
				NotificationCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const NotificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				NotificationCreateManyInputSchema,
				NotificationCreateManyInputSchema.array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const NotificationDeleteArgsSchema: z.ZodType<Prisma.NotificationDeleteArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			where: NotificationWhereUniqueInputSchema,
		})
		.strict();

export const NotificationUpdateArgsSchema: z.ZodType<Prisma.NotificationUpdateArgs> =
	z
		.object({
			select: NotificationSelectSchema.optional(),
			include: NotificationIncludeSchema.optional(),
			data: z.union([
				NotificationUpdateInputSchema,
				NotificationUncheckedUpdateInputSchema,
			]),
			where: NotificationWhereUniqueInputSchema,
		})
		.strict();

export const NotificationUpdateManyArgsSchema: z.ZodType<Prisma.NotificationUpdateManyArgs> =
	z
		.object({
			data: z.union([
				NotificationUpdateManyMutationInputSchema,
				NotificationUncheckedUpdateManyInputSchema,
			]),
			where: NotificationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.NotificationUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				NotificationUpdateManyMutationInputSchema,
				NotificationUncheckedUpdateManyInputSchema,
			]),
			where: NotificationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const NotificationDeleteManyArgsSchema: z.ZodType<Prisma.NotificationDeleteManyArgs> =
	z
		.object({
			where: NotificationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();
