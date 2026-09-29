import { createContext, useState } from "react";

// Create the context
export const contextAuth = createContext();

function ContextProvider({ children }) {
    const [logoAndIdentityData, setLogoAndIdentityData] = useState({});
    const [frontendData, setFrontendData] = useState({});
    const [merchantAll, setMerchantAll] = useState([]);
    const [countries, setCountries] = useState([]);
    const [user, setUser] = useState({});
    const [manualMethodList, setManualMethodList] = useState([]);
    const authValue = {
        logoAndIdentityData,
        setLogoAndIdentityData,
        frontendData,
        setFrontendData,
        merchantAll,
        setMerchantAll,
        countries,
        setCountries,
        user,
        setUser,
        manualMethodList,
        setManualMethodList
    };
    return (
        <contextAuth.Provider value={authValue}>
            {children}
        </contextAuth.Provider>
    );
}

export default ContextProvider;
