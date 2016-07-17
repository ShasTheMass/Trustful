import "framework/trustful_contract.sol";
import "framework/contract_provider.sol";
import "users/user_registry.sol";
import "users/user.sol";

contract UserManager is TrustfulContract {

    function create(bytes _name, bytes _email, bytes _password) returns (bool result) {

        // If Trustful address is not set
        if (TRUSTFUL == 0x0) return false;

        // Get addresses of involved registries
        address userRegistryAddr = ContractProvider(TRUSTFUL).contracts("UserRegistry");

        // If user registry does not exist
        if (userRegistryAddr == 0x0) return false;

        // Get next user ID
        uint userId = UserRegistry(userRegistryAddr).getNextUserId();
        
        // Create new user
        User user = new User(TRUSTFUL, userId, _name, _email, _password);

        // Get user address
        address userAddr = address(user);
        
        // Update registries
        UserRegistry(userRegistryAddr).setUserContract(userId, userAddr);

        return true;
    }
}
