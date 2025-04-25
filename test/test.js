const _ = require('highland'),
    chai = require('chai'),
    parser = require('../lib/parser'),
    vfs = require('vinyl-fs');

let should = chai.should();

const filingPath = __dirname + '/data/';

const integrityFiling = filingPath + 'Kushner, Jared.pdf',
    fdmFiling = filingPath + 'Donnelly, Sally.pdf',
    fdOnlineFiling = filingPath + 'Mashburn, Lori K.pdf',
    transFiling = filingPath + 'Amy-A-Karpel-02.26.2025-278T.pdf',
    filingWTransactions = filingPath + 'Archeval Anthony - HRSA - Annual  - 278 - 2024 - 2024-02-28.pdf';

describe('lib/parser.js', () => {
    it('should find seven tables in Integrity filing', (done) => {
        parser(integrityFiling)
            .then((filings) => {
                filings[0].tables.length.should.equal(7);

                done();
            });
    }).timeout(4000);

    it('should find seven tables in example FDM filing', (done) => {
        parser(fdmFiling)
            .then((filings) => {
                filings[0].tables.length.should.equal(7);

                done();
            });
    });

    it('should find seven tables in example FDonline filing', (done) => {
        parser(fdOnlineFiling)
            .then((filings) => {
                filings[0].tables.length.should.equal(7);

                done();
            });
    });
    it('should find nine transactions in the Archeval example', (done) => {
        parser(filingWTransactions)
            .then((filings) => {
                filings[0].tables[3].rows.length.should.equal(34);
                Object.keys(filings[0].tables[3].rows[0]).length.should.equal(5);
                done();
            });
    });
    it('should find six transactions in the Karpel 278T PFD', (done) => {
        parser(transFiling)
            .then((filings) => {
                console.log("LOL", filings[0].tables[0]);
                // TODO: fix this the first row is always garbage
                filings[0].tables[0].rows.length.should.equal(7);
                Object.keys(filings[0].tables[0].rows[2]).length.should.equal(6);
                done();
            });
    });
});
