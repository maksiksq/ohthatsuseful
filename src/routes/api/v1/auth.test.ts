import {describe, it, expect} from "vitest";
import {checkKey} from "$lib/utils/checkKey";
import SECRET_API_CONTROL_KEY from '$env/static/private';


describe('checkJWT', () => {
    it('fails if no header', () => {
        expect(checkKey(null)).toBe(false);
    });

    it('fails if not bearer token', () => {
        expect(checkKey('Something else')).toBe(false);
    });

    it('fails if key is wrong', () => {
        expect(checkKey('Bearer wrong jwt')).toBe(false);
    })

    it('passes if the key is correct', () => {
        expect(checkKey(`Bearer ${SECRET_API_CONTROL_KEY}`))
    })
});