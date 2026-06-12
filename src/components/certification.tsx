"use client";
import { Section, SectionHeading, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Certification = () => {
  const { content } = useContent();
  return (
    <Section id="certifications">
      <SectionHeading label="Learning" title="Certifications" />
      <Timeline entries={content.certifications} />
    </Section>
  );
};

export default Certification;
