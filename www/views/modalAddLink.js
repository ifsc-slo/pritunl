define([
  'jquery',
  'underscore',
  'backbone',
  'models/link',
  'views/modal',
  'text!templates/modalAddLink.html'
], function($, _, Backbone, LinkModel, ModalView, modalAddLinkTemplate) {
  'use strict';
  var ModalAddLinkView = ModalView.extend({
    className: 'add-link-modal',
    template: _.template(modalAddLinkTemplate),
    title: 'Add Link',
    okText: 'Add',
    events: function() {
      return _.extend({
        'click .ipv6-toggle': 'onIpv6Select',
        'click .host-check-toggle': 'onHostCheckSelect'
      }, ModalAddLinkView.__super__.events);
    },
    body: function() {
      return this.template();
    },
    getIpv6Select: function() {
      return this.$('.ipv6-toggle .selector').hasClass('selected');
    },
    setIpv6Select: function(state) {
      if (state) {
        this.$('.ipv6-toggle .selector').addClass('selected');
        this.$('.ipv6-toggle .selector-inner').show();
      }
      else {
        this.$('.ipv6-toggle .selector').removeClass('selected');
        this.$('.ipv6-toggle .selector-inner').hide();
      }
    },
    onIpv6Select: function() {
      this.setIpv6Select(!this.getIpv6Select());
    },
    getHostCheckSelect: function() {
      return this.$('.host-check-toggle .selector').hasClass('selected');
    },
    setHostCheckSelect: function(state) {
      if (state) {
        this.$('.host-check-toggle .selector').addClass('selected');
        this.$('.host-check-toggle .selector-inner').show();
      }
      else {
        this.$('.host-check-toggle .selector').removeClass('selected');
        this.$('.host-check-toggle .selector-inner').hide();
      }
    },
    onHostCheckSelect: function() {
      this.setHostCheckSelect(!this.getHostCheckSelect());
    },
    onOk: function() {
      var name = this.$('.name input').val();
      var linkType = this.$('.link-type select').val();
      var ipv6 = this.getIpv6Select();
      var hostCheck = this.getHostCheckSelect();
      var linkAction = this.$('.link-action select').val();

      if (!name) {
        this.setAlert('danger', 'Name can not be empty.', '.name');
        return;
      }

      this.setLoading('Adding link...');
      var model = new LinkModel();
      model.save({
        name: name,
        type: linkType,
        ipv6: ipv6,
        host_check: hostCheck,
        action: linkAction
      }, {
        success: function() {
          this.close(true);
        }.bind(this),
        error: function(model, response) {
          this.clearLoading();
          if (response.responseJSON) {
            this.setAlert('danger', response.responseJSON.error_msg);
          }
          else {
            this.setAlert('danger', this.errorMsg);
          }
        }.bind(this)
      });
    }
  });

  return ModalAddLinkView;
});
