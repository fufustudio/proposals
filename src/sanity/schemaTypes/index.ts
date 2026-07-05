import { type SchemaTypeDefinition } from "sanity";

import { page } from "./documents/page";
import { post } from "./documents/post";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";
import {
  address,
  cta,
  imageWithAlt,
  pageHeader,
  simplePortableText,
} from "./objects/shared";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    address,
    cta,
    imageWithAlt,
    pageHeader,
    simplePortableText,
    siteSettings,
    page,
    service,
    post,
  ],
};
