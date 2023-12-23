
// Interface to Journal
define([], function() {

	var journal = {};

	var entries = [];

	// Load journal
	journal.load = function() {
		return new Promise(function(resolve, reject) {
			let user = sugarizer.modules.settings.getUser();
			if (user == null) {
				reject();
			}

			// TODO: In the app, get the journal locally
			if (sugarizer.getClientType() === sugarizer.constant.appType) {
				entries = [];
				resolve();
				return;
			}

			// Load journal from server
			sugarizer.modules.server.getJournal(user.privateJournal, { limit: 100 }).then((journal) => {
				entries = journal.entries.sort((a, b) => {
					return new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp);
				});
				resolve();
			}, (error) => {
				console.error('Unable to load the journal, error ' + error);
				reject();
			});
		});
	}

	// Get entries
	journal.get = function() {
		return entries;
	}

	// Get entries by activity
	journal.getByActivity = function(activity) {
		return entries.filter((entry) => entry.metadata.activity == activity);
	}
	
	return journal;
});