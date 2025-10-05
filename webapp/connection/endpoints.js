sap.ui.define([], () => {
  "use strict";

  /**
   * Escolha UMA base:
   *  A) Usando o caminho padrão do approuter para Destinations (mais simples):
   *     /destinations/AlfaCockpit/odata/v2/Catalog
   *  B) Se você tiver mapeado /api/** no xs-app.json:
   *     /api/odata/v2/Catalog
   */
  // A) padrão (recomendado agora):
  const BASE = "/destinations/AlfaCockpit/odata/v2/Catalog";
  // B) se usar rota no xs-app.json, troque para:
  // const BASE = "/api/odata/v2/Catalog";

  return {
    BASE,
    // Users (Nível 1)
    USERS: `${BASE}/Users`,
    USER_BY_ID: (id) => `${BASE}/Users/${id}`,

    // (Nível 2+) — Roles e Role Collections (já deixo prontos)
    ROLES: `${BASE}/Roles`,
    ROLE_BY_ID: (id) => `${BASE}/Roles/${id}`,
    ROLE_COLLECTIONS: `${BASE}/RoleCollections`,
    ROLE_COLLECTION_BY_ID: (id) => `${BASE}/RoleCollections/${id}`,
    USER_ROLE_COLLECTIONS: `${BASE}/UserRoleCollections`,
    USER_ROLE_COLLECTION_BY_ID: (id) => `${BASE}/UserRoleCollections/${id}`,
    ROLE_COLLECTION_ROLES: `${BASE}/RoleCollectionRoles`,
    ROLE_COLLECTION_ROLE_BY_ID: (id) => `${BASE}/RoleCollectionRoles/${id}`
  };
});
