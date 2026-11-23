import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const dbUri =
  process.env.DB_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/mentorlagbe";
const dbName = process.env.DB_NAME || "mentorlagbe";

const globalForMongo = globalThis as unknown as {
  _mentorLagbeMongoClient?: MongoClient;
};

const client =
  globalForMongo._mentorLagbeMongoClient ?? new MongoClient(dbUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mentorLagbeMongoClient = client;
}

const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "mentorlagbe-dev-secret-change-in-production-32chars",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },
});
