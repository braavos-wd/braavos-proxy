// JavaScript Document

PlayCount = 0;
//Click Events
$(document).on('click', '#pullTrigger', function(e){
	PlayCount ++;
	var chamberNumber = Math.floor(Math.random() * 2) + 1; //client side 1-2
	playRussianRoulette(chamberNumber); //contract side 1-3 [ 6 odds ], 1-4 [ 8 odds]
});
//fetch play profile
async function playProfile(){
	var message;
	var playCount = await tokenInst.methods._playCount(MyLibrary.wallet).call();
	var playCount = parseInt(playCount);
	var netplaycount = await tokenInst.methods._myplaysTotal(MyLibrary.wallet).call();
	var netplaycount = parseInt(netplaycount);
	//get last play
	var lastPlay = await tokenInst.methods._lastPlay(MyLibrary.wallet).call();
	var lastPlayParse = parseFloat(lastPlay);
	if(lastPlayParse>0){
		var lastPlayTime = new Date(lastPlayParse * 1000).toLocaleString([],{day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: true});
	}else{
		var lastPlayTime = '00:00';
	}
	
	//MESSAGE SECTION
	//1. check for resettted play wait
	if(playCount == 0 && netplaycount > 0){
		//message
		var message = "Play limit reached for day. Play again after a 24 hour cool down";
		//countdown to play - displayed only for waiter otherwise ---
		var resumeTimeParse = lastPlayParse + 1 *(60 * 60 * 24);
		var resumeTime = new Date(resumeTimeParse * 1000).toLocaleString([],{day: '2-digit', hour: '2-digit', minute:'2-digit', hour12: true});
	}
	//2. check first play
	if(playCount == 0 && netplaycount == 0){
		//message
		var message = "Play your first game. Or The Thin Man will withold; reimbursement & rewards.";
	}
	//TAXES SECTION
	//1. check winner
	//2. check medianjeeter
	//3. check maxjeeter
	var eligibility = await tokenInst.methods.isTaxExcluded(MyLibrary.wallet).call();
	var selltax = await tokenInst.methods._sellRate().call();
	var selltax = parseFloat(selltax);
	if(eligibility == true){
		var taxStatus = '<p class="markgreen">Sell Tax: 0%</p>';		
		var reimbursementStatus = '<p class="markgreen">Tax Reimburse: True</p>';
		var rewardsStatus = '<p class="markgreen">Reward Claims: True</p>';
	}else if(eligibility == false && netplaycount >= 6){//6 plays already means 24 - 48hrs passed from purchase
		var taxStatus = '<p class="markred">Sell Tax: '+selltax+'%</p>';	
		var reimbursementStatus = '<p class="markgreen">Tax Reimburse: True</p>';
		var rewardsStatus = '<p class="markgreen">Reward Claims: True</p>';
	}else if(eligibility == false && netplaycount < 6){
		var taxStatus = '<p class="markred">Sell Tax: '+selltax+'%</p>';
		var reimbursementStatus = '<p class="markred">Tax Reimburse: False</p>';
		var rewardsStatus = '<p class="markred">Reward Claims: False</p>';
	}
	//add results
	var netplaycountDisp = netplaycount + ' Plays total';
	if(lastPlayParse>0){
		$('#playstateLP').empty().append('last cooldown: '+lastPlayTime);
	}
	if(resumeTimeParse>0){
		$('#playstateNP').empty().append('next challenge: '+resumeTime);
	}
	$('#playMsg').empty().append(message);
	$('#playstatePC').empty().append(netplaycountDisp);
	$('#playstateST').empty().append(taxStatus);
	$('#playstateBTe').empty().append(reimbursementStatus);
	$('#playstateRCe').empty().append(rewardsStatus);	
}
//play effects - trigger click - transactionsubmit
async function playEffects(){
	//stop embark song if playing
	if(MyLibrary.embarksound !== null){
		MyLibrary.embarksound.pause();
		MyLibrary.embarksound = null;
	}	
	//play animations & sound
	if(MyLibrary.hypeSound == null){//if deleted
		MyLibrary.hypeSound = new Audio();
		MyLibrary.hypeSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/darkfantasyabyss.m4a";
		MyLibrary.hypeSound.play();
		MyLibrary.hypeSound.volume = 0.4;
	}
	move_cylinder = setTimeout( function() {
		if(MyLibrary.hypeVoice == null){//if deleted
			MyLibrary.hypeVoice = new Audio();
			MyLibrary.hypeVoice.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/valyrianwhatdowesayto.mp3";
			MyLibrary.hypeVoice.play();
			MyLibrary.hypeVoice.volume = 0.4;
		}
	}, 4500);
	//position cylinder
		$(".cylinder_cont").css({'right' : '-270px'});
	//make sure it plays if its not first time
	if(PlayCount > 0){
		$("#cylinder_outer").css({'animation-play-state' : 'running'});
		$("#cylinder_inner").css({'animation-play-state' : 'running'});
	}		
	//add animation classes
	if($("#cylinder_inner" ).hasClass( "inner_final" )){
		$("#cylinder_inner").addClass('inner'); 
		$("#cylinder_outer").addClass('loader'); 
	}else{
		//Change class on elements to Spin
		$(".loader_wait").attr('class', 'loader'); 
		$(".inner_wait").attr('class', 'inner'); 
	}
	final_set = setTimeout( function() {
		$(".inner").attr('class', 'inner_final');
	}, 3100);//wait
	
	move_cylinder = setTimeout( function() {
		//reposition cylinder
		$(".cylinder_cont").css({'right' : '15px'});
		//reset everything
		$(".inner").removeClass('inner_final');
		$(".loader_wait").removeClass('loader');
		$(".inner_wait").removeClass('inner');

		$(".cylinder_cont").removeAttr("style");
		$("#cylinder_inner" ).removeAttr("style");
		$("#cylinder_outer" ).removeAttr("style");

		$("#cylinder_inner" ).removeClass('inner_final');	
		$("#cylinder_outer").removeClass('loader');

		$("#cylinder_inner").addClass('inner_wait'); 
		$("#cylinder_outer").addClass('loader_wait'); 
		//make sounds
		MyLibrary.loadSound = new Audio();
		MyLibrary.loadSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/winchesterload.m4a";
		MyLibrary.loadSound.play();
		MyLibrary.loadSound.volume = 0.5;
		//start shiver
		$("#gun_holder").addClass('wiggle');
		//show blockchain pending
		$("#inplay_animation").fadeIn(300);
	}, 12000);//wait
}

//Play Russian Roulette
async function playRussianRoulette(cylinder){
	//toBN
	var input_number = web3.utils.toBN(String(cylinder));
	//estimate gasLimit
	var encodedData = tokenInst.methods._playRussianRoulette(input_number).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//playEffects now is passed gasCheck
	playEffects();
	
	//transaction
	tokenInst.methods._playRussianRoulette(input_number).send({
		from: MyLibrary.wallet,
		gasPrice: gasPrice,
		gasLimit: parseInt(estimateGas * 2) //actual gas is being underestimated for deeper state changes in other dependency functions
	})
	.on('receipt', async function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		if (confirmationNumber === 2) {
			console.log('tokens bought and burnt: '+receipt.events.BuyBack.returnValues[0]);
		}
	})
	.on('error', (error) => {//listen
		$("#inplay_animation").hide();
		$("#gun_holder").removeClass('wiggle');

		var text = error.message;
		swal({
			title: "Russian Roulette Failed.",
			type: "error",
			text: text,
			html: false,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});

	
}
/*
//Listen to Past Events
// https://ethereum.stackexchange.com/questions/16313/how-can-i-view-event-logs-for-an-ethereum-contract/45403#45403
// https://stackoverflow.com/questions/71367683/how-to-get-transaction-receipt-event-logs
tokenInst.getPastEvents('Transfer', {
	// indexed parameters only, the rest we filter using topics field but then need to pass event signature..Transfer events esp
	// Transfers we can easily get buys and sells mAshed together since topic : [eventSignature, LPaddress]
    filter: {player: [MyLibrary.wallet]}, 
    fromBlock: MyLibrary.startblock,
    toBlock: 'latest',
	// topics : [eventSignature,address_encoded]
}, function(error, events){ console.log(events); })
.then(function(events){
    console.log(events) // same results as the optional callback above
});
*/
//Listen to Future Events
tokenInst.events.trigger()
.on('data', function(event){
    console.log(event); // same results as the optional callback above
	var tx_hash = event.transactionHash;
	var input = 3;
	var result = event.returnValues[1];
	var result = parseFloat(result);
	var outputCurrency = '';//or GUN - currency focus is outcome of Tx
	var type = 'success';//or error
	var wallet = '';
	$("#inplay_animation").hide();
	if(input == result){
		var message = 'Bang! You won! Valar morghulis.';
		var nonTxAction = 'Bullet Chamber: '+input + ', Contract Pulled: '+result;
		wonEffect();
	}else{
		var message = 'Fuck! You lost! Valar Dohaeris.';
		var nonTxAction = 'Bullet: Chamber'+input + ', Contract Pulled: '+result;
		lostEffect();
	}
	playProfile();
	popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed

})
.on('changed', function(event){
    // remove event from local database
	console.log(event);
})
.on('error', console.error);

//PlayEffects - Win /Lose
async function wonEffect(){
	if(MyLibrary.hypeSound !== null){
		MyLibrary.hypeSound.pause();
		MyLibrary.hypeSound = null;
	}
	$("#gun_holder").removeClass('wiggle');
	// 1. Clone the image element
	var el = document.getElementById('gunshot').cloneNode();
	// 2. Append it to the HTML document
	document.body.appendChild(el);	
	// 3. Add sound effect
	var shotSound = new Audio();
	shotSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/audio_revolvershot.m4a";
	shotSound.volume = 0.4; 
	shotSound.play().then(() => {
		// 4. Show gunshot hole
		$("#gunshot").css({'display' : 'block'});
		setTimeout( async function() {
			confettiSeason();
		}, 3500)
	});	
}
async function lostEffect(){
	if(MyLibrary.hypeSound !== null){
		MyLibrary.hypeSound.pause();
		MyLibrary.hypeSound = null;
	}
	// Add sound effect
	var whistleSound = new Audio();
	whistleSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/westernwhistlethick.m4a";
	// Setting volume level
	whistleSound.volume = 0.4; 
	whistleSound.play().then(() => {

		$("#gun_holder").addClass('wiggle');

		setTimeout( async function() {
			tumbleweedSeason();
		}, 2000)
	});	
}

async function confettiSeason(){
	//YeeHaw
	var whistleSound = new Audio();
	whistleSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/medievalvictory.m4a";
	whistleSound.volume = 0.4; 
	whistleSound.play();

	$("#confetti-wrapper").addClass('confetiLive');
	$("#congratsModal").addClass('confetiLive');
	$("#congratsModal").css({'display' : 'block'});
	$("#confetti-wrapper").css({'display' : 'block'});
	//whoop whoop
	setTimeout( async function() {
		$("#confetti-wrapper").removeClass('confetiLive');
		$("#congratsModal").removeClass('confetiLive');
		$("#confetti-wrapper").removeAttr('style');
		$("#congratsModal").removeAttr('style');
		$("#gunshot").css({'display' : 'none'});
	}, 11000);

	for(i=0; i<100; i++) {
		// Random rotation
		var randomRotation = Math.floor(Math.random() * 360);
		  // Random Scale
		var randomScale = Math.random() * 1;
		// Random width & height between 0 and viewport
		var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
		var randomHeight =  Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 500));
		
		// Random animation-delay
		var randomAnimationDelay = Math.floor(Math.random() * 10);
		//console.log(randomAnimationDelay);
	  
		// Random colors
		var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
		var randomColor = colors[Math.floor(Math.random() * colors.length)];
	  
		// Create confetti piece
		var confetti = document.createElement('div');
		confetti.className = 'confetti';
		confetti.style.top=randomHeight + 'px';
		confetti.style.right=randomWidth + 'px';
		confetti.style.backgroundColor=randomColor;
		confetti.style.transform='scale(' + randomScale + ')';
		confetti.style.obacity=randomScale;
		confetti.style.transform='skew(15deg) rotate(' + randomRotation + 'deg)';
		confetti.style.animationDelay=randomAnimationDelay + 's';
		document.getElementById("confetti-wrapper").appendChild(confetti);
	  }
}
async function tumbleweedSeason(){
	//show fail modal
	$("#failedModal").addClass('confetiLive');	
	//reset in a few
	setTimeout( async function() {
		$("#failedModal").removeClass('confetiLive');
	}, 10000);
	
	//whip pistol twice
	setTimeout( async function() {	$("#pistoldrum").addClass('pistolwhip'); }, 3000);
	//try again
	setTimeout( async function() {
		//lastly get ready again
		$("#pistoldrum").removeClass('pistolwhip');
		$("#gun_holder").removeClass('wiggle');
		
	}, 4000);
	//make sounds
	MyLibrary.missSound = new Audio();
	MyLibrary.missSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/winchesterempty.m4a";
	MyLibrary.missSound.play();
	MyLibrary.missSound.volume = 0.5;
}

/*
async function eventListenerExample() {
  //1. CONTRACT METHODS APPROACH
  var transferEventsFilter = token.methods.transfer({}, {fromBlock: fromBlock, toBlock: latestblock});
  var transferEvents = transferEventsFilter.get();
  for (var i = 0; i < transferEvents.length; i++) {
    var transferEvent = transferEvents[i];
    console.log('stringify result: '+JSON.stringify(transferEvent));
    //accounts[transferEvent.args._from] = 1;
    //accounts[transferEvent.args._to] = 1;
	  console.log('stringify result:'+JSON.stringify(transferEvents[i].args._from));
  }
  //2. GET PAST EVENTS APPROACH
  await token.getPastEvents("Transfer",
    {   fromBlock: fromBlock,     
        toBlock: toBlock // You can also specify 'latest'          
    }).then(transferEvents => {
	  window.transferEvents = transferEvents;
		for (let i = 0; i < transferEvents.length; i++) {
			if (transferEvents[i].event == 'Transfer' && transferEvents[i].args.from == '0x0000000000000000000000000000000000000000') {
				console.log(transferEvents[i]);
			}
		}
	})
  //3. SUBSCRIBE METHOD - Catch all blockchain events and filter yours out
	// Subscribe example... how to structure Topics: https://ethereum.stackexchange.com/questions/91646/mycontract-events-myevent-vs-web3-eth-subscribelogs
	var gntAddress="0xa74476443119A942dE498590Fe1f2454d7D4aC0d";
	var filter=window.web3.eth.filter({fromBlock: 3492700, toBlock: "latest", address: [gntAddress], topics: []});
	filter.get(function(error, log) {
	  console.log(JSON.stringify(log));
	});
	filter.stopWatching();
}

*/