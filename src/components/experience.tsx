"use client";
import { Section, SectionHeading, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Experience = () => {
  const { content } = useContent();
  return (
    <Section id="experience">
      <SectionHeading label="Career" title="Experience" />
      <Timeline entries={content.experiences} />
    </Section>
  );
};

export default Experience;
