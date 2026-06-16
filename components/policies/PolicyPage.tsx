import Link from "next/link";

type PolicySection = {
  title: string;
  body: string[];
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export default function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] px-[5%] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">
            {eyebrow}
          </p>
          <h1 className="font-[Cinzel] text-4xl mb-4">{title}</h1>
          <p className="text-[#C8C0B0] leading-8 text-base">{intro}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border border-[#1A1A1A] bg-[#161616] p-6"
            >
              <h2 className="font-[Cinzel] text-2xl text-[#C9A84C] mb-4">
                {section.title}
              </h2>
              <div className="space-y-4 text-[#C8C0B0] leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-sm text-[#666]">
          Questions? Visit{" "}
          <Link href="/contact" className="text-[#C9A84C] hover:text-[#E8C96A]">
            Contact
          </Link>{" "}
          or browse our{" "}
          <Link href="/faq" className="text-[#C9A84C] hover:text-[#E8C96A]">
            FAQ
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
