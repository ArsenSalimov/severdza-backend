export class UserAlreadyExistException extends Error {
    constructor(userEmail: string) {
        super(`User with email: ${userEmail} already exist`);
    }
}