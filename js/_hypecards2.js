//Bonfire - Burn Tokens
async function bonfireStart(input_eth){
	//toWei & Big Number inputs
	var input_eth = web3.utils.toWei(String(input_eth), 'ether'); 
	var input_eth = web3.utils.toBN(input_eth);
	var deadline = web3.utils.toBN(300);
	
	//estimate gasLimit
	var encodedData = tokenInst.methods._bonfireEvent(deadline).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		value: input_eth,
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//transaction
	tokenInst.methods._bonfireEvent(deadline).send({
		from: MyLibrary.wallet,
		value: input_eth,
   		gasPrice: gasPrice,
		gasLimit: estimateGas, /* actual cost est is falling short, by about 1.5....ps this is different from gasPrice above which takes what it needs only */
	})
	.on('receipt', async function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;

			var tokens = receipt.events.BuyBack.returnValues[2];
			var tx_hash = receipt.transactionHash;
			var receivedTokens = (tokens / Math.pow(10, MyLibrary.decimals)).toFixed(2);
			var fixedETH = fromWeiToFixed8(input_eth);
			var outputCurrency = '';//or GUN - currency focus is outcome of Tx
			var type = 'success';//or error
			var wallet = '';
			
			var message = 'Bonfire Successful!';
			var nonTxAction = receivedTokens.toLocaleString() + ' tokens burnt {value: '+fixedETH+'eth}';

			popupSuccess(type,outputCurrency,tx_hash,message,0,receivedTokens,wallet,nonTxAction);//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			port_bonfireWallet();
			fireBigEffect();			
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
		var text = error.message;
		swal({
			title: "Buy Back Failed.",
			type: "error",
			text: text,
			html: false,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	});
}
//Bonfire Success Effect
async function fireBigEffect(){
	$('#bonfireInput').val('');
	$('#bonfireCont').css('height', '160px');//bigger container
	$('#bornfire').css('top', '0px');//taller fire
	//reset all
	setTimeout( function() {
		$("#bonfireInput, #bonfireCont, #bornfire").removeAttr('style');
	}, 10000);
}
//Bornfire amount equiv
async function calcBonfire(){
	
	if(window.equateBonfire){clearTimeout(equateBonfire);}//so it searches when done typing
	if ($('#bonfireInput').val().length > 0){
		window.equateBonfire = setTimeout(async function() {
			var input_eth = $('#bonfireInput').val();
			if(input_eth == 0){return;}
			
			//toWei & Big Number inputs
			var input_eth = web3.utils.toWei(String(input_eth), 'ether'); 
			var input_eth = web3.utils.toBN(input_eth);

			var outputTokens = await tokenInst.methods.fetchSwapAmounts(input_eth, 1).call();
			var tokens = (outputTokens / Math.pow(10, MyLibrary.decimals));
			$('#burnTokenAmnt').empty().append(parseInt(tokens) + ' GUN');
		}, 2500);
	}
}
//Donate Rewards
async function donateRewards(input_eth){
	//toWei & Big Number inputs
	var input_eth = web3.utils.toWei(String(input_eth), 'ether'); 
	var input_eth = web3.utils.toBN(input_eth);
	
	//transaction
	tokenInst.methods.addReflectionETH().send({
		from: MyLibrary.wallet,
		value: input_eth
	})
	.on('receipt', async function(receipt){//listen
		if(receipt.status == true){//1 also matches true
			console.log('Mined', receipt);//console.log('Transaction Success. Receipt status: '+receipt.status);console.log('Tx_hash: '+receipt.transactionHash) ;

			var tx_hash = receipt.transactionHash;
			var fixedETH = fromWeiToFixed8(input_eth);
			var outputCurrency = 'ETH';//or GUN - currency focus is outcome of Tx
			var type = 'success';//or error
			var wallet = '';
			
			var message = 'Donated Rewards to Community!';
			var nonTxAction = '';

			popupSuccess(type,outputCurrency,tx_hash,message,fixedETH,0,wallet,nonTxAction);//async wont wait	//format: tx_hash, title, amounts{eth}, amountsT{tokens} - human readable amounts, wallet, NoTxAction perfomed
			port_rewardsAvail();
			donatedEffect();	
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
}
async function donatedEffect(){
	$('#donateInput').val('');
	$('#donateSection').css('border-color', '#F27474');//redish container //rgba(255, 149, 144, 1)
	$('#donateSection').css('animation', 'blink 1s');
	$('#donateSection').css('animation-iteration-count', '3');
	//make sounds
	MyLibrary.missSound = new Audio();
	MyLibrary.missSound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/medievalvictory.m4a";
	MyLibrary.missSound.play();
	MyLibrary.missSound.volume = 0.5;
	//reset all
	setTimeout( function() {
		$("#donateSection").removeAttr('style');
	}, 30000);
}
//Bonfire status
async function port_bonfireWallet(){
	//balance from zero address
	var burntToDate = await tokenInst.methods.balanceOf("0x000000000000000000000000000000000000dEaD").call();
	var tokens = (burntToDate / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var tokens = parseFloat(tokens);//float so we can add the values not append
	if(tokens > 0){
		$('#bornfireSum').empty().append(parseInt(tokens) + ' burnt ToDate');
	}else{
		$('#bornfireSum').empty().append(0 + ' burnt ToDate');
	}
}
//Rewards pool status
async function port_rewardsAvail(){
	var rewardsPool = await tokenInst.methods._ethRewardBasis().call();
	var rewardsEth = fromWeiToFixed5(rewardsPool);
	var rewardsEth = parseFloat(rewardsEth);//float so we can add the values not append
	if(rewardsEth > 0){
		$('#rewardsSum').empty().append('rewards avail: ' + rewardsEth + 'eth');
	}else{
		$('#rewardsSum').empty().append('rewards avail: ' + 0 + 'eth');
	}
}

//=====================================================
//Bonfire
$(document).on('click', '#bonfireSubmit', function(e){
	var input_eth = $('#bonfireInput').val();
	if(input_eth == 0){return;}
	if ($('#bonfireInput').val().length > 0){
		bonfireStart(input_eth);
	}
});
//Donate
$(document).on('click', '#donateSubmit', function(e){
	var input_eth = $('#donateInput').val();
	if(input_eth == 0){return;}
	if ($('#donateInput').val().length > 0){
		donateRewards(input_eth);
	}
});
//Play Russian Roulette
$(document).on('click', '#playRR', function(e){
	//make room to show all, wormhole is hidden
	if($('#RRwormhole').css('height')<'50px'){
		soundEffect_embark(1);	

		//hide other hype cards before showing game sect
		$('#bonfireSection, #donateSection').fadeOut(200);
		//take up size
		$('#RRwormhole').css('height', 'auto');
		//change button
		document.getElementById("playRR").innerHTML = "<span>Valar morghulis</span>";
		$('#playRR').css({'width': '150px', 'height': '150px', 'font-size': '22px', 'border': '5px solid #151515', 'background-color': '#bfbfbf'});
		$('#russianrouletteSection').css({'background-color':'#bfbfbf'});//white background card
		$("#playRRhold").removeClass('kreep');
		$("#playRR").addClass('wiggle');
		//run play status check
		playProfile();
	}else{
		soundEffect_embark(0);	

		//show other hype cards & restore height
		$('#bonfireSection, #donateSection').fadeIn(200);
		$('#RRwormhole').animate({'height': "0px"}, 300, "swing", function(){});
		//restore button
		document.getElementById("playRR").innerHTML = "<span>temple challenge</span>";
		$("#playRR").removeAttr('style');
		$('#russianrouletteSection').removeAttr('style');
		$("#playRR").removeClass('wiggle');
	}
});
async function soundEffect_embark(action){
	if(action == 1){
		//Add sound effect
		MyLibrary.embarksound = new Audio();
		MyLibrary.embarksound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/medievalbelldark.m4a";
		MyLibrary.embarksound.play();
		// Setting volume level
		MyLibrary.embarksound.volume = 0.1;  // set volume to 50%

	}else{
		MyLibrary.embarksound.pause();
		MyLibrary.embarksound = null;
	}
}
async function soundEffect_load(){
	if(action == 1){
		//Add sound effect
		MyLibrary.loadsound = new Audio();
		MyLibrary.loadsound.src = "https://cdn.jsdelivr.net/gh/braavos-wd/braavos-proxy@main/audio/winchesterload.m4a";
		MyLibrary.loadsound.play();
		// Setting volume level
		MyLibrary.loadsound.volume = 0.1;  // set volume to 50%
	}else{
		MyLibrary.loadsound.pause();
		MyLibrary.loadsound = null;
	}
}
//====================================
//GameFi
//Instructions pop
$(document).on('click', '#openInstruct', function(e){
	if($("#rr_instructions" ).hasClass( "fadeInRight" )){
		$("#rr_instructions").css({'display' : 'none'});
		$("#rr_instructions").removeClass('fadeInRight');
	}else{
		$("#rr_instructions").css({'display' : 'inline-block'});
		$("#rr_instructions").addClass('fadeInRight');
	}
});