import "framework/trustful_contract.sol";
import "framework/contract_provider.sol";
import "polls/poll_registry.sol";
import "polls/poll.sol";

contract PollManager is TrustfulContract {

    function create(bytes _topic, bytes _firstChoice, bytes _secondChoice) returns (bool status) {

        // If Trustful address is not set
        if (TRUSTFUL == 0x0) return false;

        // Get addresses of involved registries
        address userRegistryAddr = ContractProvider(TRUSTFUL).contracts("UserRegistry");
        address pollRegistryAddr = ContractProvider(TRUSTFUL).contracts("PollRegistry");

        // If user registry does not exist
        if (userRegistryAddr == 0x0 || pollRegistryAddr == 0x0) return false;

        // Get next user ID
        uint pollId = PollRegistry(pollRegistryAddr).getNextPollId();
        
        // Create new user
        Poll poll = new Poll(TRUSTFUL, pollId, _topic, _firstChoice, _secondChoice);

        // Get user address
        address pollAddr = address(poll);
        
        // Update registries
        PollRegistry(pollRegistryAddr).setPollContract(pollId, pollAddr);
    }
}
