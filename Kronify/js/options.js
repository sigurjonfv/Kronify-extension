// Saves options to chrome.storage
function save_options() {
	var tooltips = document.getElementById('tooltip').checked;
	chrome.storage.sync.set({
		tooltips: tooltips
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Stillingar vistaðar';
		setTimeout(function() {
			status.textContent = '';
		}, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		tooltips: true
	}, function(items) {
		document.getElementById('tooltip').checked = items.tooltips;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);