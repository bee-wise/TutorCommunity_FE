import { z } from "zod";

// Seeded catalog IDs can have nonstandard UUID version bits, while retaining GUID format.
export const learningCatalogIdSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
);
