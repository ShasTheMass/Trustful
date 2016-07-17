import "framework/trustful_contract.sol";
import "framework/contract_provider.sol";

contract PollRegistry is TrustfulContract {

	uint public pollCounter;
	mapping (uint => address) pollContracts;

	function getNextPollId() onlyPollManager returns (uint nextPollId){
		return ++pollCounter;
	}

	function setPollContract(uint pollId, address pollContract) onlyPollManager returns (bool result){
		pollContracts[pollId] = pollContract;
		return true;
	}

	function getPollContract(uint pollId) returns (address pollContract){
		return pollContracts[pollId];
	}

    modifier onlyPollManager {
        if (TRUSTFUL == 0x0) return;
        address managerAddr = ContractProvider(TRUSTFUL).contracts("PollManager");
        if (msg.sender == managerAddr) _
    }
}
