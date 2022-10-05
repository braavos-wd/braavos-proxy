MyLibrary.activePoll = false;

//RBW card refresh
async function port_RBWallet(){

	var rbwallet = MyLibrary.liquidity_pool_addy;
	var first = rbwallet.substring(0, 8);//get first 5 chars
	var last = rbwallet.slice(rbwallet.length - 5);//get last 5
	var trancatedAdd = first+'...'+last;
	$('#rbwWallet').empty().append('<a href="'+MyLibrary.etherScan+'/address/'+rbwallet+'" target="_blank" title="view on EtherScan..">'+trancatedAdd+'</a><img src="img/external.svg" />');
	//net outflows
	var liquidityLimit = await tokenInst.methods._liquidityLimit().call();
	var liquidityLimitPF = parseFloat(liquidityLimit);
		var liquidityLimit = fromWeiToFixed5(String(liquidityLimit));
	var liquidityFunded = await tokenInst.methods._liquidityAdded().call();
	var liquidityFundedPF = parseFloat(liquidityFunded);
		var liquidityFunded = (liquidityFunded / Math.pow(10, MyLibrary.decimals)).toFixed(2);
	var liquidityFundedBNB = await tokenInst.methods._liquidityFunding().call();
	var liquidityFundedBNBPF = parseFloat(liquidityFundedBNB);
		var liquidityFundedBNB = fromWeiToFixed5(String(liquidityFundedBNB));//bnb funded
	//lp balance
	var pair = await tokenInst.methods._pairAddress().call();
	//poolInst
	var poolABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
	var poolInst = new web3.eth.Contract(poolABI, pair);
  	var reserves = await poolInst.methods.getReserves().call();
	var poolBNB = fromWeiToFixed5(reserves[1]);//1 for braavos/eth && 0 for eth/braavos

	$('#dot_Pol').css('display', 'inline-block');
	//display outflows
	$('#targetAmount').empty().append(liquidityLimit+' bnb');
	$('#lpBal').empty().append(poolBNB+' bnb');//lppool balance
	//raised so far bnb & tokens
	$('#liqFundedBNB').empty().append(liquidityFundedBNB+' bnb');	
	$('#liqFBNB').empty().append('{BNB '+liquidityFundedBNB+'}');
	$('#liqFTOKENS').empty().append('{TOKENS '+liquidityFunded+'}');

	//Calibration: 
	var length = (liquidityFundedBNBPF / liquidityLimitPF) * 100;
	if(length < 0){ //we are too far behind
		var length = 0;
	}else if(length > 100){//upper limit
		var length = 100;
	}
	
	$('#meter_bar').css({'display': 'block', 'right' : length+'%'});
	//reset
	$('#addLiquidity').removeAttr('style');
	$('#addLiquidity').prop('disabled', false);
	//check rbb verdict
	if(length<100){
		$('#rbbVerdict').empty().append('{liquidity funding open}');
	}else{
		$('#rbbVerdict').empty().append('{liquidity funding closed}');
		$('#addLiquidity').prop('disabled', true);
	}
	
	return;
}

//Fund Liquidity
async function fundLiquidity(bnbAmount){
	var text = "If you fund liquidity, you will not receive LP tokens or project tokens. You woud have invested your BNB in the liquidityFund and you will be paid directly from project fees before rewards or buybacks or business dev wallet. Your BNB will be paid with 20% added interest. Payback time varies with volume, the more the volume the faster the repayment. ";
		swal({
			title: "Funding Liquidity",
			type: "info", //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	//prepare values
	var bnbAmount = web3.utils.toWei(String(bnbAmount), 'ether');
	var bnbAmountPF = parseFloat(bnbAmount);
	var bnbAmount = web3.utils.toBN(bnbAmount);//received in wei
	var price = await tokenInst.methods.price().call();
	var price = parseFloat(price);
	var tokensAmount = bnbAmountPF / price;
	var tokensAmount = parseInt(tokensAmount);
	var tokens = web3.utils.toWei(String(tokensAmount), 'ether'); 
	var tokens = web3.utils.toBN(tokens);
	//estimate gasLimit
	var encodedData = tokenInst.methods.fundLiquidity(tokens).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		value: bnbAmount,
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//transaction
	tokenInst.methods.fundLiquidity(tokens).send({from: MyLibrary.wallet, value: bnbAmount, gasPrice: gasPrice, gasLimit: estimateGas})
	.on('receipt', function(receipt){//listen
		console.log('Mined', receipt);
        if(receipt.status == true){//1 also matches true
			
        }
        else{
            console.log('Transaction Failed Receipt status: '+receipt.status);
            swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
        }
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		
    })
	.on('error', (error) => {//listen
		var text = error.message;
		console.log(error);
		swal({
			title: "Cancelled.",
			type: "error",
			allowOutsideClick: true,
			text: text,
			html: false,
			confirmButtonColor: "#8e523c"
		});
	});
}
//TRANSACTION NOTIFICATION
tokenInst.events.LiquidityFunded()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event); 
		var owed = event.returnValues[2];
		var funded = event.returnValues[1];
		var tx_hash = event.transactionHash;
		var owed = fromWeiToFixed5_unrounded(owed);
		var funded = fromWeiToFixed5_unrounded(funded);

		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Funded Successfully';
		var nonTxAction = 'You have invested '+funded+'BNB. To be repaid as '+owed+'BNB by contract';
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		updateFundAmounts();
		port_RBWallet();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//Withdraw Liquidity
async function withdrawLiquidity(bnbAmount){
	var text = "Withdraw your funding investment with interest. The funds are kept in a pool on the contract, only funders can withdraw. Make sure the pool balance is sufficient to cover your withdrawal before withdrawing.";
		swal({
			title: "Withdrawing Liquidity Funding",
			type: "info", //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
			text: text,
			allowOutsideClick: true,
			confirmButtonColor: "#8e523c"
		});
	//prepare values
	var bnbAmount = web3.utils.toWei(String(bnbAmount), 'ether');
	
	//estimate gasLimit
	var encodedData = tokenInst.methods.liquidityWithdraw(bnbAmount).encodeABI();
	var estimateGas = await web3.eth.estimateGas({
		data: encodedData,
		from: MyLibrary.wallet,
		to: MyLibrary.tokenAddress
	});
	// estimate the gasPrice
	var gasPrice = await web3.eth.getGasPrice(); 
	//transaction
	tokenInst.methods.liquidityWithdraw(bnbAmount).send({from: MyLibrary.wallet, gasPrice: gasPrice, gasLimit: estimateGas})
	.on('receipt', function(receipt){//listen
		console.log('Mined', receipt);
		if(receipt.status == true){//1 also matches true
			
		}
		else{
			console.log('Transaction Failed Receipt status: '+receipt.status);
			swal({title: "Failed.",type: "error",allowOutsideClick: true,confirmButtonColor: "#F27474",text: "Transaction Failed Receipt status: "+receipt.status});
		}
	})
	.on('confirmation', (confirmationNumber, receipt) => {
		
	})
	.on('error', (error) => {//listen
		var text = error.message;
		console.log(error);
		swal({
			title: "Cancelled.",
			type: "error",
			allowOutsideClick: true,
			text: text,
			html: false,
			confirmButtonColor: "#8e523c"
		});
	});
}
//TRANSACTION NOTIFICATION
tokenInst.events.RepaidWithLove()
	.on('data', function(event){
		//if(event.from != MyLibrary.wallet){return;}
		console.log(event); 
		var balance = event.returnValues[2];
		var withdrawalAmnt = event.returnValues[1];
		var tx_hash = event.transactionHash;
		var balance = fromWeiToFixed5_unrounded(balance);
		var withdrawalAmnt = fromWeiToFixed5_unrounded(withdrawalAmnt);

		var outputCurrency = '';//using nonTxBased message with empty currency
		var type = 'success';//or error
		var wallet = '';
		var message = 'Withdrawn Successfully';
		var nonTxAction = 'You have withdrawn '+funded+'BNB from your liquidityFund position. Balance of: '+balance+'BNB due';
		popupSuccess(type,outputCurrency,tx_hash,message,0,0,wallet,nonTxAction);
		updateFundAmounts();
		port_RBWallet();
	})
	.on('changed', function(event){
		// remove event from local database
		console.log(event);
	})
	.on('error', console.error);

//============================================================================
//CLICK INITIATED CALLS
//HANDLE ALL EVENTS HERE
//Fund Liquidity
$(document).on('click', '#fund', function(e){
	var inputAmnt = $('#fund_amnt').val();
	fundLiquidity(inputAmnt);
});
$(document).on('click', '#withdraw', function(e){
	var inputAmnt = $('#withdraw_amnt').val();
	withdrawLiquidity(inputAmnt);
});
//withdrawal stamps
$(document).on('click', '#stampApprove', function(e){
	var vote = 1;//true
	stampSlip(vote);
});
$(document).on('click', '#stampDecline', function(e){
	var vote = 0;//false
	stampSlip(vote);
});
$(document).on('click', '#concludeVote', function(e){
	var vote = 1;//true
	stampSlip(vote);
});
