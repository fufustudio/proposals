import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "name",
      title: "Site name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactName",
      title: "Contact name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "address",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "primaryActionLabel",
      title: "Primary action label",
      type: "string",
    }),
    defineField({
      name: "primaryActionUrl",
      title: "Primary action URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"], allowRelative: true }),
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "areaServed",
      title: "Areas served",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "sameAs",
      title: "Social/profile URLs",
      type: "array",
      of: [defineArrayMember({ type: "url" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
