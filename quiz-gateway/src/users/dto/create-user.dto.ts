export class CreateUserDto {
    constructor (
        public email: string,
        public first_name: string,
        public last_name: string,
        public password: string,

    ) {}
}
