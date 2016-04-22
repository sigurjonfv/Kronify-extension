var extension = "pighpacghcmkngfbmbpkgbnmidaepapn";
var options = {};

var currencies = {};
var currencyQueries = [
	{
		currency: "USD",
		regex: /\$\s?([0-9]{1,3}(?:,?[0-9]{3})*)(?:\.([0-9]{2}))?/g
	},
	{
		currency: "GBP",
		regex: /(?:£|￡|GBP)\s?([0-9]{1,3}(?:,?[0-9]{3})*)(?:\.([0-9]{2}))?/g
	},
	{
		currency: "EUR",
		regex: /(?:€|EUR)\s?([0-9]{1,3}(?:.?[0-9]{3})*)(?:\,([0-9]{2}))?/g
	}
];

function formatISK(str, sep) {
	return str.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

function findTooltips(str) {
	var val = "";
	for(var i = 0; i < currencyQueries.length; i++) {
		var currency = currencyQueries[i].currency;
		var regex = currencyQueries[i].regex;
		var iskToCurrency = currencies[currency].value;

		if(str != undefined && str.search(regex) != -1) {
		 	str = str.replace(regex, function(match, whole, parts) {
		 		whole = whole.replace(/\D/g, "");
		 		if(parts == undefined) parts = 0;

				var isk = Math.round((Number(whole) + Number(parts) / 100) * iskToCurrency);
				var tooltip = match + " = " + formatISK(String(isk), ".") + " kr.";

				if(val == "")
					val += tooltip;
				else
					val += "\n" + tooltip;
				return match;
		 	});
	 	}
	 }
	 return val;
}

chrome.storage.sync.get("tooltips", function(items) {
	options.showTooltips = items.tooltips;
});

chrome.storage.onChanged.addListener(function(changes) {
	for (key in changes) {
		var storageChange = changes[key];
		if(key == tooltips) {
			options.showTooltips = storageChange.newValue;
		}
	}
});

/* Change context menu on right click */
document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = window.getSelection().toString();
    if(selected != "") {
    	var title = findTooltips(selected);
    	title = title.replace(/\r?\n|\r/g, " ");
    	if(title == "")  {
    		title = "Engir gjaldmiðlar fundust";
    	}
        chrome.extension.sendMessage({
           "message": "context", 
           "selection": selected,
           "title": title
        });
    }
}, true);

/* To insert tooltips */
chrome.runtime.sendMessage(extension, {message: "currency"}, null, function(response){
	if(response.error) {
		alert("Villa kom upp við að sækja gjaldmiðla, vinsamlegast prófið að endurhlaða síðunni.");
		return;
	}
	
	currencies = response.currencies;
	if(options.showTooltips) {
		$("span, td, p, li:not(:has(*)), div:has(>span:not([title])), div:not(:has(*))").each(function() {
			var self = $(this);
			var str = self.text();
			if(str != "" && str.length < 100) {
				var tooltip = findTooltips(str);
				if(tooltip != "") {
					self.prop("title", tooltip + self.prop("title"));
				}
			}
		});
	}
});