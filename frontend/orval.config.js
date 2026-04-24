module.exports = {
    api: {
        input: '../openapi_new.json',
        output: {
            mode: 'tags-split',
            target: 'src/api/generated/endpoints.ts',
            schemas: 'src/api/generated/model',
            client: 'fetch',
        },
    },
};