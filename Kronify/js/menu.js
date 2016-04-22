var extension = "bjcblihlodinhnfgkmalbbhbjgjlbdga";
var currencies = {};

function calculate() {
	$("tr:not(:first)").each(function() {
		var currency = $(this).children().eq(0).text();
		var val = currencies[currency].value;
		var amt = $("#" + currency + "-in").val();
		if(!amt)
			return;
		$("#" + currency + "-out").val(Math.round(amt * val));
	});
}
chrome.runtime.sendMessage(extension, {message: "currency"}, null, function(response){
	if(response.error) {
		alert("Villa kom upp við að sækja gjaldmiðla, vinsamlegast prófið að endurhlaða síðunni.");
		return;
	}
	
	currencies = response.currencies;
	for(key in currencies) {
		var currency = currencies[key];
		var row = '<tr><td>' + key + '</td><td>' + currency.value + 
				  '</td><td><input type="number" id="' +  key + "-in" + 
				  '"></input></td><td><input type="number" id="' + key + "-out" +
				  '"readonly></input></td></tr>';
		$("#tafla tbody").append($(row));
	}
});

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('reikna');
    btn.addEventListener('click', function() {
        calculate();
    });
});

document.getElementById('stillingar').addEventListener('click', function() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('../views/options.html'));
	}
});