pragma solidity ^0.4.17;

contract Lottery {
    
    address public manager;
    address [] public players;
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function getPlayers() public view returns(address[]){
        return players;
    }
    
    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    function random() private view returns(uint){
        return uint(sha3(block.difficulty,players,now));
    }
    
    function pickWinner()  public restricted returns(address){
        address winner = players[random() % players.length];
        winner.transfer(this.balance);
        players = new address[](0);
        return winner;
    }
}
