/////////////////////////////////////////////////////////
// Copyright © 2013 Vernon de Goede & Ilija Ivankovic  //
/////////////////////////////////////////////////////////

// Maak wat arrays aan waarin de vragen bewaard kunnen worden

var vragen = [];
var antwoorden = [];
var geoNames = [];
var soortLocatie = [];
var zoomLevels = [];

var overhoringAfgelopen = false;

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
	if(window.location.hash) {
		var hash = window.location.hash.split("#");
		if(hash[1] !== "&ui-state=dialog") {
		var index = 0;
		
		$.ajax({ 
		type: 'GET', 
		url: 'http://vernonweb.nl/topografie/request/getList.php?test=' + hash[1], 
		data: { get_param: 'value' }, 
		dataType: 'json',
		success: function (data) {
			$.each(data, function() {
				vragen.push(data[index][1]);
				antwoorden.push(data[index][0]);
				geoNames.push(data[index][2]);
				soortLocatie.push(data[index][3]);
				zoomLevels.push(data[index][4]);
				// TIJDELIJK 
				// Laat antwoorden in console log zien voor test doeleinden
				console.log(index + ' Hoe heet deze plaats in ' + data[index][1] + '? Het antwoord is: ' + data[index][0] + '. De Google Maps naam hiervan is: ' + data[index][2] + '. Het zoomlevel van de afbeelding is: ' + data[index][3]);
				index++;
			});
			// Start overhoring en verhoog de questionCounter met 1
			startOverhoring();
			
			// Check if enter toets is ingedrukt en antwoord wordt verzonden
			$('.antwoord').keypress(function(e) {
				if(e.which == 13) {
					$('.feedback-antwoord').html('').fadeOut(200);
					controleerVraag();	
				}else{
					$('.feedback-antwoord').html('').fadeOut(200);
				}
			});
			$(".check-antwoord").click(function() {
				controleerVraag();
			});
		}
		});
	}else{
		alert("Er ging iets fout! Je wordt teruggebracht naar het overzicht.");
	}	
	// Foutmelding wanneer er geen hash aanwezig is.
	}else{
		alert("Er ging iets fout! Je wordt teruggebracht naar het overzicht.");
	}
});

// Geef de voortgang weer in de zijbalk
function showTotalQuestions() {
	$('div.voortgang').html('<p><small><i>Vraag ' + questionCounter + ' van de ' + getTotalQuestions() + '</i></small></p>');
}

// Geef aantal correcte antwoorden weer in de zijbalk
function showCorrectAnswers() {
	// $('div.score-juist').html(correcteAntwoorden);
	$('div.score-juist').fadeOut(200, function() {
        $(this).text(correcteAntwoorden).fadeIn(200);
    });
}

// Geef aantal foute antwoorden weer in de zijbalk
function showIncorrectAnswers() {
	// $('div.score-onjuist').html(fouteAntwoorden);
	$('div.score-onjuist').fadeOut(200, function() {
		$(this).text(fouteAntwoorden).fadeIn(200);
	});
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
	vraag = 'Wat is de naam van de gemarkeerde ' + soortLocatie[getQuestionNumber() - 1] + ' in ' + getVraag() + '?';
	antwoord = getAntwoord();
	$('div.de-vraag').html('<p>' + vraag + '</p>');
}

// Controleer de vraag
function controleerVraag() {
	var inputAntwoord = $('.antwoord').val();
	// Om antwoorden enigzins gelijk te maken wordt de vergelijking alleen gedaan met antwoorden zonder hoofdletters
	if(antwoord.toLowerCase() == inputAntwoord.toLowerCase()) {
		var complimenten = new Array();
		complimenten[0] = "Goed gedaan!";
		complimenten[1] = "Helemaal goed!";
		complimenten[2] = "Dat is het juiste antwoord!";
		complimenten[3] = "Toppie!";
		complimenten[4] = "Niks op aan te merken!";
		complimenten[5] = "Gaat de goede kant op!";
		complimenten[6] = "Goed zo! Nog even volhouden.";
		complimenten[7] = "Heel goed!";
		complimenten[8] = "Super!";
		complimenten[9] = "Klasse!";
		complimenten[10] = "Dat is het juiste antwoord!";

	
		var feedback = '<hr /><p>' + complimenten[Math.floor((Math.random()*10)+1)] + '</p>';
		$('.feedback-antwoord').fadeIn(200, function() {
			$(this).html(feedback).delay(3000).fadeOut(200);
		});
		correcteAntwoorden++;
	}else{
		 var feedback = '<hr /><p><strong>Juiste antwoord:</strong> ' + antwoord + '</p><p><strong>Jouw antwoord:</strong> ' + inputAntwoord + '</p>';
		$('.feedback-antwoord').fadeIn(200, function() {
			$(this).html(feedback).delay(4000).fadeOut(200);
		});
		fouteAntwoorden++;
	}
	// alert('De vraag was: ' + vraag + ' Het juiste antwoord was: ' + antwoord + '. Jij vulde in: ' + inputAntwoord);
		
	// Ga niet naar de volgende vraag als we bij de laatste vraag aangekomen zijn. Anders kloppen de tellers niet meer.
	if(parseInt(getRemainingQuestions()) !== 0) {
		// Ga naar de volgende vraag
		volgendeVraag();
	}else{
		// Schakel antwoord veld uit
		overhoringAfgelopen = true;
		$('#container-antwoord').remove();
		$(".antwoord").attr("disabled", "disabled");
		showTotalQuestions();
		showCorrectAnswers();
		showIncorrectAnswers();
		
		// Rond de overhoring af en laat een dialoog zien met eindresultaat
		$('.final-juist').html(correcteAntwoorden);
		$('.final-onjuist').html(fouteAntwoorden);
		$.mobile.changePage( "#dialoog", { role: "dialog", transition: "flip", } );
	}
}

function genereerAfbeelding() {
	var zoom = zoomLevels[getQuestionNumber() - 1];
	var afbeeldingBreedte = Math.round(parseInt($('.overhoor-afbeelding').width()) / 2);
	// alert(afbeeldingBreedte);
	var address = geoNames[getQuestionNumber() - 1];
	var src = 'http://maps.googleapis.com/maps/api/staticmap?center=' + address + '&zoom=' + zoom + '&size=' + afbeeldingBreedte + 'x215&markers=color:red|' + address + '&sensor=false&scale=2&style=feature:all|element:labels|visibility:off'
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
	genereerAfbeelding();
}