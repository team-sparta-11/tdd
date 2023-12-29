const typeOrmTransactional: any = jest.createMockFromModule(
  'typeorm-transactional',
);

typeOrmTransactional.Transactional = (): any => (): any => ({});
typeOrmTransactional.runOnTransactionCommit = (): any => (): any => ({});
typeOrmTransactional.runOnTransactionRollback = (): any => (): any => ({});
typeOrmTransactional.runOnTransactionComplete = (): any => (): any => ({});
typeOrmTransactional.initializeTransactionalContext = (): any => ({});

export = typeOrmTransactional;
