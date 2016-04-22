var extension = "pighpacghcmkngfbmbpkgbnmidaepapn";
var currencies = {};

function calculate() {
	$("tr:not(:first)").each(function() {
		var currency = $(this).children().eq(0).text();
		var val = currencies[currency].value;
		var amt = $("#" + currency + "-in").val();
		if(!amt)
			return;
		$("#" + currency + "-out").val(formatISK(Math.round(amt * val)));
	});
}

chrome.runtime.sendMessage(extension, {message: "currency"}, null, function(response){
	if(response.error) {
		alert("Villa kom upp við að sækja gjaldmiðla, vinsamlegast prófið að endurhlaða síðunni.");
		return;
	}
	currencies = response.currencies;
	var toomany = false;
	for(key in currencies) {
		if(key == "AUD")
			toomany = true;

		var currency = currencies[key];
		var inputid = key + "-in";
		var outputid = key + "-out";

		var row = '<tr><td>' + key + '</td><td>' + currency.value + 
				  '</td><td><input type="number" id="' +  inputid + 
				  '"></input></td><td><input type="text" id="' + outputid +
				  '"disabled style="text-align:right;"></input></td></tr>';
		var $row = $(row);
		if(toomany)
			$row.hide();

		$("#tafla tbody").append($row);
		$row.find("#" + inputid).on("input", function(input) {
			var self = $(this);
			var currency = self.attr("id").substr(0, 3);
			var value = Math.round(Number(self.val()) * currencies[currency].value);
			$("#" + currency + "-out").val(formatISK(value));
		})
	}
});

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('synameira');
    btn.addEventListener('click', function() {
        $("#tafla tr").show();
    });
});

document.getElementById('stillingar').addEventListener('click', function() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL('../views/options.html'));
	}
});

function formatISK(str, sep) {
	str = String(str);
	if(sep === undefined)
		sep = ",";
	return str.replace(/\B(?=(\d{3})+(?!\d))/g, sep) + " kr.";
}