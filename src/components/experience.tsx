"use client";
import { Section, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Experience = ({ index }: { index: number }) => {
  const { content } = useContent();
  return (
    <Section
      id="experience"
      index={index}
      label="Career"
      title={
        <>
          Where I&apos;ve <em className="italic">worked</em>
        </>
      }
      count={content.experiences.length}
      aside
    >
      <Timeline entries={content.experiences} />
    </Section>
  );
};

export default Experience;
