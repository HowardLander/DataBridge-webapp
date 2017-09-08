'use strict';

// Categories module config
angular.module('lanes').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Lanes', 'lanes', 'dropdown', '/lanes(/create)?');
        Menus.addSubMenuItem('topbar', 'lanes', 'List Lanes', 'lanes');
        Menus.addSubMenuItem('topbar', 'lanes', 'New Lane', 'lanes/create');
        Menus.addSubMenuItem('topbar', 'lanes', 'Execute A Lane', 'lanes/send');
	}
]);
