module.exports = {
    api: {
        input: '../openapi_new.json',
        output: {
            mode: 'tags-split',
            target: 'src/api/generated/endpoints.ts',
            schemas: 'src/api/generated/model',
            client: 'fetch', // Axios ではなく Fetch API を使用
            override: {
                mutator: {
                    path: './src/api/custom-fetch.ts', // 共通のヘッダー設定などが必要な場合
                    name: 'customFetch',
                },
            },
        },
    },
};