type TComment = {
    _id: string,
    authorID: string,
    content: string,
    timestamp: number,
    reply: string,
    postID: string,
    hearts: string[],
}
export default TComment;