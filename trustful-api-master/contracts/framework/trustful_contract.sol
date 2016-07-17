contract TrustfulContract {

    address TRUSTFUL;

    function setTrustfulAddress(address trustfulAddr) returns (bool result){
        if (TRUSTFUL != 0x0 && msg.sender != TRUSTFUL) return false;
        TRUSTFUL = trustfulAddr;
        return true;
    }

    function remove(){
        if (msg.sender == TRUSTFUL){
            suicide(TRUSTFUL);
        }
    }
}
