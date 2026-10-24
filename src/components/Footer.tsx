import Image from "next/image";

export default function Footer() {
  const whatsappNumber = "919699690289";
  const whatsappMessage = "Dear Team,\nI need assistance with a customer referral";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="border-t border-slate-100 bg-white pt-14 pb-10 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Logo with Sentence + Navigation & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand & Descriptive Sentence */}
          <div className="md:col-span-6 space-y-4">
            <a href="#" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src="/AVMLabs-Logo-WL.png"
                alt="AVMLabs Logo"
                width={200}
                height={135}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </a>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              AVMLabs Referral Programme empowers partners to refer customers for
              preventive and chronic wellness testing while earning competitive, transparent monthly incentives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#rate-list"
                  className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Rate List &amp; Test Menu</span>
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Frequently Asked Questions</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details: WhatsApp & Email */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Partner Support
            </p>
            <ul className="space-y-3">
              {/* WhatsApp Contact Number */}
              <li>
                <span className="block text-xs text-slate-400">WhatsApp Assistance</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors inline-flex items-center gap-1.5 mt-0.5"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
                  </svg>
                  <span>+91 96996 90289</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <span className="block text-xs text-slate-400">Official Inquiries</span>
                <a
                  href="mailto:partners@avmlabs.com"
                  className="font-medium text-slate-800 hover:text-slate-950 hover:underline transition-colors inline-flex items-center gap-1.5 mt-0.5"
                >
                  <svg
                    className="w-4 h-4 text-slate-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>partners@avmlabs.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline Row */}
        <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 AVMLabs. All rights reserved.</p>
          <p>Client Referral Programme</p>
        </div>
      </div>
    </footer>
  );
}
