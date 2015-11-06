'use strict';

// Categories module config
angular.module('messages').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Messages', 'messages', 'dropdown', '/messages(/create)?');
        Menus.addSubMenuItem('topbar', 'messages', 'List Messages', 'messages');
        Menus.addSubMenuItem('topbar', 'messages', 'New Message', 'messages/create');
        Menus.addSubMenuItem('topbar', 'messages', 'Send A Message', 'messages/send');
	}
]);
