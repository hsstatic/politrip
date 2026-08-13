import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const userKind = v.union(v.literal("customer"), v.literal("employee"), v.literal("owner"));
const userStatus = v.union(v.literal("active"), v.literal("disabled"), v.literal("deactivated"));

export default defineSchema({
  hotels: defineTable({
    name_en: v.string(),
    name_ar: v.string(),
    name_tr: v.string(),
    description_en: v.string(),
    description_ar: v.string(),
    description_tr: v.string(),
    city: v.string(),
    stars: v.number(),
    rating: v.number(),
    reviews: v.number(),
    price: v.number(),
    images: v.array(v.string()),
    amenities: v.array(v.string()),
    category: v.union(
      v.literal("ultra-luxury"),
      v.literal("luxury"),
      v.literal("boutique"),
      v.literal("resort"),
    ),
    isVIP: v.boolean(),
    lat: v.number(),
    lng: v.number(),
    order: v.optional(v.number()),
  }),

  destinations: defineTable({
    name_en: v.string(),
    name_ar: v.string(),
    name_tr: v.string(),
    tag_en: v.string(),
    tag_ar: v.string(),
    tag_tr: v.string(),
    badge_en: v.string(),
    badge_ar: v.string(),
    badge_tr: v.string(),
    desc_en: v.string(),
    desc_ar: v.string(),
    desc_tr: v.string(),
    flightTime_en: v.string(),
    flightTime_ar: v.string(),
    flightTime_tr: v.string(),
    climate_en: v.string(),
    climate_ar: v.string(),
    climate_tr: v.string(),
    signature_en: v.string(),
    signature_ar: v.string(),
    signature_tr: v.string(),
    color: v.string(),
    accent: v.string(),
    icon: v.string(),
    imageUrl: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    lat: v.number(),
    lng: v.number(),
    order: v.optional(v.number()),
  }),

  trips: defineTable({
    title_en: v.string(),
    title_ar: v.string(),
    title_tr: v.string(),
    description_en: v.string(),
    description_ar: v.string(),
    description_tr: v.string(),
    highlights_en: v.array(v.string()),
    highlights_ar: v.array(v.string()),
    highlights_tr: v.array(v.string()),
    location: v.string(),
    duration: v.string(),
    price: v.number(),
    currency: v.union(
      v.literal("USD"),
      v.literal("SAR"),
      v.literal("AED"),
      v.literal("TRY"),
      v.literal("QAR"),
      v.literal("KWD"),
    ),
    category: v.union(
      v.literal("cultural"),
      v.literal("adventure"),
      v.literal("luxury"),
      v.literal("nature"),
      v.literal("yacht"),
      v.literal("helicopter"),
      v.literal("balloon"),
    ),
    rating: v.number(),
    reviews: v.number(),
    images: v.array(v.string()),
    capacity: v.number(),
    nextAvailable: v.string(),
    isVIP: v.boolean(),
    isPopular: v.boolean(),
  }),

  testimonials: defineTable({
    name: v.string(),
    country_en: v.string(),
    country_ar: v.string(),
    country_tr: v.string(),
    flag: v.string(),
    role_en: v.string(),
    role_ar: v.string(),
    role_tr: v.string(),
    text_en: v.string(),
    text_ar: v.string(),
    text_tr: v.string(),
    trip_en: v.string(),
    trip_ar: v.string(),
    trip_tr: v.string(),
    date_en: v.string(),
    date_ar: v.string(),
    date_tr: v.string(),
    rating: v.number(),
    order: v.number(),
  }),

  gallery: defineTable({
    src: v.string(),
    label: v.string(),
    span: v.string(),
    order: v.number(),
  }),

  newsletter: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  bookings: defineTable({
    userId: v.optional(v.id("users")),
    contactName: v.string(),
    contactEmail: v.optional(v.string()),
    contactPhone: v.string(),
    whatsapp: v.optional(v.string()),
    type: v.union(
      v.literal("trip"),
      v.literal("hotel"),
      v.literal("activity"),
      v.literal("transportation"),
    ),
    itemId: v.string(),
    itemTitle: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    guests: v.number(),
    totalPrice: v.number(),
    currency: v.union(
      v.literal("USD"),
      v.literal("SAR"),
      v.literal("AED"),
      v.literal("TRY"),
      v.literal("QAR"),
      v.literal("KWD"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
    notes: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_contactEmail", ["contactEmail"]),

  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    kind: userKind,
    employeeRoleId: v.optional(v.id("employeeRoles")),
    status: userStatus,
    tokenVersion: v.number(),
    searchText: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    deactivatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_kind", ["kind"])
    .index("by_status", ["status"])
    .index("by_kind_status", ["kind", "status"])
    .searchIndex("search_users", {
      searchField: "searchText",
      filterFields: ["kind", "status"],
    }),

  employeeRoles: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    permissions: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  sessions: defineTable({
    userId: v.id("users"),
    userAgent: v.optional(v.string()),
    ip: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_expiresAt", ["expiresAt"]),

  passwordResets: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_userId", ["userId"]),

  auditLogs: defineTable({
    actorUserId: v.optional(v.id("users")),
    actorEmail: v.optional(v.string()),
    actorKind: v.optional(v.string()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_actor", ["actorUserId"])
    .index("by_entity", ["entityType", "entityId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    href: v.optional(v.string()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  appSettings: defineTable({
    key: v.string(),
    value: v.string(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  }).index("by_key", ["key"]),
});
