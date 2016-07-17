import "framework/trustful_entity.sol";

contract User is TrustfulEntity {

    uint id;
    bytes name;
    bytes email;
    bytes password;
    
    function User(
        address _TRUSTFUL,
    	uint _id, 
    	bytes _name, 
    	bytes _email, 
    	bytes _password
    ) TrustfulEntity(_TRUSTFUL) {
    	id = _id;
    	name = _name;
    	email = _email;
    	password = _password;
    }

    function details() constant returns (bytes _name, bytes _email, bytes _password) {
        return (name, email, password);
    }
}
