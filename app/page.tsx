import { InvoicePageClient } from '@/components/invoice/invoice-page'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BilKu',
  url: 'https://invoisku.vercel.app',
  description:
    'Free SST-compliant invoice generator for Malaysian freelancers, agencies, and small businesses. Create professional invoices with automatic 8% SST tax calculation in seconds.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'MYR',
  },
  featureList: [
    'SST 8% tax calculation',
    'Bilingual invoices (English & Bahasa Malaysia)',
    'Multi-currency support (MYR, USD, SGD, EUR, GBP)',
    'PDF export and printing',
    'Business profile management',
    'DuitNow QR code support',
    'Mobile-friendly invoice creation',
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is SST and do I need it on my invoices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SST (Sales and Service Tax) is a Malaysian tax at 8% on taxable goods and services. If your business is SST-registered with the Royal Malaysian Customs Department, you must include SST on invoices for taxable items. BilKu automatically calculates the 8% SST for each taxable line item.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BilKu free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, BilKu is completely free. You can generate unlimited SST-compliant invoices without any signup or payment required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I create invoices in Bahasa Malaysia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, BilKu supports English, Bahasa Malaysia, and bilingual (both languages) invoice generation. You can switch languages per invoice to suit your client needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What currencies does BilKu support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BilKu supports multiple currencies including MYR (Malaysian Ringgit), USD, SGD, EUR, and GBP. For overseas clients, SST is automatically zero-rated.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <InvoicePageClient />

      {/* SEO content - visible to crawlers, hidden from app UI */}
      <div className="sr-only">
        <h1>BilKu - Free SST Invoice Generator for Malaysian Freelancers</h1>

        <p>
          BilKu is a free, professional invoice generator built specifically for Malaysian
          freelancers, agencies, and small businesses. Create SST-compliant invoices in under
          60 seconds with automatic 8% Sales and Service Tax calculation, bilingual support
          in English and Bahasa Malaysia, and multiple currency options.
        </p>

        <h2>SST-Compliant Invoice Generation</h2>
        <p>
          Generate invoices that comply with Malaysian SST (Sales and Service Tax) regulations.
          BilKu automatically calculates the 8% SST on taxable line items and clearly separates
          taxable and non-taxable amounts. For businesses registered with the Royal Malaysian
          Customs Department (JKDM), your SST registration number is displayed on every invoice.
          Overseas clients are automatically zero-rated for SST purposes.
        </p>

        <h2>Bilingual Invoices in English and Bahasa Malaysia</h2>
        <p>
          Create professional invoices in English, Bahasa Malaysia, or both languages
          simultaneously. BilKu supports bilingual invoice generation so you can serve
          local Malaysian clients in Bahasa Malaysia and international clients in English,
          all from the same invoice template.
        </p>

        <h2>Multi-Currency Support for Malaysian Businesses</h2>
        <p>
          Invoice your clients in Malaysian Ringgit (MYR), US Dollars (USD), Singapore
          Dollars (SGD), Euros (EUR), or British Pounds (GBP). BilKu formats currency
          amounts correctly and handles SST zero-rating automatically for overseas
          transactions.
        </p>

        <h2>Professional Invoice Features</h2>
        <p>
          BilKu includes everything Malaysian freelancers need to create professional
          invoices: customizable business profiles with company logo, bank account details
          for easy payment, DuitNow QR code support for instant transfers, automatic
          invoice numbering, payment term tracking, and one-click PDF export. Your
          invoices look professional and include all the details your clients need to
          pay you quickly.
        </p>

        <h2>Built for Malaysian Freelancers and Agencies</h2>
        <p>
          Whether you are a freelance designer in Kuala Lumpur, a software developer in
          Penang, a marketing agency in Johor Bahru, or a consultant in Cyberjaya, BilKu
          understands the invoicing needs of Malaysian professionals. It supports all
          Malaysian states, handles SST calculations according to JKDM guidelines, and
          includes local bank details for major Malaysian banks.
        </p>

        <h2>How to Create an SST Invoice with BilKu</h2>
        <ol>
          <li>Set up your business profile with company name, SST registration number, and bank details.</li>
          <li>Enter your client details including name, company, and address.</li>
          <li>Add line items with descriptions, quantities, and unit prices. Mark taxable items for automatic SST calculation.</li>
          <li>Choose your invoice language (English, Bahasa Malaysia, or both) and currency.</li>
          <li>Preview your professional invoice and export it as a PDF or print it directly.</li>
        </ol>

        <h2>Frequently Asked Questions</h2>

        <h3>What is SST and do I need it on my invoices?</h3>
        <p>
          SST (Sales and Service Tax) is a Malaysian tax at 8% on taxable goods and services.
          If your business is SST-registered with the Royal Malaysian Customs Department, you
          must include SST on invoices for taxable items. BilKu automatically calculates the
          8% SST for each taxable line item.
        </p>

        <h3>Is BilKu free to use?</h3>
        <p>
          Yes, BilKu is completely free. You can generate unlimited SST-compliant invoices
          without any signup or payment required.
        </p>

        <h3>Can I create invoices in Bahasa Malaysia?</h3>
        <p>
          Yes, BilKu supports English, Bahasa Malaysia, and bilingual invoice generation.
          You can switch languages per invoice to suit your client needs.
        </p>

        <h3>What currencies does BilKu support?</h3>
        <p>
          BilKu supports multiple currencies including MYR (Malaysian Ringgit), USD, SGD,
          EUR, and GBP. For overseas clients, SST is automatically zero-rated.
        </p>
      </div>
    </>
  )
}
