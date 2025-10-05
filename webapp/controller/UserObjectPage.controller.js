sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "com/alfa/cockpit/cockpitusers/connection/endpoints",
  "com/alfa/cockpit/cockpitusers/connection/api"
], function (Controller, MessageBox, ENDPOINTS, api) {
  "use strict";

  return Controller.extend("com.alfa.cockpit.cockpitusers.controller.UserObjectPage", {

    onInit: function () {
      this.getOwnerComponent().getRouter().getRoute("userDetail")
        .attachPatternMatched(this._onMatched, this);
    },

    _onMatched: async function (oEvent) {
      const userId = oEvent.getParameter("arguments").userId;
      try {
        const res = await api.get(ENDPOINTS.USER_BY_ID(userId));
        const user = res?.value || res?.d || res; // diferentes formatos
        this.getView().getModel("view").setData(user, true);
      } catch (e) {
        MessageBox.error("Falha ao carregar detalhes do usuário", { details: e.message });
      }
    }
  });
});
