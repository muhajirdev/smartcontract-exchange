pragma solidity >=0.4.21 <0.7.0;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ERC20Interface {
    function totalSupply() public view returns (uint256);
    function balanceOf(address tokenOwner)
        public
        view
        returns (uint256 balance);
    function allowance(address tokenOwner, address spender)
        public
        view
        returns (uint256 remaining);
    function transfer(address to, uint256 tokens) public returns (bool success);
    function approve(address spender, uint256 tokens)
        public
        returns (bool success);
    function transferFrom(address from, address to, uint256 tokens)
        public
        returns (bool success);

    event Transfer(address indexed from, address indexed to, uint256 tokens);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );
}

contract Exchange {
    address admin;
    address public MGCAddress;
    address public JVCAddress;
    uint256 public MGCPrice;

    constructor(address _JVCAddress, address _MGCAddress, uint256 _MGCPrice)
        public
    {
        admin = msg.sender;

        MGCAddress = _MGCAddress;
        JVCAddress = _JVCAddress;

        MGCPrice = _MGCPrice;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    event Sell(address _buyer, uint256 _amount);

    function buyMGCWithJVC(uint256 _numberOfTokens) public payable {
        // Send MGC to user
        require(
            ERC20Interface(MGCAddress).transfer(msg.sender, _numberOfTokens),
            "Fail to send mgc from exchnage to user"
        );

        // Take  user's MGC
        require(
            ERC20Interface(JVCAddress).transferFrom(
                msg.sender,
                this,
                multiply(_numberOfTokens, MGCPrice)
            ),
            "Fail to take JVC from user to exchange"
        );

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, "you are not admin");
        require(
            ERC20Interface(MGCAddress).transfer(
                admin,
                ERC20Interface(MGCAddress).balanceOf(this)
            ),
            "Fail to return MGC to admin wallet"
        );

    }

}
