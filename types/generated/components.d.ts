import type { Schema, Struct } from '@strapi/strapi';

export interface AddressAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'Address';
    icon: 'house';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    building: Schema.Attribute.Enumeration<['Headquater', 'Branch']> &
      Schema.Attribute.Required;
  };
}

export interface BlocksCtaBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_blocks';
  info: {
    displayName: 'CTA block';
    icon: 'cursor';
  };
  attributes: {
    bg_color: Schema.Attribute.String;
    cta: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_sections';
  info: {
    displayName: 'CTA section';
    icon: 'cursor';
  };
  attributes: {
    cta_block: Schema.Attribute.Component<'blocks.cta-block', true>;
  };
}

export interface BlocksFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_items';
  info: {
    displayName: 'Feature Item';
    icon: 'bulletList';
  };
  attributes: {
    button: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFeatureSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_sections';
  info: {
    displayName: 'Feature section';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'blocks.feature-item', true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sections';
  info: {
    displayName: 'Hero section';
    icon: 'crown';
  };
  attributes: {
    badge: Schema.Attribute.String;
    buttons: Schema.Attribute.Component<'links.button', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'ever easy'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Make content'>;
  };
}

export interface BlocksShowsSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_shows_sections';
  info: {
    displayName: 'Shows section';
    icon: 'handHeart';
  };
  attributes: {
    cta: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Text;
    shows: Schema.Attribute.Relation<'oneToMany', 'api::show.show'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksStep extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    displayName: 'Step';
    icon: 'question';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksStepSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_step_sections';
  info: {
    displayName: 'Step section';
    icon: 'question';
  };
  attributes: {
    cta: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    steps: Schema.Attribute.Component<'blocks.step', true>;
  };
}

export interface BlocksTestimonialSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonial_sections';
  info: {
    displayName: 'Testimonial section';
    icon: 'star';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logo';
    icon: 'apps';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksButton extends Struct.ComponentSchema {
  collectionName: 'components_links_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    button_style: Schema.Attribute.Enumeration<
      ['Text', 'Filled', 'Ghost', 'Shaded']
    >;
    color: Schema.Attribute.String;
    href: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Click me'>;
  };
}

export interface LinksLink extends Struct.ComponentSchema {
  collectionName: 'components_links_links';
  info: {
    displayName: 'Link';
    icon: 'hashtag';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_links_link_groups';
  info: {
    displayName: 'Link group';
    icon: 'hashtag';
  };
  attributes: {
    links: Schema.Attribute.Component<'links.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface LinksSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_links_social_links';
  info: {
    displayName: 'SocialLink';
    icon: 'globe';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'address.address': AddressAddress;
      'blocks.cta-block': BlocksCtaBlock;
      'blocks.cta-section': BlocksCtaSection;
      'blocks.feature-item': BlocksFeatureItem;
      'blocks.feature-section': BlocksFeatureSection;
      'blocks.hero-section': BlocksHeroSection;
      'blocks.shows-section': BlocksShowsSection;
      'blocks.step': BlocksStep;
      'blocks.step-section': BlocksStepSection;
      'blocks.testimonial-section': BlocksTestimonialSection;
      'elements.logo': ElementsLogo;
      'links.button': LinksButton;
      'links.link': LinksLink;
      'links.link-group': LinksLinkGroup;
      'links.social-link': LinksSocialLink;
    }
  }
}
