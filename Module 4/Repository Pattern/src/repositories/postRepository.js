// Storage adapter for posts. Services depend only on this five-operation contract.
//
// Storage swap note:
// When this repository is replaced by a Prisma-backed adapter, only this file's
// storage implementation (and database setup) should change. The service layer,
// controllers, routes, business rules, and HTTP response behavior remain unchanged
// because the exported findAll/findById/create/update/remove contract is stable.

const records = new Map([
  [1, { id: 1, title: 'First post', body: 'Repository boundaries protect change.', authorId: 7 }],
  [2, { id: 2, title: 'Second post', body: 'Services should speak in domain language.', authorId: 8 }],
]);

let nextId = 3;

function copy(record) {
  return record ? { ...record } : null;
}

function normalizeId(id) {
  return Number(id);
}

function findAll() {
  // Return a new array and copies, not a reference to the repository's collection.
  return Array.from(records.values(), (record) => ({ ...record }));
}

function findById(id) {
  return copy(records.get(normalizeId(id)) || null);
}

function create(fields) {
  const record = {
    ...fields,
    id: nextId++,
  };

  records.set(record.id, record);
  return copy(record);
}

function update(id, patch = {}) {
  const key = normalizeId(id);
  const current = records.get(key);
  if (!current) return null;

  // Preserve the previous partial-update behavior: omitted/undefined fields stay unchanged.
  const definedPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  );
  const updated = { ...current, ...definedPatch, id: current.id };

  records.set(key, updated);
  return copy(updated);
}

function remove(id) {
  return records.delete(normalizeId(id));
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
