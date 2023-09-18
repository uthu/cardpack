/* CUSTOM JQUERY */
/* PRELOADER */
document.onreadystatechange = function () {
	if (document.readyState === 'complete') {
		jQuery('.box-wrapper').addClass('loaded');
  		console.log('page loaded');
	}
}

document.onpageshow = function () {
	if (document.readyState === 'complete') {
		  jQuery('.box-wrapper').addClass('loaded');
  		console.log('onpageshow fired');
	}
}
var timer;
function onPageBack() { jQuery('.box-wrapper').addClass('loaded'); console.log('onPageBack')}

window.addEventListener('pageshow', function(event) {
    if (event.persisted)
        onPageBack();

    // avoid calling onPageBack twice if 'pageshow' event has been fired...
    if (timer)
        clearInterval(timer);
});

// when page is hidden, start timer that will fire when going back to the page...
window.addEventListener('pagehide', function() {
    timer = setInterval(function() {
        clearInterval(timer);
        onPageBack(); 
    }, 1000); 
}); 

/* UNLOADER */
addEventListener('beforeunload', (event) => {
    jQuery('.box-wrapper').removeClass('loaded');
    setTimeout(function(){
      //jQuery('.box-wrapper').addClass('loaded');
      //console.log("Removed loader!");
    },3000);
});
/* PRELOADER */
//document.onreadystatechange = function () {
//	if (document.readyState === 'complete') {
//		jQuery('.box-wrapper').addClass('loaded');
//  		console.log('page loaded');
//	}
//}
/* UNLOADER */
//addEventListener('beforeunload', (event) => {
//    jQuery('.box-wrapper').removeClass('loaded');
//	jQuery('.stickyRow').fadeOut();
//});

/* RESTORE LAST SESSION (before document ready state) */
var playerName = localStorage["playerName"]; // tallennettu data 1
var playerEmail = localStorage["playerEmail"]; // tallennettu data 2
//var playerProgress = localStorage["playerProgress"]; // tallennettu data 3
///var playerProgress = localStorage.getItem("playerProgress");

//var playerProgress = localStorage[playerProgress];
//playerProgress[0] = ("0");
//localStorage.setItem("playerProgress", JSON.stringify(playerProgress));
var playerStoredProgress = JSON.parse(localStorage.getItem("playerProgress"));
var playerProgressPoints = JSON.parse(localStorage.getItem("playerProgressPoints"));
var playerStoredSettings = JSON.parse(localStorage.getItem("playerSettings"));
var playerSaveDate = JSON.parse(localStorage.getItem("saveDate"));
var cardContent;
var cardPostType;
var cardPostCategory;
var cardExtraText;
var cardTitle;

var singleCardPost = 0;
var cardStatusVar = 0;
var randomCard;
var points = 0;
var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();
/*var outputDate = d.getFullYear() + '/' +
    ((''+month).length<2 ? '0' : '') + month + '/' +
    ((''+day).length<2 ? '0' : '') + day;*/
var outputDate = d.getFullYear() +  ((''+month).length<2 ? '0' : '') + month + ((''+day).length<2 ? '0' : '') + day;

/* IF DATA VALUE DOESN EXISTS RETURN DEFAULT */
if (playerName) {
	playerName = playerName.replaceAll('!X',' '); // player name whitespace replacement = "/X"
	console.log('Pelaajan nimi: '+playerName);
} else {
	playerName = 'Uusi pelaaja';
}

if (playerEmail) {
	//test
	console.log('Pelaajan email: '+playerEmail);
} else {
	playerEmail = 'empty';
}
if (playerStoredProgress) {
	//test
	console.log('Eteneminen: '+playerStoredProgress);
} else {
	playerStoredProgress = [];
}
if (playerProgressPoints) {
	//test
	console.log('Eteneminen: '+playerStoredProgress);
} else {
	playerProgressPoints = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
}
if (playerStoredSettings) {
	//test
	console.log('Asetukset: '+playerStoredSettings);
	if((playerStoredSettings[5] == 0 && playerStoredSettings[4] == 0)||(playerStoredSettings[0] == 0 && playerStoredSettings[1] == 0 && playerStoredSettings[2] == 0 && playerStoredSettings[3] == 0))
	{
		playerStoredSettings = [1,1,1,1,1,1];
		localStorage.setItem("playerSettings", JSON.stringify(playerStoredSettings));
	}
} else {
	playerStoredSettings = [1,1,1,1,1,1];
}
if (playerSaveDate) {
	//test
	console.log('Tallennus päivä: '+playerSaveDate);
} else {
	playerSaveDate = '20220101';
}


jQuery(function($) {
	getUrlParameters();
	console.log(playerStoredProgress.length);

	
	if ( playerEmail === 'empty' ) { playerEmail = ''; }
	$('#name').text(playerName);
	$('#playerName').val(playerName);
	$('#playerEmail').val(playerEmail);
	$('#email').text(playerEmail);
	//feedbackInfo();
	
	//Variables to check which post gallery is at page
	var numCards = $('.cards').length;
	var numCard = $('.card').length;

	// READ SAVED DATA
	$('#pelaajaNimi').text(playerName); // print player name
	//Player register popup
	if ( playerName === 'Uusi pelaaja') {
	//	$('.playerNameBox').hide();
		$('.playerInfoBox').show();
	}
	else{
		$('.playerNameBox').show();
		$('.playerInfoBox').hide();
	}
	if(playerStoredProgress.length >0 && (numCards>0||numCard>0)){
		playerProgress();
	}
	if(numCards>0||numCard>0){cardStatusAction();calcProgress();removeCards();}
	else{
		calcProgress();
	}
	
	// showProfileform
	$('#showProfileform').click(function() {$('.playerInfoBox').show();});
	$('.saveChanges').click(function() {location.reload();});
	
	$('.cardClear').click(function() {
		if( confirm("Oletko varma, että haluat nollata etenemisen?") ) {location.reload();}
		else {return false;}
	});
	
	
//################################################################################################################
//Filtering
//################################################################################################################	
	/* SCRIPTS FOR CARD DECK (archive) */
	$('.page-id-27').html(function() {
		if(playerStoredSettings[0]==0){
			$('.aivovoimaButton').removeClass('active');
		}
		if(playerStoredSettings[1]==0){
			$('.hyvatyoButton').removeClass('active');
		}
		if(playerStoredSettings[2]==0){
			$('.keskeytyksetButton').removeClass('active');
		}
		if(playerStoredSettings[3]==0){
			$('.palautuminenButton').removeClass('active');
		}
		if(playerStoredSettings[4]==0){
			$('.taskButton').removeClass('active');
		}
		if(playerStoredSettings[5]==0){
			$('.thinkButton').removeClass('active');
		}	

		filterCards();

		$('.filterButton').click(function() {
			$('.filterButton').removeClass('lastItem');
			if ( $(this).siblings('.filterButton.active').length > 0 ) {
				$(this).toggleClass('active');
				filterCards();
			} else {
				$(this).addClass('lastItem');
			}
		});
		
		/*
		$('.taskButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		$('.thinkButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		$('.aivovoimaButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		$('.hyvatyoButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		$('.keskeytyksetButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		$('.palautuminenButton').click(function() {
			$(this).toggleClass('active');
			filterCards();
		});
		*/
		
		//$('.menu-smart li').click(function() {filterCards();});
		function filterCards() {
			/*
			playerStoredSettings[0] Aivovoiman perusta
			playerStoredSettings[1] Hyvä työ aivoille
			playerStoredSettings[2] Keskeytykset - hukkaan heitettyä työaikaa
			playerStoredSettings[3] Palautumisen merkitys työssä
			playerStoredSettings[4] Tehtävä
			playerStoredSettings[5] Pohdintaa
			*/
			if($('.taskButton').hasClass('active') ){
				//$('.taskCard').removeClass('hiddenCard');
				if($('.aivovoimaButton').hasClass('active')){
					$('.aivovoimaCard.taskCard').removeClass('hiddenCard');
					playerStoredSettings[0] = 1;
				}
				else {
					$('.aivovoimaCard.taskCard').addClass('hiddenCard');
					playerStoredSettings[0] = 0;
				}
	
				if($('.hyvatyoButton').hasClass('active')){
					$('.hyvatyoCard.taskCard').removeClass('hiddenCard');
					playerStoredSettings[1] = 1;
				}
				else {
					$('.hyvatyoCard.taskCard').addClass('hiddenCard');
					playerStoredSettings[1] = 0;
				}
	
				if($('.keskeytyksetButton').hasClass('active')){
					$('.keskeytyksetCard.taskCard').removeClass('hiddenCard');
					playerStoredSettings[2] = 1;
				}
				else {
					$('.keskeytyksetCard.taskCard').addClass('hiddenCard');
					playerStoredSettings[2] = 0;
				}
	
				if($('.palautuminenButton').hasClass('active')){
					$('.palautuminenCard.taskCard').removeClass('hiddenCard');
					playerStoredSettings[3] = 1;
				}
				else {
					$('.palautuminenCard.taskCard').addClass('hiddenCard');
					playerStoredSettings[3] = 0;
				}
				//$('.taskCard').removeClass('hiddenCard');
				playerStoredSettings[4] = 1;
			}
			else{
				$('.taskCard').addClass('hiddenCard');
				playerStoredSettings[4] = 0;
			}

			if($('.thinkButton').hasClass('active') ){
				//$('.thinkCard').removeClass('hiddenCard');
				if($('.aivovoimaButton').hasClass('active')){
					$('.aivovoimaCard.thinkCard').removeClass('hiddenCard');
					playerStoredSettings[0] = 1;
				}
				else {
					$('.aivovoimaCard.thinkCard').addClass('hiddenCard');
					playerStoredSettings[0] = 0;
				}
	
				if($('.hyvatyoButton').hasClass('active')){
					$('.hyvatyoCard.thinkCard').removeClass('hiddenCard');
					playerStoredSettings[1] = 1;
				}
				else {
					$('.hyvatyoCard.thinkCard').addClass('hiddenCard');
					playerStoredSettings[1] = 0;
				}
	
				if($('.keskeytyksetButton').hasClass('active')){
					$('.keskeytyksetCard.thinkCard').removeClass('hiddenCard');
					playerStoredSettings[2] = 1;
				}
				else {
					$('.keskeytyksetCard.thinkCard').addClass('hiddenCard');
					playerStoredSettings[2] = 0;
				}
	
				if($('.palautuminenButton').hasClass('active')){
					$('.palautuminenCard.thinkCard').removeClass('hiddenCard');
					playerStoredSettings[3] = 1;
				}
				else {
					$('.palautuminenCard.thinkCard').addClass('hiddenCard');
					playerStoredSettings[3] = 0;
				}
				//$('.thinkCard').removeClass('hiddenCard');
				playerStoredSettings[5] = 1;
			}
			else{
				$('.thinkCard').addClass('hiddenCard');
				playerStoredSettings[5] = 0;
			}


			console.log('filtteröidään listaa');
			/*if($('.taskButton').hasClass('active') ){
				//$('.cards').find('.tmb .t-entry-cat-single span:contains(Tehtävä)').closest('.cards .tmb').removeClass('hiddenCard');
				$('.taskCard').removeClass('hiddenCard');
				playerStoredSettings[4] = 1;
			}
			else {
				//$('.cards').find('.tmb .t-entry-cat-single span:contains(Tehtävä)').closest('.cards .tmb').addClass('hiddenCard');
				$('.taskCard').addClass('hiddenCard');
				playerStoredSettings[4] = 0;
			}

			if($('.thinkButton').hasClass('active') ){
				//$('.cards').find('.tmb .t-entry-cat-single span:contains(Pohdintaa)').closest('.cards .tmb').removeClass('hiddenCard');
				$('.thinkCard').removeClass('hiddenCard');
				playerStoredSettings[5] = 1;
			}
			else {
				//$('.cards').find('.tmb .t-entry-cat-single span:contains(Pohdintaa)').closest('.cards .tmb').addClass('hiddenCard');
				$('.thinkCard').addClass('hiddenCard');
				playerStoredSettings[5] = 0;
			}
			if (i == 2||)
			if($('.aivovoimaButton').hasClass('active') && ($('.thinkButton').hasClass('active')||$('.taskCard').addClass('hiddenCard')) ){
				$('.aivovoimaCard').removeClass('hiddenCard');
				playerStoredSettings[0] = 1;
			}
			else {
				$('.aivovoimaCard').addClass('hiddenCard');
				playerStoredSettings[0] = 0;
			}

			if($('.hyvatyoButton').hasClass('active') && ($('.thinkButton').hasClass('active')||$('.taskCard').addClass('hiddenCard')) ){
				$('.hyvatyoCard').removeClass('hiddenCard');
				playerStoredSettings[1] = 1;
			}
			else {
				$('.hyvatyoCard').addClass('hiddenCard');
				playerStoredSettings[1] = 0;
			}

			if($('.keskeytyksetButton').hasClass('active') && ($('.thinkButton').hasClass('active')||$('.taskCard').addClass('hiddenCard')) ){
				$('.keskeytyksetCard').removeClass('hiddenCard');
				playerStoredSettings[2] = 1;
			}
			else {
				$('.keskeytyksetCard').addClass('hiddenCard');
				playerStoredSettings[2] = 0;
			}

			if($('.palautuminenButton').hasClass('active') && ($('.thinkButton').hasClass('active')||$('.taskCard').addClass('hiddenCard')) ){
				$('.palautuminenCard').removeClass('hiddenCard');
				playerStoredSettings[3] = 1;
			}
			else {
				$('.palautuminenCard').addClass('hiddenCard');
				playerStoredSettings[3] = 0;
			}*/
					

			console.log(playerStoredSettings);
			localStorage.setItem("playerSettings", JSON.stringify(playerStoredSettings));
			
		}
	});
	
	/* SCRIPTS FOR INDIVIDUAL CARDS (post type) */
	$('.single-palautuminen').html(function() {
		$('#postType').text('Palautumisen merkitys työssä');
		$('.firstCard').addClass('palautuminenCard');
		cardStatusAction();
		removeCards();
		filterCardPage();
		getRandomCard();
	});
	$('.single-aivovoiman-perusta').html(function() {
		$('#postType').text('Aivovoiman perusta');
		$('.firstCard').addClass('aivovoimaCard');
		cardStatusAction();
		removeCards();
		filterCardPage();
		getRandomCard();
	});
	$('.single-keskeytykset').html(function() {
		$('#postType').text('Keskeytykset -hukkaan heitettyä työaikaa');
		$('.firstCard').addClass('keskeytyksetCard');
		cardStatusAction();
		removeCards();
		filterCardPage();
		getRandomCard();
	});
	$('.single-hyva-tyo-aivoille').html(function() {
		$('#postType').text('Hyvä työ aivoille');
		$('.firstCard').addClass('hyvatyoCard');
		cardStatusAction();
		removeCards();
		filterCardPage();
		getRandomCard();
	});
	$('.page-id-193').html(function() {
		cardStatusAction();
		removeCards();
		filterCardPage();
		$('.card .tmb').hide();
		$('.cardButtons').addClass('hiddenCard');
	});
	$('.page-id-427').html(function() {
		emailFiller();
	});
	//Show more progress
	$('#showFullProgress').click(function() {
		if ( $('.fullProgress').is(':visible') ) {
		  $('.fullProgress').slideUp();
		  $(this).text('Näytä eteneminen');
		} else {
		  $('.fullProgress').slideDown();
		  $(this).text('Näytä vähemmän');
		}
	   })
	//Card done button
	$( ".cardDone" ).click(function() {
		if ($('.singleCardTitle')[0] && singleCardPost < 1){
			var entryText = $('.singleCardTitle').find('.heading-text').text();
			$('.firstCard').addClass('hiddenCard');
			cardContent = $('.singleCardPostContent').text();
			cardPostType = $('.singleCardPostType').text();
			cardPostCategory = $('.singleCardPostCategory').text();
			cardExtraText = $('.exerptText').text();
			cardTitle = $('.singleCardTitle').text();

			addEntry(entryText, '!c');
			singleCardPost++;
			console.log(entryText);
		} else {
			var entryText = $(randomCard).find('.t-entry-title').text();
			cardContent = $(randomCard).find('.t-entry-excerpt').text();
			addEntry(entryText, '!c');
		}
		$('.cardButtons').addClass('hiddenCard');
		$('.feedbackRow').removeClass('hiddenCard');
		
		emailFiller();
	});
	//Card cancelling/rejecting button
	$(".cardCancel").click(function(){
		if ($('.singleCardTitle')[0] && singleCardPost < 1){
			var entryText = $('.singleCardTitle').find('.heading-text').text();
			$('.firstCard').fadeOut(1000);
			singleCardPost++;
			console.log(entryText);
		} else {
			var entryText = $(randomCard).find('.t-entry-title').text();
		}
		$('.cardButtons').addClass('hiddenCard');
		addEntry(entryText, '!b');
		getRandomCard();
	});
	//After card is done, show feedback and button to show new card
	$( ".cardNew" ).click(function() {
		//$('.cardButtons').removeClass('hiddenCard');
		$('.feedbackRow').addClass('hiddenCard');
		getRandomCard();
	});
	//Animated card where click shows card from deck
	$( ".animatedCard2" ).click(function() {
		$('.cardButtons').removeClass('hiddenCard');
		$('.animatedCardHolder').addClass('hiddenCard');
		$('.animatedCardText').addClass('hiddenCard');

		getRandomCard();
	});
	//LocalStorage clearing
	$(".cardClear").click(function(){
		localStorage.removeItem("playerProgress");
		localStorage.removeItem("playerName");
		localStorage.removeItem("playerEmail");
		localStorage.removeItem("saveDate");
	//#####################->vahvistus tietojen tyhjentämiselle
	});

	// simple trigger for data updates
  	$('input').change(function() {
  		updateStuff();
		//checkProgress();
 	});



	/* UPDATE DATA AND SAVE LOCALLY */
	function updateStuff() {
		var playerName = $('#playerName').val();
		var playerEmail = $('#playerEmail').val();
		//var playerProgress = $('#playerProgress').val();
		document.getElementById("pelaajaNimi").innerHTML = playerName;
		playerName = playerName.replaceAll(' ','!X');
		/* Save shit when going away */
		window.onbeforeunload = function(e) {
			localStorage.setItem('playerName', playerName);
			localStorage.setItem('playerEmail', playerEmail);
			//localStorage.setItem('playerProgress', playerProgress);
		};
	}
	//SAVE PLAYER PROGRESS TO LOCALSTORE
	function addEntry(entryText, status) {
		// Parse any JSON previously stored in allEntries
		var e =0;
		playerStoredProgress = JSON.parse(localStorage.getItem("playerProgress"));
		var existingEntries = JSON.parse(localStorage.getItem("playerProgress"));
		if(existingEntries == null) existingEntries = [];
		if(playerStoredProgress == null) playerStoredProgress = [];
		localStorage.setItem("entry", JSON.stringify(entryText+status));
		// Save allEntries back to local storage
		var cards = playerStoredProgress.toString().split(',');
		if (numCard>0){var allCards = $('.card .tmb');}
		if (numCards>0){var allCards = $('.cards .tmb');}
		for (var i = 0; i < cards.length; i++) {
			var cardInfo = cards[i].split('!'); // get status for each task
			cardId = cardInfo[0];
			cardStatus = cardInfo[1];
		   
		   if(entryText == cardId)
		   {
				existingEntries.splice(i,1);
				existingEntries.push(entryText+status);
				localStorage.setItem("playerProgress", JSON.stringify(existingEntries));
				//console.log(entryText+'on listalla');
				e++;
		   }
		   for(var q = 0; q < allCards.length; q++)
				{
					if($(allCards[q]).find('.t-entry-title').text()==cardId && !(status == '!a'))
					{
						if (numCard>1){$(allCards[q]).closest('.card .tmb').remove();}
						if (numCards>1){$(allCards[q]).closest('.cards .tmb').remove();}
					}
				}
			
	   }
	   if(numCard>0){var allCards = $('.card .tmb');}
	   if(numCards>0){var allCards = $('.cards .tmb');}
	   var letterStatus = status.split('!');
	   if(singleCardPost>0||!$('.singleCardTitle')[0]){
			for(var q = 0; q < allCards.length; q++){
				if($(allCards[q]).find('.t-entry-title').text()==entryText)
				{
					var letterStatus = status.split('!');
					if(numCard>0){$(allCards[q]).closest('.card .tmb').addClass(letterStatus[1]);}
					if(numCards>0){$(allCards[q]).closest('.cards .tmb').addClass(letterStatus[1]);}
					//if(letterStatus[1]=='c'){points++;} //Adding points for player
				}
			}
		}
		/*else{
			if(letterStatus[1]=='c'){points++;} //Adding points for player
		}*/

	   if(e<1){
		existingEntries.push(entryText+status);
		localStorage.setItem("playerProgress", JSON.stringify(existingEntries));
		}
		localStorage.setItem("saveDate", JSON.stringify(outputDate));
		playerStoredProgress = JSON.parse(localStorage.getItem("playerProgress"));
		//Update feedback text and make actions for changed card status
		if(!(status == '!a')){feedbackInfo();}
		cardStatusAction();
		removeCards(1);
		
	}

	//Parse game progress and add status based on that
	function playerProgress(){
		var cards = playerStoredProgress.toString().split(',');
		if(numCard>0){var allCards = $('.card .tmb');}
		if(numCards>0){var allCards = $('.cards .tmb');}
		for (var i = 0; i < cards.length; i++) {
			 	var cardInfo = cards[i].split('!'); // get status for each task
			 	
			 	cardId = cardInfo[0];
			 	cardStatus = cardInfo[1];
				
				for(var q = 0; q < allCards.length; q++)
				{
					if($(allCards[q]).find('.t-entry-title').text()==cardId)
					{
						if(numCard>0){$(allCards[q]).closest('.card .tmb').addClass(cardStatus);}
						if(numCards>0){$(allCards[q]).closest('.cards .tmb').addClass(cardStatus);}
						//if(cardStatus=='c'){points++;}
					}
				}
				//console.log(cardId,cardStatus);
			 	
			}
	}
	//Randomize card that is shown and save that as variable
	function getRandomCard(){
		const card = $('.card .tmb');
		const aCard = $('.card .tmb.a');
		//var allCards = $('.cards .tmb');

		if(singleCardPost > 0 || !$('.singleCardTitle')[0]){
			if (playerStoredProgress) {
				//playerStoredProgress = playerStoredProgress[0].split(',');

				/*for (var i = 0; i < playerStoredProgress.length; i++) {
					for(var q = 0; q < allCards.length; q++)
					{
						if($(allCards[q]).find('.t-entry-title').text()==playerStoredProgress[i])
						{
							$(allCards[q]).closest('.cards .tmb').addClass(cardStatus);
						}
					}
					//$(":contains("+playerStoredProgress[i]+")").closest('.card .tmb').remove(); 
					
					//test
					//$(".output").append('<span class="task">'+playerStoredProgress[i]+'</span>');

				}*/
				$(card.hide());
				if(aCard.length > 0)
				{
					randomCard = $(aCard[Math.floor(Math.random() * aCard.length)]);
				}
				else{
					//tilanne kun kaikki kortit ovat tehtynä
					randomCard = $(card[Math.floor(Math.random() * card.length)]);
				}
				randomCard.show();
			} else {
				$(card.hide());
				randomCard = $(card[Math.floor(Math.random() * card.length)]);
				randomCard.show();
			}
			if ($('.singleCardTitle')[0] && singleCardPost < 1 && aCard.length < 1){
				var entryText = $('.singleCardTitle').find('.heading-text').text();
				addEntry(entryText, '!a');
			} else {
				var entryText = $(randomCard).find('.t-entry-title').text();
				addEntry(entryText, '!a');
			}
		}
		else{
			$(card.hide());
			var entryText = $('.singleCardTitle').find('.heading-text').text();
			addEntry(entryText, '!a');
		}
		
		
	}
	//Actions based on card status
	function cardStatusAction(i){
		//Add classes to elements once
		if(cardStatusVar < 1)
		{
			$('.cards').find('.tmb .t-entry-cat-single span:contains(Tehtävä)').closest('.cards .tmb').addClass('taskCard');
			$('.cards').find('.tmb .t-entry-cat-single span:contains(Pohdintaa)').closest('.cards .tmb').addClass('thinkCard');
			$('.cards').find('.tmb .t-entry-meta span:contains(Palautumisen merkitys työssä)').closest('.cards .tmb').addClass('palautuminenCard');
			$('.cards').find('.tmb .t-entry-meta span:contains(Aivovoiman perusta)').closest('.cards .tmb').addClass('aivovoimaCard');
			$('.cards').find('.tmb .t-entry-meta span:contains(Keskeytykset -hukkaan heitettyä työaikaa)').closest('.cards .tmb').addClass('keskeytyksetCard');
			$('.cards').find('.tmb .t-entry-meta span:contains(Hyvä työ aivoille)').closest('.cards .tmb').addClass('hyvatyoCard');

			$('.card').find('.tmb .t-entry-cat-single span:contains(Tehtävä)').closest('.card .tmb').addClass('taskCard');
			$('.card').find('.tmb .t-entry-cat-single span:contains(Pohdintaa)').closest('.card .tmb').addClass('thinkCard');
			$('.card').find('.tmb .t-entry-meta span:contains(Palautumisen merkitys työssä)').closest('.card .tmb').addClass('palautuminenCard');
			$('.card').find('.tmb .t-entry-meta span:contains(Aivovoiman perusta)').closest('.card .tmb').addClass('aivovoimaCard');
			$('.card').find('.tmb .t-entry-meta span:contains(Keskeytykset -hukkaan heitettyä työaikaa)').closest('.card .tmb').addClass('keskeytyksetCard');
			$('.card').find('.tmb .t-entry-meta span:contains(Hyvä työ aivoille)').closest('.card .tmb').addClass('hyvatyoCard');

			$('.firstCard').find('.category-info :contains(Tehtävä)').closest('.firstCard').addClass('taskCard');
			$('.firstCard').find('.category-info :contains(Pohdintaa)').closest('.firstCard').addClass('thinkCard');

			cardStatusVar++;
		}
/*
		if($('.cards .tmb').hasClass('a')){

		}
		if($('.cards .tmb').hasClass('b')){
		
		}
		if(i==1){$('.card .b').remove();}
		if(numCard>0){$('.card .c').remove();}
		if(numCards>0){$('.cards .c').addClass('doneCard');}*/
	}
	function removeCards(i){
		if($('.cards .tmb').hasClass('a')){

		}
		if($('.cards .tmb').hasClass('b')){
		
		}
		if(i==1){$('.card .b').remove();}
		if(numCard>0){$('.card .c').remove();}
		if(numCards>0){$('.cards .c').addClass('doneCard');}
	}
	//Single card page
	function filterCardPage(){
		/*
		playerStoredSettings[0] Aivovoiman perusta
		playerStoredSettings[1] Hyvä työ aivoille
		playerStoredSettings[2] Keskeytykset - hukkaan heitettyä työaikaa
		playerStoredSettings[3] Palautumisen merkitys työssä
		playerStoredSettings[4] Tehtävä
		playerStoredSettings[5] Pohdintaa
		*/
		//pages
		if(playerStoredSettings[0]==0){
			$('.aivovoimaCard').remove();
		}
		if(playerStoredSettings[1]==0){
			$('.hyvatyoCard').remove();
		}
		if(playerStoredSettings[2]==0){
			$('.keskeytyksetCard').remove();
		}
		if(playerStoredSettings[3]==0){
			$('.palautuminenCard').remove();
		}
		if(playerStoredSettings[4]==0){
			$('.taskCard').remove();
		}
		if(playerStoredSettings[5]==0){
			$('.thinkCard').remove();
		}		
	}
	//Feedback texts based on player points
	function feedbackInfo(){
		if(points>=1&&points<=2){$('#feedbackBox').text('Hienosti tehty! Saavutit ensimmäisen merkkipaalun, ja nousit tasolle yksi! Jatka harjoittelua omaan tahtiin, se kannattaa!');}
		if(points>=3&&points<=5){$('#feedbackBox').text('Nousit tasolle kaksi! Huomaat varmasti jo harjoittelun hyvät vaikutukset jaksamiseen ja tekemiseen. Pakassa on kuitenkin vielä monta korttia joita et ole nähnyt, toivottavasti jatkat matkaasi pian.');}
		if(points>=6&&points<=7){$('#feedbackBox').text('Onnittelut! Nousit tasolle kolme. Kiitos, että huolehdit kognitiivisesta ergonomiastasi. Se on tärkeää ja tarpeellista.');}
		if(points>=8&&points<=10){$('#feedbackBox').text('Nousit tasolle neljä! Oletkin jo konkari tässä pelissä. Olet suorittanut neljäsosan pakan korteista.');}
		if(points>=11&&points<=14){$('#feedbackBox').text('Mahtavaa! Nousit tasolle viisi. Vain noin puolet harjoittelijoista sitoutuu näin pitkälle. Sinulla on selvästi pitkäjänteisyyttä.');}
		if(points>=15&&points<=17){$('#feedbackBox').text('Nousit tasolle kuusi! Olet tosi hyvä tässä. Olet suorittanut jo puolet pakan tehtävistä. Mutta vielä toinen puoli korteista odottaa!');}
		if(points>=18&&points<=19){$('#feedbackBox').text('Upeaa! Nousit tasolle seitsemän! Hieno suoritus! Pakan viimeinen puolisko on jo hyvällä alulla!');}
		if(points>=20&&points<=35){$('#feedbackBox').text('Nousit tasolle kahdeksan! Hienosti tehty! Jaksathan vielä, olet kohta suorittanut kaikki pakan tehtävät.');}
		if(points>=36&&points<=44){$('#feedbackBox').text('Nousit tasolle yhdeksän! Tosi hienoa! Vielä yksi taso, niin olet suorittanut kaikki pakan kortit kertaalleen.');}
		if(points>=45&&points<=50){$('#feedbackBox').text('Aivan mahtavaa! Pääsit tasolle kymmenen! Voit todellakin onnitella itseäsi. Olet nyt suorittanut kaikki pakan kortit yhden kerran. Mutta älä huoli, voit jatkaa pelaamista, me kannustamme sinua edelleen!');}
		
		if(points>51){
			var randomFeedback = Math.floor(Math.random() * 4) + 1;
			if(randomFeedback ==1){$('#feedbackBox').text('Hienosti tehty! Pääsit uudelle tasolle! Olet todella pitkäjänteinen ja motivoitunut.');}
			if(randomFeedback ==2){$('#feedbackBox').text('Nousit uudelle tasolle! Todella hienoa. Harjoitteista on selvästi sinulle hyötyä.');}
			if(randomFeedback ==3){$('#feedbackBox').text('Mahtavaa! Nousit tason! Kiitos, että huolehdit itsestäsi.');}
			if(randomFeedback ==4){$('#feedbackBox').text('Upeaa! Nousit uudelle tasolle. Voit olla tyytyväinen itseesi.');}
		}
	}
	/*Get url parameters*/
	function getUrlParameters(){
		$('#date').text(outputDate);
		var urlData = window.location.search.substring(0); // complete URL
		if ( urlData.indexOf('?')>-1 ) {
			urlData = urlData.split('?'); // get all params
			var arrayList = urlData[1].split('&'); // run params one by one
			var name, email, date, progress;
			name = arrayList[0].split('=');
			email = arrayList[1].split('=');
			date = arrayList[2].split('=');
			progress = arrayList[3].split('=');
			//jos ei ole tyhjä, kysy korvataanko tiedot/tarkista päivämäärä korvaa uusimmallla
			$('#name').text(name[1]);
			$('#email').text(email[1]);
			//$('#progress').text(progress[1]);
			
			// print progress as tags (demostration)
			progress = progress[1].split(',');
			for (var i = 0; i < progress.length; i++) {
				$(".output").append('<span class="task">'+progress[i]+'</span>');
			}
			console.log('Vanha tallennus:'+parseInt(playerSaveDate) + 'Uusi tallennus:'+parseInt(date[1]));
			if(parseInt(playerSaveDate) <= parseInt(date[1]))
			{
				localStorage.setItem('playerProgress', JSON.stringify(progress));
				localStorage.setItem('playerName', name[1]);
				localStorage.setItem('playerEmail', email[1]);
				localStorage.setItem("saveDate", JSON.stringify(parseInt(date[1])));

				playerStoredProgress = JSON.parse(localStorage.getItem("playerProgress"));
				playerProgressPoints = JSON.parse(localStorage.getItem("playerProgressPoints"));
				playerStoredSettings = JSON.parse(localStorage.getItem("playerSettings"));
				playerSaveDate = JSON.parse(localStorage.getItem("saveDate"));
			}
		
	  }
	  else {
		  //alert('no saved data'); // if no previous data
	  }
	}
	
	$('.card').find('.cssgrid-container').html(function() {
		if ( $(this).children('.tmb').length < 1 ) {
			console.log('ei pelattavia kortteja');
			var finHeading = '<h1>Ei pelattavia kortteja jäljellä!</h1><p style="line-height:1.1;">Onneksi olkoon, kaikki kortit on nyt suoritettu - voit palata nyt korttipakkaan suorittaaksesi ohitettuja kortteja tai suorittaa niitä uudelleen.</p>';
			var finParagraph = '<a href="https://ksmuistiyhdistys.fi/korttipakka/" class="custom-link btn border-width-0 btn-color-176154 btn-circle btn-flat btn-block btn-icon-left" title="Korttipakka"><i class="fa fa-th-large"></i>Näytä korttipakka</a>';
			$(finHeading+finParagraph).appendTo($(this));
		}
	});
	
	function emailFiller(){
		if (playerEmail){
			$('.cardNotes').removeClass('hiddenCard');
		}
		else{
			$('.cardNotes').addClass('hiddenCard');
		}
		$('input[name=content]').val(cardContent);
		$('input[name=category-extra]').val(cardPostType);
		$('input[name=category]').val(cardPostCategory);
		$('input[name=extra-text]').val(cardExtraText);
		$('input[name=card-title]').val(cardTitle);
		$('input[name=your-name]').val(playerName); 
		playerName = playerName.replaceAll(' ','!X');
		$('input[name=your-email]').val(playerEmail);
		$('input[name=progress]').val('https://ksmuistiyhdistys.fi/korttipakka/pelaa-kortti/?Name='+playerName+'&Mail='+playerEmail+'&Date='+playerSaveDate+'&Progress='+playerStoredProgress);

	}

	function calcProgress() {
		if(numCards>0)
		{
			var cardsTotal = $('.cards').find('.tmb').length; 
			var ongoingTotal = $('.cards').find('.tmb.a').length; 
			var skippedTotal = $('.cards').find('.tmb.b').length;
			var finishedTotal = $('.cards').find('.tmb.c').length;

			var pohdintaTotal = $('.cards').find('.tmb.thinkCard').length; 
			var tehtavaTotal = $('.cards').find('.tmb.taskCard').length; 
			var pohdintaDone = $('.cards').find('.tmb.c.thinkCard').length;
			var tehtavaDone = $('.cards').find('.tmb.c.taskCard').length;

			var aivovoimaTotal = $('.cards').find('.tmb.aivovoimaCard').length;
			var hyvatyoTotal = $('.cards').find('.tmb.hyvatyoCard').length;
			var keskeytyksetTotal = $('.cards').find('.tmb.keskeytyksetCard').length;
			var palautuminenTotal = $('.cards').find('.tmb.palautuminenCard').length;

			var aivovoimaDone = $('.cards').find('.tmb.c.aivovoimaCard').length;
			var hyvatyoDone = $('.cards').find('.tmb.c.hyvatyoCard').length;
			var keskeytyksetDone = $('.cards').find('.tmb.c.keskeytyksetCard').length;
			var palautuminenDone = $('.cards').find('.tmb.c.palautuminenCard').length;

			playerProgressPoints[0] = cardsTotal; 
			playerProgressPoints[1] = ongoingTotal; 
			playerProgressPoints[2] = skippedTotal;
			playerProgressPoints[3] = finishedTotal;

			playerProgressPoints[4] = pohdintaTotal; 
			playerProgressPoints[5] = tehtavaTotal; 
			playerProgressPoints[6] = pohdintaDone;
			playerProgressPoints[7] = tehtavaDone;

			playerProgressPoints[8] = aivovoimaTotal;
			playerProgressPoints[9] = hyvatyoTotal;
			playerProgressPoints[10] = keskeytyksetTotal;
			playerProgressPoints[11] = palautuminenTotal;

			playerProgressPoints[12] = aivovoimaDone;
			playerProgressPoints[13] = hyvatyoDone;
			playerProgressPoints[14] = keskeytyksetDone;
			playerProgressPoints[15] = palautuminenDone;

			localStorage.setItem("playerProgressPoints", JSON.stringify(playerProgressPoints));
		}
		if(numCard>0)
		{
			var cardsTotal = $('.card').find('.tmb').length; 
			var ongoingTotal = $('.card').find('.tmb.a').length; 
			var skippedTotal = $('.card').find('.tmb.b').length;
			var finishedTotal = $('.card').find('.tmb.c').length;

			var pohdintaTotal = $('.card').find('.tmb.thinkCard').length; 
			var tehtavaTotal = $('.card').find('.tmb.taskCard').length; 
			var pohdintaDone = $('.card').find('.tmb.c.thinkCard').length;
			var tehtavaDone = $('.card').find('.tmb.c.taskCard').length;

			var aivovoimaTotal = $('.card').find('.tmb.aivovoimaCard').length;
			var hyvatyoTotal = $('.card').find('.tmb.hyvatyoCard').length;
			var keskeytyksetTotal = $('.card').find('.tmb.keskeytyksetCard').length;
			var palautuminenTotal = $('.card').find('.tmb.palautuminenCard').length;

			var aivovoimaDone = $('.card').find('.tmb.c.aivovoimaCard').length;
			var hyvatyoDone = $('.card').find('.tmb.c.hyvatyoCard').length;
			var keskeytyksetDone = $('.card').find('.tmb.c.keskeytyksetCard').length;
			var palautuminenDone = $('.card').find('.tmb.c.palautuminenCard').length;

			playerProgressPoints[0] = cardsTotal; 
			playerProgressPoints[1] = ongoingTotal; 
			playerProgressPoints[2] = skippedTotal;
			playerProgressPoints[3] = finishedTotal;

			playerProgressPoints[4] = pohdintaTotal; 
			playerProgressPoints[5] = tehtavaTotal; 
			playerProgressPoints[6] = pohdintaDone;
			playerProgressPoints[7] = tehtavaDone;

			playerProgressPoints[8] = aivovoimaTotal;
			playerProgressPoints[9] = hyvatyoTotal;
			playerProgressPoints[10] = keskeytyksetTotal;
			playerProgressPoints[11] = palautuminenTotal;

			playerProgressPoints[12] = aivovoimaDone;
			playerProgressPoints[13] = hyvatyoDone;
			playerProgressPoints[14] = keskeytyksetDone;
			playerProgressPoints[15] = palautuminenDone;

			localStorage.setItem("playerProgressPoints", JSON.stringify(playerProgressPoints));
		}
		if(numCard<1 && numCards<1)
		{
			var cardsTotal = playerProgressPoints[0];
			var ongoingTotal = playerProgressPoints[1];
			var skippedTotal = playerProgressPoints[2];
			var finishedTotal = playerProgressPoints[3];

			var pohdintaTotal = playerProgressPoints[4];
			var tehtavaTotal = playerProgressPoints[5];
			var pohdintaDone = playerProgressPoints[6];
			var tehtavaDone = playerProgressPoints[7];

			var aivovoimaTotal = playerProgressPoints[8];
			var hyvatyoTotal = playerProgressPoints[9];
			var keskeytyksetTotal = playerProgressPoints[10];
			var palautuminenTotal = playerProgressPoints[11];

			var aivovoimaDone = playerProgressPoints[12];
			var hyvatyoDone = playerProgressPoints[13];
			var keskeytyksetDone = playerProgressPoints[14];
			var palautuminenDone = playerProgressPoints[15];

			
		}
		console.log(playerProgressPoints);

		var allTotalPercent = ((finishedTotal+skippedTotal)/cardsTotal*100).toFixed(0);
		var finishedTotalPercent = (finishedTotal/cardsTotal*100).toFixed(0);
		var skippedTotalPercent = (skippedTotal/cardsTotal*100).toFixed(0);
		var ongoingTotalPercent = (ongoingTotal/cardsTotal*100).toFixed(0);
		var innerPercent = ((finishedTotal+skippedTotal+ongoingTotal)/cardsTotal*100).toFixed(0);
		$('.progressText').text(allTotalPercent+'%');
		$('#skippedTotal.progress').css('width',skippedTotalPercent+'%');
		if ( skippedTotal === 0 ) { $('#skippedTotal.progress').remove();}
		$('#finishedTotal.progress').css('width',finishedTotalPercent+'%');
		$('#ongoingTotal.progress').css('width',ongoingTotalPercent+'%');
		$('.progressText.inner').css('clip-path','polygon(0% 0%, '+innerPercent+'% 0%, '+innerPercent+'% 100%, 0% 100%)');
		
		$('#pohdintaDone').text(pohdintaDone);
		$('#pohdintaAll').text(pohdintaTotal);
		$('#tehtavaDone').text(tehtavaDone);
		$('#tehtavaAll').text(tehtavaTotal);
		
		$('#aivovoimaDone').text(aivovoimaDone);
		$('#aivovoimaTotal').text(aivovoimaTotal);
		$('#hyvatyoDone').text(hyvatyoDone);
		$('#hyvatyoTotal').text(hyvatyoTotal);
		$('#keskeytyksetDone').text(keskeytyksetDone);
		$('#keskeytyksetTotal').text(keskeytyksetTotal);
		$('#palautuminenDone').text(palautuminenDone);
		$('#palautuminenTotal').text(palautuminenTotal);
	
	}
});


//################################################################################################################
//URl sampler
//################################################################################################################



/*function getProgress() {
	var urlData = $('.input').text(); // complete URL
  if ( urlData.indexOf('?')>-1 ) {
  	urlData = urlData.split('?'); // get all params
    var arrayList = urlData[1].split('&'); // run params one by one
    var name, email, progress;
    name = arrayList[0].split('=');
    email = arrayList[1].split('=');
    progress = arrayList[2].split('=');
    $('#name').val(name[1]);
    $('#email').val(email[1]);
    $('#progress').val(progress[1]);
    
    // print progress as tags (demostration)
    progress = progress[1].split(',');
    for (var i = 0; i < progress.length; i++) {
      $(".output").append('<span class="task">'+progress[i]+'</span>');
    }
    
  } else {
  	alert('no saved data'); // if no previous data
  }
}



// DEMOSTRATE STATUS CHANGE
$(document).on('click', '.task', function() {
	$(this).html(function() {
  	var status = $(this).text().split('!');
    if (status[0]==='a') {status[0]='b'}
    else if (status[0]==='b') {status[0]='c'}
    else if (status[0]==='c') {status[0]='a'}
    $(this).text(status[0]+'!'+status[1]);
    updateProgress();
  });
});

// collection of saved data. 
// Old progress must be saved, but with updates if there's one
function updateProgress() {
  var savedName = $('#name').val();
  var savedEmail = $('#email').val();
  var savedProgress = $('#progress').val();
  var newSavedProgress;
  $('.task').each(function() {
  	// need to generate list of items on the fly
    // add new progress status into same list
    // remove old progress status if exists
    // save list as array on local storage and offer URL for email link
  });
  var newParamList = '#?'+savedName+'&'+savedEmail+'&'+savedProgress;
  $('.input').text(newParamList);
  alert(newParamList);
}*/
