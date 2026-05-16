export type Language = 'cn' | 'en';

export interface NavItem {
  id: string;
  labelCn: string;
  labelEn: string;
  href: string;
}

export interface ExperienceItem {
  id: string;
  titleCn: string;
  titleEn: string;
  period: string;
  companyCn: string;
  companyEn: string;
  descCn: string[];
  descEn: string[];
}

export interface TechSkill {
  name: string;
  level: number; // 0-100
  highlight: boolean;
  category?: 'AI' | 'PRO';
}

export interface AwardItem {
  titleCn: string;
  titleEn: string;
}

export interface EduItem {
  schoolCn: string;
  schoolEn: string;
  degreeCn: string;
  degreeEn: string;
  period: string;
}
