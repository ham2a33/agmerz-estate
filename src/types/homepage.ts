export interface HomepageHeroConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomepageFeaturedConfig {
  enabled: boolean;
}

export interface HomepageAboutSectionConfig {
  title: string;
  text: string;
}

export interface HomepageServicesSectionConfig {
  title: string;
  description: string;
}

export interface HomepageContactCtaConfig {
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomepageSectionImages {
  homepageHero: string;
  requestHero: string;
  contactHero: string;
}

export interface HomepageConfig {
  hero: HomepageHeroConfig;
  featured: HomepageFeaturedConfig;
  aboutSection: HomepageAboutSectionConfig;
  servicesSection: HomepageServicesSectionConfig;
  contactCta: HomepageContactCtaConfig;
  sectionImages: HomepageSectionImages;
}
