import type { InferSelectModel } from "drizzle-orm";

import type { address } from "@/db/schema";

export type Address = InferSelectModel<typeof address>;
