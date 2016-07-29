import { Jwt } from './jwt';

declare const expect, it, describe;

const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFAYS5jb20ifQ.lA1UjBwRnDZJHn0sL3aLnGB0jIcZ4UdqaYvR9JvMcp4';

describe('JWT', () => {

    it('Create a JWT from a string', () => {
        const jwt = new Jwt(jwtToken);
        expect(jwt.alg).toBe('HS256');
        expect(jwt.user).toBe('a@a.com');
    });
});
