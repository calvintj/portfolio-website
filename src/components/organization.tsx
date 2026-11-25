"use client";
import { Section, Timeline } from "@/components/section";
import { useContent } from "@/hooks";

const Organization = ({ index }: { index: number }) => {
  const { content } = useContent();
  return (
    <Section
      id="organizations"
      index={index}
      label="Community"
      title={
        <>
          Beyond the <em className="italic">code</em>
        </>
      }
      count={content.organizations.length}
      aside
    >
      <Timeline entries={content.organizations} />
    </Section>
  );
};

export default Organization;
