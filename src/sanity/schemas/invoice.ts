import { defineType, defineField } from 'sanity';

export const invoiceSchema = defineType({
  name: 'invoice',
  title: 'Invoice',
  type: 'document',
  fields: [
    defineField({
      name: 'invoiceNumber',
      title: 'Invoice Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'invoiceDate',
      title: 'Invoice Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name (M/S)',
      type: 'string',
    }),
    defineField({
      name: 'customerAddress',
      title: 'Customer Address',
      type: 'text',
    }),
    defineField({
      name: 'customerPhone',
      title: 'Customer Phone',
      type: 'string',
    }),
    defineField({
      name: 'customerGstin',
      title: 'Customer GSTIN',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Invoice Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Product/Service Name', type: 'string' },
            { name: 'hsn', title: 'Product Code', type: 'string' },
            { name: 'qty', title: 'Quantity', type: 'number' },
            { name: 'rate', title: 'Rate', type: 'number' },
            { name: 'gstPercentage', title: 'GST Percentage', type: 'number', initialValue: 18 },
          ],
        },
      ],
    }),
    defineField({
      name: 'grandTotalOverride',
      title: 'Grand Total Override',
      type: 'number',
      description: 'If set, a discount will be calculated to match this total',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
  ],
});