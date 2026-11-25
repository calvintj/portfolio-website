"use client";
import { Section, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Certification = ({ index }: { index: number }) => {
  const { content } = useContent();
  return (
    <Section
      id="certifications"
      index={index}
      label="Learning"
      title={
        <>
          Always <em className="italic">learning</em>
        </>
      }
      count={content.certifications.length}
      aside
    >
      <Timeline entries={content.certifications} />
    </Section>
  );
};

export default Certification;
