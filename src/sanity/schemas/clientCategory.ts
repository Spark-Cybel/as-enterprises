import { defineField, defineType } from "sanity";

export const clientCategory = defineType({
  name: "clientCategory",
  title: "Client Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Used for sorting categories",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "order",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `Order: ${subtitle}`,
      };
    },
  },
});
