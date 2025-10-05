sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, MessageBox, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("com.alfa.cockpit.cockpitusers.controller.UsersList", {

    onInit: function () {
      // Model auxiliar para formulário do Dialog
      this.getView().setModel(new JSONModel({ form: { name: "", email: "", status: "enable" } }), "view");
    },

    // ========= Filtro por e-mail =========
    onEmailFilter: function (oEvent) {
      const q = (oEvent.getParameter("newValue") || oEvent.getParameter("query") || "").trim();
      const oBinding = this.byId("tblUsers").getBinding("items");
      if (!q) {
        oBinding.filter([]);
        return;
      }
      oBinding.filter([ new Filter("email", FilterOperator.Contains, q) ]);
    },

    // ========= Navegação para detalhe =========
    onItemPress: function (oEvent) {
      const oCtx = oEvent.getSource().getBindingContext();
      const oUser = oCtx.getObject();
      const sId = oUser.ID || oUser.Id || oUser.id; // aceita qualquer casing
      this.getOwnerComponent().getRouter().navTo("userDetail", { userId: sId });
    },

    // ========= Criar =========
    onCreate: function () {
      this._openUserDialog({ name: "", email: "", status: "enable" }, async (data) => {
        const oModel = this.getView().getModel(); // ODataModel V2 (anônimo)
        return new Promise((resolve) => {
          this.byId("page").setBusy(true);
          oModel.create("/Users", data, {
            success: () => {
              MessageToast.show("Usuário criado");
              oModel.refresh(true);
              this.byId("page").setBusy(false);
              resolve();
            },
            error: (e) => {
              this.byId("page").setBusy(false);
              MessageBox.error("Erro ao criar usuário", { details: e?.responseText || "" });
              resolve();
            }
          });
        });
      });
    },

    // ========= Editar =========
    onEdit: function (oEvent) {
      const oUser = oEvent.getSource().getParent().getBindingContext().getObject();
      const sId = oUser.ID || oUser.Id || oUser.id;

      this._openUserDialog(oUser, async (data) => {
        const oModel = this.getView().getModel();
        // serviço aceita /Users/<guid> (igual Postman). Mantemos esse formato:
        const sPath = "/Users/" + sId;

        return new Promise((resolve) => {
          this.byId("page").setBusy(true);
          oModel.update(sPath, data, {
            merge: false,           // envia PATCH/MERGE conforme config do modelo
            success: () => {
              MessageToast.show("Usuário atualizado");
              oModel.refresh(true);
              this.byId("page").setBusy(false);
              resolve();
            },
            error: (e) => {
              this.byId("page").setBusy(false);
              MessageBox.error("Erro ao atualizar usuário", { details: e?.responseText || "" });
              resolve();
            }
          });
        });
      });
    },

    // ========= Excluir =========
    onDelete: function (oEvent) {
      const oUser = oEvent.getSource().getParent().getBindingContext().getObject();
      const sId = oUser.ID || oUser.Id || oUser.id;
      const sPath = "/Users/" + sId;

      MessageBox.confirm(`Excluir o usuário "${oUser.name}"?`, {
        title: "Confirmação",
        onClose: (act) => {
          if (act !== MessageBox.Action.OK) return;
          const oModel = this.getView().getModel();
          this.byId("page").setBusy(true);
          oModel.remove(sPath, {
            success: () => {
              MessageToast.show("Usuário excluído");
              oModel.refresh(true);
              this.byId("page").setBusy(false);
            },
            error: (e) => {
              this.byId("page").setBusy(false);
              MessageBox.error("Erro ao excluir usuário", { details: e?.responseText || "" });
            }
          });
        }
      });
    },

    // ========= Dialog (criar/editar) =========
    _openUserDialog: function (data, onConfirm) {
      const vm = this.getView().getModel("view");
      vm.setProperty("/form", { ...data });

      if (!this._dlg) {
        this._dlg = new sap.m.Dialog({
          title: "Usuário",
          content: [
            new sap.ui.layout.form.SimpleForm({
              editable: true,
              content: [
                new sap.m.Label({ text: "Nome" }),
                new sap.m.Input({ value: "{view>/form/name}", placeholder: "john" }),
                new sap.m.Label({ text: "E-mail" }),
                new sap.m.Input({ value: "{view>/form/email}", type: "Email", placeholder: "john@email.com" }),
                new sap.m.Label({ text: "Status" }),
                new sap.m.SegmentedButton({
                  selectedKey: "{view>/form/status}",
                  items: [
                    new sap.m.SegmentedButtonItem({ key: "enable", text: "Ativo" }),
                    new sap.m.SegmentedButtonItem({ key: "disable", text: "Inativo" })
                  ]
                })
              ]
            })
          ],
          beginButton: new sap.m.Button({
            text: "Salvar",
            type: "Emphasized",
            press: async () => {
              const payload = vm.getProperty("/form");
              this._dlg.close();
              await onConfirm(payload);
            }
          }),
          endButton: new sap.m.Button({ text: "Cancelar", press: () => this._dlg.close() })
        });
        this.getView().addDependent(this._dlg);
      }
      this._dlg.open();
    }
  });
});
