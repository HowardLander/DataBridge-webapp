'use strict';

// Categories module config
angular.module('signatures').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Signatures', 'signatures', 'dropdown', '/signatures(/create)?');
        Menus.addSubMenuItem('topbar', 'signatures', 'List Signatures', 'signatures');
        Menus.addSubMenuItem('topbar', 'signatures', 'New Signature', 'signatures/create');
        Menus.addSubMenuItem('topbar', 'signatures', 'Execute A Signature', 'signatures/send');
	}
]);
