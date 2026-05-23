// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import { sidebar } from './sidebar';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Typescript Course',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
      sidebar,
    }),
  ],
});
