const typeOrmTransactional = jest.createMockFromModule(
  './typeorm-transactional',
);

typeOrmTransactional.Transactional = () => () => ({});
typeOrmTransactional.runOnTransactionCommit = () => () => ({});
typeOrmTransactional.runOnTransactionRollback = () => () => ({});
typeOrmTransactional.runOnTransactionComplete = () => () => ({});
typeOrmTransactional.initializeTransactionalContext = () => ({});

module.exports = typeOrmTransactional;
