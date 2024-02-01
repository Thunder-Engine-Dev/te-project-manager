export type Plugin = {
  authors: string[],
  category: string,
  credits: {
    graphics?: string[],
    sounds?: string[],
  },
  description: string,
  id: string,
  longDescription: string,
  name: string,
  url: string,
}

export const unknownPlugin = (id: string): Plugin => ({
  authors: ['unknown'],
  category: 'unknown',
  credits: {},
  description: 'Unknown module',
  id,
  longDescription: 'This plugin is not listed in the official metadata repository.',
  name: 'Unknown module',
  url: '',
});

export type Contributor = {
  avatar: string,
  discord: string[],
  github: string,
  username: string,
}

export type PluginRepo = {
  categories: string[],
  contributors: { [key: string]: Contributor },
  plugins: Plugin[],
}

export type GlobalState = {
  currentProject: string,
  repo: PluginRepo | null,
}
