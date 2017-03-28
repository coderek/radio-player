/* tslint:disable:no-unused-variable */

import { trim } from './util.service';

describe('UtilService', () => {
    it('should pass', ()=> {
        expect(trim(".  'abc...'", " .'")).toBe("abc");
    });
});
