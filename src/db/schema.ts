import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(), // Support Firebase Auth UID if needed
  phone: text('phone').unique(),
  name: text('name'),
  pin: text('pin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // Matches string tokens/document IDs
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  isPositive: boolean('is_positive').default(false),
  provider: text('provider'),
  recipient: text('recipient'),
  date: text('date'),
  createdAt: timestamp('created_at').defaultNow(),
  txRef: text('tx_ref'),
  flwId: text('flw_id'),
});

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.uid],
  }),
}));
