import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const common = z.object({ title:z.string(), description:z.string(), locale:z.enum(['en','ja']), publishStatus:z.enum(['published','draft']), updatedAt:z.string(), sourceIds:z.array(z.string()).default([]) });
export const collections = {
  places: defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/places'}),schema:common.extend({prefectureId:z.string(),relatedMerchantIds:z.array(z.string()).default([])})}),
  craftNotes: defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/crafts'}),schema:common.extend({craftId:z.string()})}),
  guides: defineCollection({ loader:glob({pattern:'**/*.md',base:'./src/content/guides'}), schema:common.extend({category:z.string(),readMinutes:z.number(),productIds:z.array(z.string()).default([])}) }),
  policies: defineCollection({ loader:glob({pattern:'**/*.md',base:'./src/content/policies'}), schema:common }),
  productNotes: defineCollection({ loader:glob({pattern:'**/*.md',base:'./src/content/products'}), schema:z.object({productId:z.string(),locale:z.enum(['en','ja']).default('en'),publishStatus:z.enum(['published','draft'])}) }),
};
