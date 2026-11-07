export interface ProjectEntry {
  type: string;
  title: string;
  description: string;
  media: string;
  role: string;
  year: string;
  category: string;
  image: string;
}

export function filterProjects(
  archive: ProjectEntry[],
  category: string,
  query: string
): ProjectEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  return archive.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(normalizedQuery)
  );
}

export function buildWhatsAppUrl(
  phone: string,
  name: string,
  inquiryType: string,
  message: string
): string {
  const text = `Hello Tejas, I am ${name}.\n\nInquiry type: ${inquiryType}\n${message}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
