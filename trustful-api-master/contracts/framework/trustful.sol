import "framework/owned.sol";
import "framework/trustful_contract.sol";

contract Trustful is owned {

    mapping (bytes32 => address) public contracts;

    // Bind a new contract to the main contract. This will overwrite an existing contract.
    function addContract(bytes32 name, address addr) onlyOwner returns (bool result) {
        TrustfulContract tc = TrustfulContract(addr);
        if (!tc.setTrustfulAddress(address(this))) return false;
        contracts[name] = addr;
        return true;
    }

    // Remove a contract from the main contract.
    function removeContract(bytes32 name) onlyOwner returns (bool result) {
        if (contracts[name] == 0x0) return false;
        contracts[name] = 0x0;
        return true;
    }
}
