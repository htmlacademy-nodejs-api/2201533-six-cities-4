export type unionType = string|number|boolean;

export type GenerateConfig = {
  jsonURL: unionType;
  offersEnd: unionType;
  usersEnd: unionType;
  count: unionType,
  mockPath: unionType;
  isCreatePath: unionType;
  isCreateBig: unionType;
};
