import assert from "node:assert/strict";
import test from "node:test";
import { defaultHome, safeRedirectPath } from "../safeRedirect";
import { isValidPhone } from "../phoneFormat";
import { validatePassword } from "../password";
import { ALL_PERMISSIONS, isPermission, PERMISSIONS } from "../../../convex/permissions";

test("customer registration never uses owner home", () => {
  assert.equal(defaultHome("customer"), "/account");
  assert.equal(safeRedirectPath("/admin", "customer"), "/account");
  assert.equal(safeRedirectPath("/admin/customers", "customer"), "/account");
  assert.equal(safeRedirectPath("/workspace", "customer"), "/account");
});

test("open redirect protection", () => {
  assert.equal(safeRedirectPath("https://evil.com", "owner"), "/admin");
  assert.equal(safeRedirectPath("//evil.com", "owner"), "/admin");
  assert.equal(safeRedirectPath("/account/../admin", "customer"), "/account");
  assert.equal(safeRedirectPath("/account/profile", "customer"), "/account/profile");
});

test("staff homes", () => {
  assert.equal(defaultHome("employee"), "/workspace");
  assert.equal(defaultHome("owner"), "/admin");
  assert.equal(safeRedirectPath("/admin/bookings", "employee"), "/admin/bookings");
  assert.equal(safeRedirectPath("/account", "owner"), "/admin");
  assert.equal(safeRedirectPath("/account/bookings", "owner"), "/admin");
  assert.equal(safeRedirectPath("/account", "employee"), "/workspace");
});

test("password rules", () => {
  assert.ok(validatePassword("short") !== null);
  assert.ok(validatePassword("allletters") !== null);
  assert.ok(validatePassword("1234567890") !== null);
  assert.equal(validatePassword("SecurePass1"), null);
});

test("phone validation", () => {
  assert.equal(isValidPhone("+90 530 070 9555"), true);
  assert.equal(isValidPhone("123"), false);
});

test("permission catalog", () => {
  assert.ok(isPermission(PERMISSIONS.CUSTOMERS_VIEW));
  assert.equal(isPermission("owner.everything"), false);
  assert.ok(ALL_PERMISSIONS.includes(PERMISSIONS.ROLES_EDIT));
});
