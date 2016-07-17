import "framework/trustful_entity.sol";
import "framework/contract_provider.sol";
import "users/user_registry.sol";

contract Poll is TrustfulEntity {

    uint id;
    bytes topic;
    bytes firstChoice;
    bytes secondChoice;
    uint firstVotes;
    uint secondVotes;
    mapping (uint => bool) voted;

    function Poll(
        address _TRUSTFUL,
        uint _id,
    	bytes _topic,
        bytes _firstChoice,
        bytes _secondChoice
    ) TrustfulEntity(_TRUSTFUL) {
        id = _id;
        topic = _topic;
        firstChoice = _firstChoice;
        secondChoice = _secondChoice;
    }

    function details() constant returns (bytes _topic, bytes _firstChoice, bytes _secondChoice) {
        return (topic, firstChoice, secondChoice);
    }

    function results() constant returns (uint _firstVotes, uint _secondVotes) {
        return (firstVotes, secondVotes);
    }

    function checkVoted(uint _userId) constant returns (bool _voted) {
        return voted[_userId];
    }

    function vote(
        uint _userId,
        bool _choice
    ) returns (bool result) {
        
        // User already vorted
        if (voted[_userId]){
            return false;
        }

        // Cast vote
        if (_choice == true){
            firstVotes++;
        } else {
            secondVotes++;
        }

        // Restrict further votes for this user
        voted[_userId] = true;

        return true;
    }
}
