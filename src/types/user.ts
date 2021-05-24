type TUser = {
    discordID: string,
    username: string,
    discriminator: number,
    avatarURL: string,
    description: string,
    point: number,
    following: string[],
    permissions: string[],
    badges: string[]
};
export default TUser;