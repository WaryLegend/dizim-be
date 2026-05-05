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

export interface BlocksCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_sections';
  info: {
    displayName: 'CTA section';
    icon: 'cursor';
  };
  attributes: {
    cta: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Text;
    sub_title: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface BlocksFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_items';
  info: {
    displayName: 'Feature Item';
    icon: 'bulletList';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    cta: Schema.Attribute.Component<'links.button', false>;
    description: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images', true>;
    image: Schema.Attribute.Media<'images', true>;
    isHighLight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
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
    heading: Schema.Attribute.String;
  };
}

export interface BlocksHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_sections';
  info: {
    displayName: 'Hero section';
    icon: 'crown';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    sub_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'ever easy'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Make content'>;
  };
}

export interface BlocksValueItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_value_items';
  info: {
    displayName: 'Value Item';
    icon: 'handHeart';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksValuesSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_values_sections';
  info: {
    displayName: 'Values section';
    icon: 'handHeart';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    Value: Schema.Attribute.Component<'blocks.value-item', true>;
  };
}

export interface LinksButton extends Struct.ComponentSchema {
  collectionName: 'components_links_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    button_style: Schema.Attribute.Enumeration<['Filled', 'Ghost', 'Shaded']>;
    href: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Click me'>;
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
      'blocks.cta-section': BlocksCtaSection;
      'blocks.feature-item': BlocksFeatureItem;
      'blocks.feature-section': BlocksFeatureSection;
      'blocks.hero-section': BlocksHeroSection;
      'blocks.value-item': BlocksValueItem;
      'blocks.values-section': BlocksValuesSection;
      'links.button': LinksButton;
      'links.social-link': LinksSocialLink;
    }
  }
}
