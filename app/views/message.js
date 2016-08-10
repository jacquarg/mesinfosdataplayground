var app = null;

module.exports = Mn.ItemView.extend({
    tagName: 'div',
    template: require('views/templates/message'),

    ui: {
      message: '.display',
    },
    events: {
    },

    initialize: function() {
      app = require('application');
      this.listenTo(app, 'message:display', this.onDisplay);
      this.listenTo(app, 'message:hide', this.onHide);
    },

    onDisplay: function(message) {
      console.log("display");
      console.log(arguments);
      // this.$el.css('display', 'block');

      this.ui.message.text(message);
    },

    onHide: function() {
      console.log('hide');
      this.ui.message.empty();
      // $(this.el.css('display', 'none');

    }

});