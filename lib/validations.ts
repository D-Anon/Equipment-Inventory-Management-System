import { z } from "zod";

export const equipmentCreateSchema = z.object({
  assetId: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  serialNumber: z.string().nullable().optional(),
  condition: z.string().default("Good"),
  status: z.string().default("Available"),
  location: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
  officeId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional()
});

export const equipmentUpdateSchema = equipmentCreateSchema.partial().extend({ id: z.string().min(1) });

export const supplyCreateSchema = z.object({
  supplyId: z.string().min(1),
  itemName: z.string().min(1),
  category: z.string().min(1),
  unit: z.string().min(1),
  stockOnHand: z.number().int().nonnegative(),
  reorderLevel: z.number().int().nonnegative(),
  remarks: z.string().nullable().optional(),
  officeId: z.string().nullable().optional()
});

export const supplyUpdateSchema = supplyCreateSchema.partial().extend({ id: z.string().min(1) });

export const transactionCreateSchema = z.object({
  equipmentId: z.string().min(1),
  type: z.enum(["Borrow", "Return", "Transfer"]),
  borrowerName: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  officeId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(),
  remarks: z.string().nullable().optional()
});

export const maintenanceCreateSchema = z.object({
  equipmentId: z.string().min(1),
  issue: z.string().min(1),
  technician: z.string().nullable().optional(),
  status: z.string().default("Pending"),
  remarks: z.string().nullable().optional()
});

export const personnelCreateSchema = z.object({
  employeeCode: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email().nullable().optional().or(z.literal("")),
  contactNumber: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  status: z.string().default("Active"),
  officeId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional()
});

export const disposalCreateSchema = z.object({
  equipmentId: z.string().min(1),
  reason: z.string().min(1),
  status: z.string().default("Retired"),
  approvedBy: z.string().nullable().optional(),
  remarks: z.string().nullable().optional()
});
