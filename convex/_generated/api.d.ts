/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as audit from "../audit.js";
import type * as authz from "../authz.js";
import type * as bookings from "../bookings.js";
import type * as customers from "../customers.js";
import type * as destinations from "../destinations.js";
import type * as employees from "../employees.js";
import type * as gallery from "../gallery.js";
import type * as hotels from "../hotels.js";
import type * as migrations_migrateDestinationImages from "../migrations/migrateDestinationImages.js";
import type * as newsletter from "../newsletter.js";
import type * as notifications from "../notifications.js";
import type * as overview from "../overview.js";
import type * as permissions from "../permissions.js";
import type * as reports from "../reports.js";
import type * as roles from "../roles.js";
import type * as settings from "../settings.js";
import type * as testimonials from "../testimonials.js";
import type * as trips from "../trips.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  audit: typeof audit;
  authz: typeof authz;
  bookings: typeof bookings;
  customers: typeof customers;
  destinations: typeof destinations;
  employees: typeof employees;
  gallery: typeof gallery;
  hotels: typeof hotels;
  "migrations/migrateDestinationImages": typeof migrations_migrateDestinationImages;
  newsletter: typeof newsletter;
  notifications: typeof notifications;
  overview: typeof overview;
  permissions: typeof permissions;
  reports: typeof reports;
  roles: typeof roles;
  settings: typeof settings;
  testimonials: typeof testimonials;
  trips: typeof trips;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
