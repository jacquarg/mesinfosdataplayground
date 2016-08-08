var GroupsView = require('lib/groupsview');

module.exports = GroupsView.extend({
  tagName: 'ul',
  groupBy: 'name',
  comparator: function(a, b) {
    return (a.get('createdAt') < b.get('createdAt')) ? 1: -1;
  },

  childView: require('views/dsview'),
});
