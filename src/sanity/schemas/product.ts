import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hide",
      title: "Hide from website",
      type: "boolean",
      description: "Hide this product from public listings. It will still be accessible via direct URL and invoice dropdown.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "productCode",
      title: "Product Code / HSN",
      type: "string",
      description: "Product code or HSN code for invoicing",
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      description: "Default price for invoicing",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "gstPercentage",
      title: "GST %",
      type: "number",
      description: "GST percentage (default: 18)",
      initialValue: 18,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: {
            select: {
              title: "key",
              subtitle: "value",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "image",
    },
  },
});
