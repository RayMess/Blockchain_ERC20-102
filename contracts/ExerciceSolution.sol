import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution is IExerciceSolution
{
    ERC20Claimable claimableERC20;
    mapping(address=>uint) public comptes;
    ERC20Mintable mintableERC20;
    

    constructor(ERC20Claimable _claimableERC20,ERC20Mintable _mintableERC20) 
	public 
	{
		claimableERC20 = _claimableERC20;
        mintableERC20 = _mintableERC20;
	}

    function claimTokensOnBehalf() override external
    {
        claimableERC20.claimTokens();
        comptes[msg.sender]+=claimableERC20.distributedAmount();
        mintableERC20.mint(msg.sender, comptes[msg.sender]);

    }

	function tokensInCustody(address callerAddress) override external returns (uint256)
    {
        return comptes[callerAddress];
    }

	function withdrawTokens(uint256 amountToWithdraw) override external returns (uint256)
    {   
        comptes[msg.sender]-=amountToWithdraw;
        claimableERC20.transfer(msg.sender,amountToWithdraw);
        mintableERC20.burn(msg.sender,amountToWithdraw);
        return comptes[msg.sender];
    }

	function depositTokens(uint256 amountToWithdraw) override external returns (uint256)
    {
        claimableERC20.transferFrom(msg.sender,address(this),amountToWithdraw);
        comptes[msg.sender]+=amountToWithdraw;
        mintableERC20.mint(msg.sender, amountToWithdraw);
        return comptes[msg.sender];
    }

	function getERC20DepositAddress() override external returns (address)
    {
        return address(mintableERC20);
    }
}