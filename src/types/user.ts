export type TUser = {
    id: string,
    username: string,
    discriminator: number,
    avatarURL: string,
    following: TUser[],
    permissions: string[]
}