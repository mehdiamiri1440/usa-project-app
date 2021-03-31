import React, { createContext } from 'react';

const MessagesContext = createContext({
    searchText: '',
    resetSearch: _ => { }
});

export default MessagesContext;