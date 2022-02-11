import { EquivalenceModule } from './equivalence.module';

describe('EquivalenceModule', () => {
    let equivalenceModule: EquivalenceModule;

    beforeEach(() => {
        equivalenceModule = new EquivalenceModule();
    });

    it('should create an instance', () => {
        expect(equivalenceModule).toBeTruthy();
    });
});
