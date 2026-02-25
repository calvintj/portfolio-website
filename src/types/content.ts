export type Experience = {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
};

export type Certification = {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
};

export type Organization = {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
};

export type Project = {
  title: { text: string; link?: string };
  image: string;
  description: string;
  technologies: string[];
};

export type Contact = {
  domicile: string;
  phoneNo: string;
  email: string;
};

export type Content = {
  profileImage: string;
  name: string;
  nickname: string;
  position: string;
  heroContent: string;
  experiences: Experience[];
  certifications: Certification[];
  organizations: Organization[];
  projects: Project[];
  contact: Contact;
};

export type ContentContextValue = {
  content: Content;
  loading: boolean;
  refetch: () => Promise<void>;
};
