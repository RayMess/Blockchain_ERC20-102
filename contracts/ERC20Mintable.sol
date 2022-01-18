pragma solidity >=0.6.0 <0.8.0;

import "./IERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ExerciceSolution.sol";

contract ERC20Mintable is ERC20
{
    ExerciceSolution myExo;
    mapping(address=>bool) minter;

	constructor(string memory name, string memory symbol) public ERC20(name, symbol) 
	{
        minter[msg.sender]=false;
	}

    function setMinter(address minterAddress, bool isMinter)  external
    {
        minter[minterAddress]=isMinter;
    }

    function isMinter(address minterAddress)  external returns (bool)
    {
        return minter[minterAddress];
    }

	function mint(address toAddress, uint256 amount)  external
    {
        require(minter[msg.sender],"You are not a minter");
        _mint(toAddress,amount);
    }

	function burn(address toAddress, uint256 amount)  external
    {
        require(minter[msg.sender],"You are not a minter");
        _burn(toAddress,amount);
    }


}