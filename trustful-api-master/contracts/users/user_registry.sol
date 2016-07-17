import "framework/trustful_contract.sol";
import "framework/contract_provider.sol";

contract UserRegistry is TrustfulContract {

	uint public userCounter;
	mapping (uint => address) userContracts;

	function getNextUserId() onlyUserManager returns (uint nextUserId){
		return ++userCounter;
	}

	function setUserContract(uint userId, address userContract) onlyUserManager returns (bool result){
		userContracts[userId] = userContract;
		return true;
	}

	function getUserContract(uint userId) returns (address userContract){
		return userContracts[userId];
	}

    modifier onlyUserManager {
        if (TRUSTFUL == 0x0) return;
        address managerAddr = ContractProvider(TRUSTFUL).contracts("UserManager");
        if (msg.sender == managerAddr) _
    }
}
