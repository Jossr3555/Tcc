import { PersonUser } from '../PageLogin';

export function getStudent() {
    const PrimeyName = PersonUser.name.split(/ (.+)/)[0];

    return {
        name: PersonUser.name,
        PrimeyName: PrimeyName,
        rm: PersonUser.rm,
        email: PersonUser.email,
        ano: PersonUser.ano,
    };
}