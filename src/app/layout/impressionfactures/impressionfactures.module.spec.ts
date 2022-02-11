import { ImpressionFacturesModule } from './impressionfactures.module';

describe('ImpressionFacturesModule', () => {
    let impressionfacturesModule: ImpressionFacturesModule;

    beforeEach(() => {
        impressionfacturesModule = new ImpressionFacturesModule();
    });

    it('should create an instance', () => {
        expect(impressionfacturesModule).toBeTruthy();
    });
});
