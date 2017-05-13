var extension = chrome.runtime.id;
var currencies = {};

function calculate() {
    $("tr:not(:first)").each(function () {
        var currency = $(this).children().eq(0).text();
        var val = currencies[currency].value;
        var amt = $("#" + currency + "-in").val();
        if (!amt)
            return;
        $("#" + currency + "-out").val(formatISK(Math.round(amt * val)));
    });
}

chrome.runtime.sendMessage(extension, {message: "currency"}, null, function (response) {
    if (response.error) {
        alert("Villa kom upp við að sækja gjaldmiðla, vinsamlegast prófið að endurhlaða síðunni.");
        return;
    }
    currencies = response.currencies;
    var toomany = false;
    for (key in currencies) {
        if (key == "AUD")
            toomany = true;
        var currency = currencies[key];
        var inputid = key + "-in";
        var outputid = key + "-out";
        var row = '<tr><td>' + key + '</td><td class="breyting">' + currency.styrkur + "%" + '</td><td>' + currency.value +
            '</td><td><input type="number" id="' + inputid +
            '"></input></td><td><input type="text" id="' + outputid +
            '"disabled style="text-align:right;"></input></td></tr>';
        var $row = $(row);
        if (toomany)
            $row.hide();
        $("#tafla tbody").append($row);
        $row.find("#" + inputid).on("input", function (input) {
            var self = $(this);
            var currency = self.attr("id").substr(0, 3);
            var value = Math.round(Number(self.val()) * currencies[currency].value);
            $("#" + currency + "-out").val(formatISK(value));
        });
    }
    var parts = currency.date.split(" ");
    var iceDate = 'Uppfært: ' + convertIce(parts[0]) + ' ' + parts[2] + '.' + ' ' + convertIce(parts[1]) + ' ' + parts[4];
    $(".DateUpdate").append('<p>' + iceDate + '<p>');
    litir();
});


document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('synameira');
    btn.addEventListener('click', function () {
        var isHidden = $('#tafla tr').is(':hidden');
        var takki = $("#synameira");
        if (isHidden) {
            $('#tafla tr:gt(9)').show();
            takki.text("Sýna færri");
        }
        else {
            $('#tafla tr:gt(9)').hide();
            takki.text("Sýna fleiri");
        }
    });
});

document.getElementById('stillingar').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('../views/options.html'));
    }
});

function litir() {
    $(".breyting").each(function () {
        var id = $(this).context.innerHTML;
        $(this).context.id = $(this).context.innerHTML.substr(0, id.length - 1);
        if ($(this).context.id >= 0) {
            $(this).context.className = "green";
        }
        else {
            $(this).context.className = "red";
        }
    });
}


function formatISK(str, sep) {
    str = String(str);
    if (sep === undefined)
        sep = ",";
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, sep) + " kr.";
}

function convertIce(day) {
    switch (day) {
        case "Mon":
            return "Mánudaginn";
            break;
        case "Tue":
            return "Þriðjudaginn";
            break;
        case "Wed":
            return "Miðvikudaginn";
            break;
        case "Thu":
            return "Fimmtudaginn";
            break;
        case "Fri":
            return "Föstudaginn";
            break;
        case "Sat":
            return "Laugardaginn";
            break;
        case "Sun":
            return "Sunnudaginn";
            break;
        case "Jan":
            return "Janúar";
            break;
        case "Feb":
            return "Febrúar";
            break;
        case "Mar":
            return "Mars";
            break;
        case "Apr":
            return "Apríl";
            break;
        case "May":
            return "Maí";
            break;
        case "Jun":
            return "Júní";
            break;
        case "Jul":
            return "Júlí";
            break;
        case "Aug":
            return "Ágúst";
            break;
        case "Sep":
            return "September";
            break;
        case "Oct":
            return "Október";
            break;
        case "Nov":
            return "Nóvember";
            break;
        case "Dec":
            return "Desember";
            break;
    }
}