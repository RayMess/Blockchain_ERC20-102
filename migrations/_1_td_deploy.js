var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var Exercice= artifacts.require("ExerciceSolution.sol")
var ERC20Mintable= artifacts.require("ERC20Mintable.sol")


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts); 
		await ExerciceSub(deployer,network,accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}


async function ExerciceSub(deployer,network,accounts){
	//init
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Init balance:"+ getBalance.toString());
	myExoT = await ERC20Mintable.new("MintableToken","MTK");
	myExo= await Exercice.new(ClaimableToken.address,myExoT.address);
	await myExoT.setMinter(myExo.address,true);



	//claim tokens
	await ClaimableToken.claimTokens();

	//ex1
	await Evaluator.ex1_claimedPoints();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex1 balance" + getBalance.toString());

	await Evaluator.submitExercice(myExo.address);

	//ex2
	await Evaluator.ex2_claimedFromContract();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex2 balance" + getBalance.toString());


	//ex3
	await Evaluator.ex3_withdrawFromContract();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex3 balance" + getBalance.toString());

	//ex4
	await ClaimableToken.approve(myExo.address,500);
	await Evaluator.ex4_approvedExerciceSolution();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex4 balance" + getBalance.toString());

	//ex5
	await ClaimableToken.decreaseAllowance(myExo.address,500)
	await Evaluator.ex5_revokedExerciceSolution();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex5 balance" + getBalance.toString());

	//ex6
	await Evaluator.ex6_depositTokens();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex6 balance" + getBalance.toString());

	//ex7

	await Evaluator.ex7_createERC20();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex7 balance" + getBalance.toString());

	//ex8

	await Evaluator.ex8_depositAndMint();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex8 balance" + getBalance.toString());

	//ex9

	await myExo.claimTokensOnBehalf();
	await Evaluator.ex9_withdrawAndBurn();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex9 balance" + getBalance.toString());
}