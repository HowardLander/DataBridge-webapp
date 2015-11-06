'use strict';

// Categories module config
angular.module('db_actions').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Actions', 'db_actions', 'dropdown', '/actions(/create)?');
        Menus.addSubMenuItem('topbar', 'db_actions', 'List Actions', 'actions');
        Menus.addSubMenuItem('topbar', 'db_actions', 'New Action', 'actions/create');
	}
]);
