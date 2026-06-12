"use client";
import { Section, SectionHeading, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Organization = () => {
  const { content } = useContent();
  return (
    <Section id="organizations">
      <SectionHeading label="Community" title="Organizations" />
      <Timeline entries={content.organizations} />
    </Section>
  );
};

export default Organization;
