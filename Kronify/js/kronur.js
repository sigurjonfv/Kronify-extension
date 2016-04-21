var extension = "eiknfipkcokbpjelfhkhlgjlgkgomoem";
var currencies = {};
var currencyQueries = [
	{
		currency: "USD",
		regex: /\$([0-9]{1,3}(?:,?[0-9]{3})*)(?:\.([0-9]{2}))?/g
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

				if(tooltip == "")
					val += tooltip;
				else
					val += tooltip + "\n";
				return match;
		 	});
	 	}
	 }
	 return val;
}

/* Change context menu on right click */
document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = window.getSelection().toString();
    if(selected != "") {
    	var title = findTooltips(selected);
    	title = title.replace(/\r?\n|\r/g, " ");
    	if(title == "") title = "Engir gjaldmiðlar fundust";
        chrome.extension.sendMessage({
               "message": "context", 
               "selection": selected,
               "title": title
            });
    }
}, true);

/* To insert tooltips */
chrome.runtime.sendMessage(extension, {message: "currency"}, null, function(response){
	currencies = response.currencies;
	$("span, td, p,div:has(>span)").each(function() {
		var self = $(this);
		var str = self.text();
		var tooltip = findTooltips(str);
		if(tooltip != "")
			self.prop("title", tooltip + self.prop("title"));
	});
});