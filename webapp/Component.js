sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "com/alfa/cockpit/cockpitusers/model/models"
], (UIComponent, JSONModel, models) => {
  "use strict";

  return UIComponent.extend("com.alfa.cockpit.cockpitusers.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },

    init() {
      // base init
      UIComponent.prototype.init.apply(this, arguments);

      // models globais
      this.setModel(models.createDeviceModel(), "device"); // já existe no seu projeto
      this.setModel(new JSONModel({}), "view");            // <- usado pelas views/controllers

      // inicia o roteamento (FCL injeta as páginas)
      this.getRouter().initialize();
    }
  });
});
