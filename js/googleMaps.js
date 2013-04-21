/////////////////////////////////////////////////////////
// Copyright © 2013 Vernon de Goede & Ilija Ivankovic  //
/////////////////////////////////////////////////////////

// Maak wat arrays aan waarin de vragen bewaard kunnen worden
var keys = [];
var vragen = [];
var antwoorden = [];
var longlat = [];

// Zet de questioncounter op nul. Deze wordt bij het opstarten op 1 gezet
var questionCounter = 0;

// Houd het aantal (on)juiste antwoorden bij
var fouteAntwoorden = 0;
var correcteAntwoorden = 0;

// Sla vraag en antwoord van dit moment op. Staat standaard op null
var vraag = null;
var antwoord = null;

// Haal een lijst met vragen op in JSON formaat van de server. Deze moeten in een array worden gezet. Ook moet de overhoring worden opgestart
$(document).ready(function() {
	var index = 0;
	
	$.ajax({ 
    type: 'GET', 
    url: 'http://vernonweb.nl/topografie/request/getList.php', 
    data: { get_param: 'value' }, 
    dataType: 'json',
    success: function (data) {
        $.each(data, function(antwoord, vraag) {
			index++;
			keys.push(index);
            vragen.push(vraag);
			antwoorden.push(antwoord);

			// TIJDELIJK 
			// Laat antwoorden in console log zien voor test doeleinden
			console.log(index + ' Hoe heet deze plaats in ' + vraag + '? Het antwoord is: ' + antwoord + '. De coordinaten hiervan zijn: ');
			
        });
		console.log(data[1]);
		// Start overhoring en verhoog de questionCounter met 1
		startOverhoring();
		
		// Check if enter toets is ingedrukt en antwoord wordt verzonden
		$('.antwoord').keypress(function(e) {
			if(e.which == 13) {
				controleerVraag();	
			}
		});
		$(".check-antwoord").click(function() {
			controleerVraag();
		});
    }
	});
});

// Geef de voortgang weer in de zijbalk
function showTotalQuestions() {
	$('div.voortgang').html('<p><small><i>Vraag ' + questionCounter + ' van de ' + getTotalQuestions() + '</i></small></p>');
}

// Geef aantal correcte antwoorden weer in de zijbalk
function showCorrectAnswers() {
	$('div.score-juist').html('<strong>Goede antwoorden:</strong> ' + correcteAntwoorden);
}

// Geef aantal foute antwoorden weer in de zijbalk
function showIncorrectAnswers() {
	$('div.score-onjuist').html('<strong>Foute antwoorden:</strong> ' + fouteAntwoorden);
}

// Geef terug hoeveel vragen er in totaal beschikbaar zijn
function getTotalQuestions() {
	var arrayLength = vragen.length;
	return arrayLength;
}

// Geef terug hoeveel vragen er nog gemaakt moeten worden
function getRemainingQuestions() {
	var totalQuestions = getTotalQuestions();
	var currentQuestion = getQuestionNumber();
	var remainingQuestions = totalQuestions - currentQuestion;
	return remainingQuestions;
}

// Geef terug op welke vraag we nu zitten
function getQuestionNumber() {
	return questionCounter;
}

// Geef de vraag terug
function getVraag() {
	vraag = vragen[getQuestionNumber() - 1]
	return vragen[getQuestionNumber() - 1];
}

// Geef het juiste antwoord terug
function getAntwoord() {
	return antwoorden[getQuestionNumber() - 1];
}

// Geef de vraag weer in de zijbalk
function stelVraag() {
	vraag = 'Wat is de naam van de gemarkeerde plaats in ' + getVraag() + '?';
	antwoord = getAntwoord();
	$('div.de-vraag').html('<p>' + vraag + '</p>');
}

// Controleer de vraag
function controleerVraag() {
	var inputAntwoord = $('.antwoord').val();
	// Om antwoorden enigzins gelijk te maken wordt de vergelijking alleen gedaan met antwoorden zonder hoofdletters
	if(antwoord.toLowerCase() == inputAntwoord.toLowerCase()) {
		correcteAntwoorden++;
	}else{
		fouteAntwoorden++;
	}
	alert('De vraag was: ' + vraag + ' Het juiste antwoord was: ' + antwoord + '. Jij vulde in: ' + inputAntwoord);
		
	// Ga niet naar de volgende vraag als we bij de laatste vraag aangekomen zijn. Anders kloppen de tellers niet meer.
	if(parseInt(getRemainingQuestions()) !== 0) {
		// Ga naar de volgende vraag
		volgendeVraag();
	}else{
		// Schakel antwoord veld uit
		$(".antwoord").attr("disabled", "disabled");
		showTotalQuestions();
		showCorrectAnswers();
		showIncorrectAnswers();
		$.mobile.changePage('#dialog', 'pop', true, true);
	}
}

function geocodeAddress() {
	$.ajax({
    url: 'http://maps.googleapis.com/maps/api/geocode/json',
    data: {
        sensor: false,
        address: 'Amsterdam'
    },
    dataType:'jsonp',
    success: function (data) {
        alert(data)
    }
	});
}

function genereerAfbeelding() {
	var address = antwoord;
	var src = 'http://maps.googleapis.com/maps/api/staticmap?center=' + address + '&zoom=8&size=470x260&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&sensor=false&scale=2&style=feature:all|element:labels|visibility:off'
    $('.overhoor-afbeelding').attr("src", src);
}

// Ga naar de volgende vraag. Verhoog de questionCounter en stel de volgende vraag
function volgendeVraag() {
	vraag = null;
	antwoord = null;
	
	// Reset inputbox met het antwoord
	$(".antwoord").val('');
	
	if(parseInt(getRemainingQuestions()) !== 0) {
		questionCounter++;	
		showTotalQuestions();
		showCorrectAnswers();
		showIncorrectAnswers();
		// Eerst moeten de vragen worden samengesteld, dan pas kan de afbeelding worden gegenereerd. Anders is de locatie die op de afbeelding weergeven moet worden nog steeds null.
		stelVraag();
		genereerAfbeelding();
	}else{
		alert("Overhoring is afgelopen.");
	}
}

// Start de overhoring. Verhoog het vraagnummer en weergeef de eerste vraag op het scherm.
function startOverhoring() {
	questionCounter++;
	showTotalQuestions();
	showCorrectAnswers();
	showIncorrectAnswers();
	stelVraag();
}