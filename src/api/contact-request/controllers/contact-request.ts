/**
 * contact-request controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-request.contact-request', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state?.user;
    const { data } = ctx.request.body;

    const entry = await strapi.documents('api::contact-request.contact-request').create({
      data: {
        ...data,
        ...(user && { users_permissions_user: user.id }),
      },
      status: 'published'
    });

    return { data: entry };
  },
}));