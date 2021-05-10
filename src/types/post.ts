type TPost = {
    authorID: string,
    title: string,
    content: string,
    category: string,
    timestamp: number,
    views: number,

    tag: string[],
    comments: string[]
}
export default TPost;