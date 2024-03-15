import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
        'http://localhost:8000/subgraphs/name/battleroyale/punkships': {
        headers: { },
      },
    },
  ],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      documents: ['src/**/*.tsx'],
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
