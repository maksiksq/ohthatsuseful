import {describe, it, expect} from "vitest";
import {checkJWT} from "$lib/utils/checkJWT";
import SECRET_CONTROL_JWT from '$env/static/private';


describe('checkJWT', () => {
    it('fails if no header', () => {
        expect(checkJWT(null)).toBe(false);
    });

    it('fails if not bearer token', () => {
        expect(checkJWT('Something else')).toBe(false);
    });

    it('fails if jwt is wrong', () => {
        expect(checkJWT('Bearer wrong jwt')).toBe(false);
    })

    it('passes if the token is correct', () => {
        expect(checkJWT(`Bearer ${SECRET_CONTROL_JWT}`))
    })
});