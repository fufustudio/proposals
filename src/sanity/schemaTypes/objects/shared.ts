import { ComposeIcon, DocumentsIcon, ImageIcon, LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) =>
        rule.required().error("Alt text is required for published images."),
    }),
  ],
});

export const simplePortableText = defineType({
  name: "simplePortableText",
  title: "Formatted text",
  type: "array",
  icon: ComposeIcon,
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: true,
                  }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.uri({
          scheme: ["http", "https", "mailto", "tel"],
          allowRelative: true,
        }),
    }),
  ],
});

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page Header",
  type: "object",
  icon: DocumentsIcon,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
  ],
});

export const address = defineType({
  name: "address",
  title: "Address",
  type: "object",
  fields: [
    defineField({ name: "line1", title: "Line 1", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "region", title: "Region", type: "string" }),
    defineField({ name: "postalCode", title: "Postal code", type: "string" }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      initialValue: "US",
    }),
    defineField({ name: "note", title: "Note", type: "string" }),
  ],
});
