export type backgroundStorage = {
    name: string,
    id: string,
    updated_at: string,
    created_at: string,
    last_accessed_at: string,
    metadata: metaData,
}

type metaData = {
    eTage: string,
    size: number,
    mimetype: string,
    cacheControl: string,
    lastModified: string,
    contentLength: number,
    httpStatusCode: number,
}
